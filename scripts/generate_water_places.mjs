import fs from "node:fs";

const fountainInputPath = "C:/tmp/trinkbrunnen.json";
const bathingInputPath = "C:/tmp/badestellen.json";
const addressInputPath = "C:/tmp/adressen_compact.json";
const drinkingOutputPath = "src/data/drinking_water_places.ts";
const waterOutputPath = "src/data/water_access_places.ts";

const fountainDatasetPage = "https://www.data.gv.at/suche/?searchterm=TRINKBRUNNENOGD";
const bathingDatasetPage = "https://www.data.gv.at/suche/?searchterm=BADESTELLENOGD";
const bathingInfoPage =
  "https://www.wien.gv.at/forschung/laboratorien/umweltmedizin/wasserhygiene/badewasserqualitaet/index.html";

const drinkTypes = new Set([
  "Trinkbrunnen",
  "Trinkbrunnen mit Tränke",
  "Trinkhydrant",
  "Trinkhydrant mit Tränke",
  "Mobiler Trinkbrunnen mit Sprühnebelfunktion",
]);

const refreshTypes = new Set([
  "Sommerspritzer",
  "Mobiler Trinkbrunnen mit Sprühnebelfunktion",
  "Sprühnebeldusche",
  "Spielbrunnen",
  "Wasserspielmöglichkeit",
  "Bodenfontäne",
]);

const readJson = (path) => JSON.parse(fs.readFileSync(path, "utf8"));
const roundCoord = (value) => Number(value.toFixed(8));
const coordinateAddress = (lat, lng) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

const slug = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const drinkCategory = (type) =>
  type.includes("Hydrant") ? "Drinking Water Hydrant" : "Drinking Water Fountain";

const refreshCategory = (type) =>
  /Spritz|Sprüh|Sprühnebel/.test(type) ? "Mist / Spray Cooling" : "Water Play Fountain";

const displayType = (type) => {
  if (type.includes("Hydrant")) return "Trinkhydrant";
  if (/Spritz|Sprüh|Sprühnebel/.test(type)) return "Sprühnebel";
  if (/Spiel|Wasserspiel|Fontäne|Bodenfont/.test(type)) return "Wasserspiel";
  return "Trinkbrunnen";
};

const normalizeDistrict = (district) => {
  const parsed = Number.parseInt(String(district ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : "Vienna";
};

const loadAddressIndex = () => {
  if (!fs.existsSync(addressInputPath)) {
    console.warn(
      `Address enrichment skipped: ${addressInputPath} not found. Download ogdwien:ADRESSENOGD with NAME,NAME_STR,PLZ,GEB_BEZIRK,SHAPE to improve water-place names.`,
    );
    return null;
  }

  const addressData = readJson(addressInputPath);
  const cellSize = 0.004;
  const cells = new Map();

  const cellKey = (lat, lng) => `${Math.floor(lat / cellSize)}:${Math.floor(lng / cellSize)}`;
  const addToCell = (address) => {
    const key = cellKey(address.lat, address.lng);
    const list = cells.get(key) ?? [];
    list.push(address);
    cells.set(key, list);
  };

  for (const feature of addressData.features) {
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

const enrichedLocation = (addressIndex, lat, lng) => {
  const nearest = addressIndex?.nearest(lat, lng) ?? null;
  if (!nearest) {
    return {
      address: coordinateAddress(lat, lng),
      district: "Vienna",
      label: coordinateAddress(lat, lng),
    };
  }

  const address = nearest.postcode ? `${nearest.name}, ${nearest.postcode} Wien` : nearest.name;
  return {
    address,
    district: nearest.district,
    label: nearest.name,
  };
};

const fountainData = readJson(fountainInputPath);
const bathingData = readJson(bathingInputPath);
const addressIndex = loadAddressIndex();

const drinking = fountainData.features
  .filter((feature) => drinkTypes.has(feature.properties.BASIS_TYP_TXT))
  .map((feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    const type = feature.properties.BASIS_TYP_TXT;
    const id = feature.properties.OBJECTID;
    const location = enrichedLocation(addressIndex, lat, lng);

    return {
      id: `drinking-water-${id}`,
      name: `${displayType(type)} - ${location.label}`,
      address: location.address,
      district: location.district,
      lat: roundCoord(lat),
      lng: roundCoord(lng),
      category: drinkCategory(type),
      coolingType: "drinking_water",
      ac: null,
      sitting: null,
      wifi: null,
      amenities: ["Drinking water", "Official Vienna Open Data", type],
      hours: [],
      free: true,
      notes:
        "Official Vienna open-data drinking-water point. Address label is based on the nearest official Vienna address point; availability can vary seasonally or during maintenance.",
      sourceUrls: [fountainDatasetPage],
      placeType: "drinking",
      accessibility: "unknown",
    };
  });

const refreshFountains = fountainData.features
  .filter((feature) => refreshTypes.has(feature.properties.BASIS_TYP_TXT))
  .map((feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    const type = feature.properties.BASIS_TYP_TXT;
    const id = feature.properties.OBJECTID;
    const location = enrichedLocation(addressIndex, lat, lng);

    return {
      id: `refresh-fountain-${id}`,
      name: `${displayType(type)} - ${location.label}`,
      address: location.address,
      district: location.district,
      lat: roundCoord(lat),
      lng: roundCoord(lng),
      category: refreshCategory(type),
      coolingType: "water_refresh",
      ac: null,
      sitting: null,
      wifi: null,
      amenities: ["Public water refresh point", "Official Vienna Open Data", type],
      hours: [],
      free: true,
      notes:
        "Official Vienna open-data water feature for cooling down or getting wet. Address label is based on the nearest official Vienna address point. This is not a monitored swimming site; follow posted local rules.",
      sourceUrls: [fountainDatasetPage],
      placeType: "water",
      accessibility: "unknown",
    };
  });

const bathingSites = bathingData.features.map((feature) => {
  const [lng, lat] = feature.geometry.coordinates;
  const props = feature.properties;
  const rowId = props.SE_SDO_ROWID || props.OBJECTID || slug(props.BEZEICHNUNG);
  const temperature = Number.isFinite(props.WASSERTEMPERATUR)
    ? `${props.WASSERTEMPERATUR}C`
    : null;
  const testedOn = props.UNTERSUCHUNGSDATUM
    ? String(props.UNTERSUCHUNGSDATUM).replace("Z", "")
    : null;

  const amenities = ["Official bathing-water monitoring"];
  if (props.BADEQUALITAET) {
    amenities.push(`Bathing water quality class ${props.BADEQUALITAET}`);
  }
  if (temperature) {
    amenities.push(`Water temperature ${temperature}`);
  }

  return {
    id: `bathing-site-${rowId}`,
    name: props.BEZEICHNUNG,
    address: coordinateAddress(lat, lng),
    district: props.BEZIRK ? String(props.BEZIRK) : "Vienna",
    lat: roundCoord(lat),
    lng: roundCoord(lng),
    category: props.TYP === 1 ? "Official Bathing Site" : "Natural Bathing Site",
    coolingType: "water_access",
    ac: null,
    sitting: null,
    wifi: null,
    amenities,
    hours: [],
    free: true,
    notes: `City of Vienna bathing-water monitoring point${
      testedOn ? ` last tested ${testedOn}` : ""
    }. Check local rules, currents, closures, and posted safety information before entering the water.`,
    sourceUrls: [bathingDatasetPage, props.WEITERE_INFO || bathingInfoPage],
    placeType: "water",
    accessibility: "unknown",
  };
});

const generatedHeader = `import type { CompactPlace } from "./vienna_cool_places";

// Generated from public City of Vienna Open Government Data WFS layers.
// Source layers: ogdwien:TRINKBRUNNENOGD, ogdwien:BADESTELLENOGD, and ogdwien:ADRESSENOGD for nearest-address labels.

`;

fs.writeFileSync(
  drinkingOutputPath,
  `${generatedHeader}export const VIENNA_DRINKING_WATER_FOUNTAINS: CompactPlace[] = ${JSON.stringify(
    drinking,
  )};
`,
);

fs.writeFileSync(
  waterOutputPath,
  `${generatedHeader}export const VIENNA_WATER_ACCESS_PLACES: CompactPlace[] = ${JSON.stringify(
    [...bathingSites, ...refreshFountains],
  )};
`,
);

console.log(
  `Generated ${drinking.length} drinking-water points and ${
    bathingSites.length + refreshFountains.length
  } water-access/refresh points.`,
);
