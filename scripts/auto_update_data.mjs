import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "make-vienna-cool-auto-"));
const dataDir = path.join(root, "src", "data");
const ignorePath = path.join(dataDir, "source_ignores.json");

const sourceFiles = {
  fountains: path.join(tempRoot, "trinkbrunnen.json"),
  bathing: path.join(tempRoot, "badestellen.json"),
  addresses: path.join(tempRoot, "adressen_compact.json"),
  toilets: path.join(tempRoot, "vienna_public_toilets_osm.json"),
};

const generatedFiles = {
  drinking: path.join(tempRoot, "drinking_water_places.ts"),
  water: path.join(tempRoot, "water_access_places.ts"),
  toilet: path.join(tempRoot, "public_toilet_places.ts"),
  metadata: path.join(tempRoot, "auto_update_metadata.ts"),
};

const trackedFiles = {
  drinking: path.join(dataDir, "drinking_water_places.ts"),
  water: path.join(dataDir, "water_access_places.ts"),
  toilet: path.join(dataDir, "public_toilet_places.ts"),
  metadata: path.join(dataDir, "auto_update_metadata.ts"),
};

const wfsUrl = (typeName, extraParams = {}) => {
  const url = new URL("https://data.wien.gv.at/daten/geo");
  url.searchParams.set("service", "WFS");
  url.searchParams.set("version", "1.1.0");
  url.searchParams.set("request", "GetFeature");
  url.searchParams.set("typeName", `ogdwien:${typeName}`);
  url.searchParams.set("srsName", "EPSG:4326");
  url.searchParams.set("outputFormat", "json");

  for (const [key, value] of Object.entries(extraParams)) {
    url.searchParams.set(key, value);
  }

  return url;
};

const overpassQuery = `
[out:json][timeout:60];
area["name"="Wien"]["boundary"="administrative"]["admin_level"="6"]->.searchArea;
(
  node["amenity"="toilets"](area.searchArea);
  way["amenity"="toilets"](area.searchArea);
  relation["amenity"="toilets"](area.searchArea);
);
out center tags;
`;

const fetchJson = async (label, url, options = {}) => {
  console.log(`Fetching ${label}: ${url}`);
  const response = await fetch(url, {
    ...options,
    headers: {
      "User-Agent": "make-vienna-cool-auto-update/1.0",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${label} fetch failed: ${response.status} ${response.statusText}\n${body.slice(0, 1200)}`);
  }

  return response.json();
};

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data), "utf8");
};

const assertFeatureCollection = (label, data, requiredProperties) => {
  if (data?.type !== "FeatureCollection" || !Array.isArray(data.features)) {
    throw new Error(`${label} schema changed: expected a GeoJSON FeatureCollection with a features array.`);
  }

  if (data.features.length === 0) {
    throw new Error(`${label} returned no features.`);
  }

  for (const feature of data.features.slice(0, 25)) {
    const coords = feature.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) {
      throw new Error(`${label} schema changed: feature is missing point coordinates.`);
    }

    for (const propertyName of requiredProperties) {
      if (!(propertyName in (feature.properties ?? {}))) {
        throw new Error(`${label} schema changed: missing property ${propertyName}.`);
      }
    }
  }
};

const assertOverpassElements = (data) => {
  if (!Array.isArray(data?.elements)) {
    throw new Error("OpenStreetMap toilet source schema changed: expected an elements array.");
  }

  if (data.elements.length === 0) {
    throw new Error("OpenStreetMap toilet source returned no elements.");
  }
};

const runNode = (args) => {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    stdio: "inherit",
    windowsHide: true,
  });

  if (result.status !== 0) {
    throw new Error(`${process.execPath} ${args.join(" ")} failed with exit code ${result.status}`);
  }
};

const assertGeneratedFile = (label, filePath, exportName) => {
  const content = fs.readFileSync(filePath, "utf8");
  if (!content.includes(`export const ${exportName}`)) {
    throw new Error(`${label} generation failed: ${exportName} export not found.`);
  }

  const idCount = (content.match(/"id"/g) ?? []).length;
  if (idCount === 0) {
    throw new Error(`${label} generation failed: no generated IDs found.`);
  }

  console.log(`${label}: generated ${idCount} records.`);
};

const writeMetadata = (timestamp) => {
  const output = `export const AUTO_UPDATE_METADATA = {
  lastSuccessfulUpdate: ${JSON.stringify(timestamp)},
  datasets: {
    drinking: ${JSON.stringify(timestamp)},
    water: ${JSON.stringify(timestamp)},
    toilet: ${JSON.stringify(timestamp)},
  },
} as const;
`;

  fs.writeFileSync(generatedFiles.metadata, output, "utf8");
};

try {
  const [fountains, bathing, addresses, toilets] = await Promise.all([
    fetchJson("Vienna drinking-water and refresh fountains", wfsUrl("TRINKBRUNNENOGD")),
    fetchJson("Vienna bathing-water sites", wfsUrl("BADESTELLENOGD")),
    fetchJson(
      "Vienna address labels",
      wfsUrl("ADRESSENOGD", { propertyName: "NAME,NAME_STR,PLZ,GEB_BEZIRK,SHAPE" }),
    ),
    fetchJson("OpenStreetMap public toilets", "https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({ data: overpassQuery }),
    }),
  ]);

  assertFeatureCollection("TRINKBRUNNENOGD", fountains, ["OBJECTID", "BASIS_TYP_TXT"]);
  assertFeatureCollection("BADESTELLENOGD", bathing, ["BEZEICHNUNG", "BADEQUALITAET", "WASSERTEMPERATUR"]);
  assertFeatureCollection("ADRESSENOGD", addresses, ["NAME"]);
  assertOverpassElements(toilets);

  writeJson(sourceFiles.fountains, fountains);
  writeJson(sourceFiles.bathing, bathing);
  writeJson(sourceFiles.addresses, addresses);
  writeJson(sourceFiles.toilets, toilets);

  runNode([
    "scripts/generate_water_places.mjs",
    sourceFiles.fountains,
    sourceFiles.bathing,
    sourceFiles.addresses,
    generatedFiles.drinking,
    generatedFiles.water,
    ignorePath,
  ]);
  runNode([
    "scripts/generate_public_toilets.mjs",
    sourceFiles.toilets,
    generatedFiles.toilet,
    sourceFiles.addresses,
    ignorePath,
  ]);

  assertGeneratedFile("Drinking-water data", generatedFiles.drinking, "VIENNA_DRINKING_WATER_FOUNTAINS");
  assertGeneratedFile("Swim/refresh data", generatedFiles.water, "VIENNA_WATER_ACCESS_PLACES");
  assertGeneratedFile("Public-toilet data", generatedFiles.toilet, "VIENNA_PUBLIC_TOILET_PLACES");

  const timestamp = new Date().toISOString();
  writeMetadata(timestamp);

  for (const [key, source] of Object.entries(generatedFiles)) {
    fs.copyFileSync(source, trackedFiles[key]);
  }

  console.log(`Auto-update completed successfully at ${timestamp}.`);
} catch (error) {
  console.error("Auto-update failed.");
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
