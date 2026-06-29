import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2] ?? "C:/tmp/vienna_public_toilets_osm.json";
const outputPath = process.argv[3] ?? "src/data/public_toilet_places.ts";
const addressInputPath = process.argv[4] ?? "C:/tmp/adressen_compact.json";

const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const elements = raw.elements ?? [];

const VIENNA_PUBLIC_WC_URL = "https://www.wien.gv.at/zusammenleben/oeffentliche-wc";
const coordinateAddress = (lat, lng) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
const roundCoord = (value) => Number(value.toFixed(8));

const slugify = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);

const normalizeHours = (value) => {
  if (!value) return [];
  if (value === "24/7") return ["Mon - Sun: 00:00 - 24:00"];

  const normalized = value
    .replace(/\bMo\b/g, "Mon")
    .replace(/\bTu\b/g, "Tue")
    .replace(/\bWe\b/g, "Wed")
    .replace(/\bTh\b/g, "Thu")
    .replace(/\bFr\b/g, "Fri")
    .replace(/\bSa\b/g, "Sat")
    .replace(/\bSu\b/g, "Sun")
    .replace(/\bPH\b/g, "PH")
    .replace(/;/g, "; ");

  return [normalized];
};

const accessibilityFromWheelchair = (value) => {
  if (value === "yes") return "yes";
  if (value === "limited") return "limited";
  if (value === "no") return "no";
  return "unknown";
};

const districtFromPostcode = (postcode) => {
  const match = String(postcode ?? "").match(/^1(\d{2})0$/);
  if (!match) return "";
  const district = Number(match[1]);
  return district >= 1 && district <= 23 ? String(district) : "";
};

const hasPrivateAccess = (tags) => {
  const access = String(tags.access ?? "").toLowerCase();
  return ["private", "customers", "no"].includes(access);
};

const normalizeDistrict = (district) => {
  const parsed = Number.parseInt(String(district ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : "Vienna";
};

const loadAddressIndex = () => {
  if (!fs.existsSync(addressInputPath)) {
    console.warn(
      `Address enrichment skipped: ${addressInputPath} not found. Pass a compact ogdwien:ADRESSENOGD GeoJSON as the fourth argument for better toilet names.`,
    );
    return null;
  }

  const addressData = JSON.parse(fs.readFileSync(addressInputPath, "utf8"));
  const cellSize = 0.004;
  const cells = new Map();

  const cellKey = (lat, lng) => `${Math.floor(lat / cellSize)}:${Math.floor(lng / cellSize)}`;
  const addToCell = (address) => {
    const key = cellKey(address.lat, address.lng);
    const list = cells.get(key) ?? [];
    list.push(address);
    cells.set(key, list);
  };

  for (const feature of addressData.features ?? []) {
    const [lng, lat] = feature.geometry?.coordinates ?? [];
    const props = feature.properties ?? {};
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !props.NAME) continue;

    addToCell({
      lat,
      lng,
      name: props.NAME,
      street: props.NAME_STR || props.NAME,
      postcode: props.PLZ || null,
      district: normalizeDistrict(props.GEB_BEZIRK),
    });
  }

  const distanceSquared = (aLat, aLng, bLat, bLng) => {
    const latScale = 111320;
    const lngScale = Math.cos((aLat * Math.PI) / 180) * 111320;
    const dLat = (aLat - bLat) * latScale;
    const dLng = (aLng - bLng) * lngScale;
    return dLat * dLat + dLng * dLng;
  };

  const nearest = (lat, lng) => {
    const baseLat = Math.floor(lat / cellSize);
    const baseLng = Math.floor(lng / cellSize);
    let best = null;
    let bestDistance = Infinity;

    for (let radius = 0; radius <= 4; radius++) {
      for (let latOffset = -radius; latOffset <= radius; latOffset++) {
        for (let lngOffset = -radius; lngOffset <= radius; lngOffset++) {
          if (Math.max(Math.abs(latOffset), Math.abs(lngOffset)) !== radius) continue;
          const list = cells.get(`${baseLat + latOffset}:${baseLng + lngOffset}`);
          if (!list) continue;

          for (const address of list) {
            const distance = distanceSquared(lat, lng, address.lat, address.lng);
            if (distance < bestDistance) {
              best = address;
              bestDistance = distance;
            }
          }
        }
      }

      if (best) return best;
    }

    return null;
  };

  return { nearest };
};

const addressFromTags = (tags) => {
  const streetAddress = [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(" ").trim();
  if (!streetAddress) return null;

  return tags["addr:postcode"] ? `${streetAddress}, ${tags["addr:postcode"]} Wien` : streetAddress;
};

const locationFromTagsAndAddressIndex = (tags, addressIndex, lat, lng) => {
  const taggedAddress = addressFromTags(tags);
  if (taggedAddress) {
    return {
      address: taggedAddress,
      district: districtFromPostcode(tags["addr:postcode"]) || "Vienna",
      label: [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(" ").trim(),
    };
  }

  const nearest = addressIndex?.nearest(lat, lng) ?? null;
  if (!nearest) {
    const coordinateLabel = coordinateAddress(lat, lng);
    return {
      address: coordinateLabel,
      district: "Vienna",
      label: coordinateLabel,
    };
  }

  return {
    address: nearest.postcode ? `${nearest.name}, ${nearest.postcode} Wien` : nearest.name,
    district: nearest.district,
    label: nearest.name,
  };
};

const meaningfulName = (tags) => {
  const raw = String(tags.name || tags.loc_name || "").trim();
  if (!raw) return null;
  if (/^(public\s*)?(toilet|toilets|wc|restroom|bathroom|öffentliche?s?\s*wc)$/i.test(raw)) {
    return null;
  }
  return raw;
};

const displayNameForToilet = (tags, location) => {
  const specificName = meaningfulName(tags);
  if (!specificName) return `WC - ${location.label}`;

  const normalizedName = specificName.toLowerCase();
  const normalizedLocation = location.label.toLowerCase();
  if (normalizedName.includes(normalizedLocation) || normalizedLocation.includes(normalizedName)) {
    return `WC - ${specificName}`;
  }

  return `WC - ${specificName} - ${location.label}`;
};

const addressIndex = loadAddressIndex();

const sortedPlaces = elements
  .filter((element) => element.tags?.amenity === "toilets")
  .filter((element) => !hasPrivateAccess(element.tags))
  .map((element) => {
    const tags = element.tags ?? {};
    const lat = element.lat ?? element.center?.lat;
    const lng = element.lon ?? element.center?.lon;
    if (typeof lat !== "number" || typeof lng !== "number") return null;

    const location = locationFromTagsAndAddressIndex(tags, addressIndex, lat, lng);
    const readableName = displayNameForToilet(tags, location);
    const feeRequired = tags.fee === "yes" || Boolean(tags.charge);
    const amenities = ["Public toilet", "OpenStreetMap toilet point"];

    if (/stadt wien|gemeinde wien|ma\s*48|magistrat/i.test(tags.operator ?? "")) {
      amenities.push("Official Vienna public WC information");
    }
    if (tags.wheelchair === "yes" || tags["toilets:wheelchair"] === "yes") amenities.push("Wheelchair accessible");
    if (tags.changing_table === "yes") amenities.push("Changing table");
    if (feeRequired) amenities.push("Fee may apply");
    if (tags.fee === "no") amenities.push("Free public toilet");
    if (tags.opening_hours === "24/7") amenities.push("24/7");
    if (tags.drinking_water === "yes") amenities.push("Drinking water");
    if (tags.shower === "yes") amenities.push("Shower");
    if (tags.supervised === "yes") amenities.push("Staffed public toilet");
    if (tags.centralkey === "yes") amenities.push("Euro-key");
    if (tags["toilets:menstrual_products"] === "yes") amenities.push("Tampon/pad dispenser");

    return {
      id: `public-toilet-${element.type}-${element.id}`,
      name: readableName,
      address: location.address,
      district: location.district,
      lat: roundCoord(lat),
      lng: roundCoord(lng),
      category: "Public Toilet",
      coolingType: "public_toilet",
      ac: null,
      sitting: null,
      wifi: null,
      amenities,
      hours: normalizeHours(tags.opening_hours),
      free: !feeRequired,
      notes:
        "Public toilet point from OpenStreetMap. Address labels use OSM address tags or the nearest official Vienna address point where available. Check local signs for temporary closures or fees.",
      sourceUrls: [
        `https://www.openstreetmap.org/${element.type}/${element.id}`,
        VIENNA_PUBLIC_WC_URL,
      ],
      placeType: "toilet",
      accessibility: accessibilityFromWheelchair(tags.wheelchair ?? tags["toilets:wheelchair"]),
      accessibilitySource:
        tags.wheelchair || tags["toilets:wheelchair"] ? "OpenStreetMap wheelchair tag" : undefined,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name, "de") || a.id.localeCompare(b.id));

const output = `import type { CompactPlace } from "./vienna_cool_places";

// Generated from OpenStreetMap amenity=toilets points in Vienna.
// City source context: ${VIENNA_PUBLIC_WC_URL}

export const VIENNA_PUBLIC_TOILET_PLACES: CompactPlace[] = ${JSON.stringify(sortedPlaces)};
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output, "utf8");
console.log(`Wrote ${sortedPlaces.length} public toilet places to ${outputPath}`);
