import fs from "node:fs";

const fountainInputPath = "C:/tmp/trinkbrunnen.json";
const bathingInputPath = "C:/tmp/badestellen.json";
const outputPath = "src/data/water_places.ts";

const fountainSource =
  "https://data.wien.gv.at/daten/geo?service=WFS&version=1.1.0&request=GetFeature&typeName=ogdwien:TRINKBRUNNENOGD&srsName=EPSG:4326&outputFormat=json";
const bathingSource =
  "https://data.wien.gv.at/daten/geo?service=WFS&version=1.1.0&request=GetFeature&typeName=ogdwien:BADESTELLENOGD&srsName=EPSG:4326&outputFormat=json";

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

const fountainData = readJson(fountainInputPath);
const bathingData = readJson(bathingInputPath);

const drinking = fountainData.features
  .filter((feature) => drinkTypes.has(feature.properties.BASIS_TYP_TXT))
  .map((feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    const type = feature.properties.BASIS_TYP_TXT;
    const id = feature.properties.OBJECTID;

    return {
      id: `drinking-water-${id}`,
      name: `Drinking water point ${id}`,
      address: coordinateAddress(lat, lng),
      district: "Vienna",
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
        "Official Vienna open-data drinking-water point. Availability can vary seasonally or during maintenance.",
      sourceUrls: [fountainSource],
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

    return {
      id: `refresh-fountain-${id}`,
      name: `${type} ${id}`,
      address: coordinateAddress(lat, lng),
      district: "Vienna",
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
        "Official Vienna open-data water feature for cooling down or getting wet. This is not a monitored swimming site; follow posted local rules.",
      sourceUrls: [fountainSource],
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
    sourceUrls: [props.WEITERE_INFO || bathingSource, bathingSource],
    placeType: "water",
    accessibility: "unknown",
  };
});

const output = `import type { CompactPlace } from "./vienna_cool_places";

// Generated from public City of Vienna Open Government Data WFS layers.
// Source layers: ogdwien:TRINKBRUNNENOGD and ogdwien:BADESTELLENOGD.

export const VIENNA_DRINKING_WATER_FOUNTAINS: CompactPlace[] = ${JSON.stringify(
  drinking,
)};

export const VIENNA_WATER_ACCESS_PLACES: CompactPlace[] = ${JSON.stringify(
  [...bathingSites, ...refreshFountains],
)};
`;

fs.writeFileSync(outputPath, output);

console.log(
  `Generated ${drinking.length} drinking-water points and ${
    bathingSites.length + refreshFountains.length
  } water-access/refresh points.`,
);
