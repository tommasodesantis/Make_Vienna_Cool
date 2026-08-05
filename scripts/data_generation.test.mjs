import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

const withTempDirectory = (callback) => {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "make-vienna-cool-test-"));
  try {
    return callback(tempDirectory);
  } finally {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
};

const writeJson = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data), "utf8");

const runGenerator = (script, args) => {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });

  assert.equal(
    result.status,
    0,
    `${script} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
};

const readGeneratedArray = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/= (\[[\s\S]*\]);\s*$/);
  assert.ok(match, `Could not find generated array in ${filePath}`);
  return JSON.parse(match[1]);
};

const poolHit = ({
  sourceId,
  title,
  termIds,
  lat = 48.2,
  lng = 16.37,
}) => ({
  _source: {
    source_id: sourceId,
    title,
    teaser_box_title: title,
    link: `https://www.wien.gv.at/freizeit/${sourceId}`,
    defined_terms: termIds.map((id) => ({ id, title: String(id) })),
    address: [
      {
        addressStreet: "Testgasse",
        addressNumber: String(sourceId),
        addressAdditionalInfo: "",
        district: [{ title: "4. Wieden", plz: "1040" }],
        location: { coordinates: [String(lng), String(lat)], type: "Point" },
      },
    ],
  },
});

test("municipal pool generator keeps only City swimming facilities", () =>
  withTempDirectory((tempDirectory) => {
    const inputPath = path.join(tempDirectory, "pools.json");
    const outputPath = path.join(tempDirectory, "pools.ts");
    writeJson(inputPath, {
      hits: {
        hits: [
          poolHit({ sourceId: 1, title: "City Indoor Pool", termIds: [141386, 3275323] }),
          poolHit({ sourceId: 2, title: "City Family Pool", termIds: [141386, 3275648] }),
          poolHit({ sourceId: 3, title: "City Shower", termIds: [141386, 3275287] }),
          poolHit({ sourceId: 4, title: "Private Outdoor Pool", termIds: [3275307] }),
        ],
      },
    });

    runGenerator("scripts/generate_municipal_pools.mjs", [inputPath, outputPath]);
    const places = readGeneratedArray(outputPath);

    assert.deepEqual(places.map((place) => place.name), ["City Family Pool", "City Indoor Pool"]);
    assert.deepEqual(places.map((place) => place.poolFacilityType), ["family", "indoor"]);
    assert.ok(places.every((place) => place.category === "Municipal Pool"));
    assert.ok(places.every((place) => place.openingHoursUrl.startsWith("https://www.wien.gv.at/")));
    assert.ok(places.every((place) => place.amenities.length === 0));
  }));

test("water generator merges official and natural monitoring points into one category", () =>
  withTempDirectory((tempDirectory) => {
    const fountainPath = path.join(tempDirectory, "fountains.json");
    const bathingPath = path.join(tempDirectory, "bathing.json");
    const addressPath = path.join(tempDirectory, "addresses.json");
    const drinkingOutputPath = path.join(tempDirectory, "drinking.ts");
    const waterOutputPath = path.join(tempDirectory, "water.ts");
    const ignorePath = path.join(tempDirectory, "ignores.json");

    writeJson(fountainPath, {
      type: "FeatureCollection",
      features: [
        {
          geometry: { coordinates: [16.37, 48.2] },
          properties: { OBJECTID: 1, BASIS_TYP_TXT: "Trinkbrunnen" },
        },
      ],
    });
    writeJson(bathingPath, {
      type: "FeatureCollection",
      features: [1, 2].map((type) => ({
        geometry: { coordinates: [16.37 + type / 100, 48.2 + type / 100] },
        properties: {
          BEZEICHNUNG: `Bathing site ${type}`,
          TYP: type,
          BADEQUALITAET: 1,
          WASSERTEMPERATUR: 22,
          BEZIRK: 22,
          WEITERE_INFO: "https://www.wien.gv.at/",
        },
      })),
    });
    writeJson(addressPath, { type: "FeatureCollection", features: [] });
    writeJson(ignorePath, {});

    runGenerator("scripts/generate_water_places.mjs", [
      fountainPath,
      bathingPath,
      addressPath,
      drinkingOutputPath,
      waterOutputPath,
      ignorePath,
    ]);
    const places = readGeneratedArray(waterOutputPath);

    assert.equal(places.length, 2);
    assert.ok(places.every((place) => place.category === "Natural Bathing Site"));
    assert.ok(places.every((place) => place.category !== "Official Bathing Site"));
  }));

test("toilet generator represents conditional and unknown fees without marking them free", () =>
  withTempDirectory((tempDirectory) => {
    const inputPath = path.join(tempDirectory, "toilets.json");
    const outputPath = path.join(tempDirectory, "toilets.ts");
    writeJson(inputPath, {
      elements: [
        {
          type: "node",
          id: 10,
          lat: 48.2,
          lon: 16.37,
          tags: {
            amenity: "toilets",
            fee: "no",
            charge: "0.50 EUR",
            "fee:conditional": "yes @ Mo-Fr 12:00-22:00",
          },
        },
        {
          type: "node",
          id: 11,
          lat: 48.21,
          lon: 16.38,
          tags: { amenity: "toilets" },
        },
      ],
    });

    runGenerator("scripts/generate_public_toilets.mjs", [
      inputPath,
      outputPath,
      path.join(tempDirectory, "missing-addresses.json"),
      path.join(tempDirectory, "missing-ignores.json"),
    ]);
    const places = readGeneratedArray(outputPath);
    const conditional = places.find((place) => place.id === "public-toilet-node-10");
    const unknown = places.find((place) => place.id === "public-toilet-node-11");

    assert.equal(conditional.toiletFeeStatus, "conditional");
    assert.equal(conditional.free, false);
    assert.ok(conditional.amenities.includes("Conditional fee"));
    assert.ok(!conditional.amenities.includes("Free public toilet"));
    assert.match(conditional.notes, /OSM conditional fee/);
    assert.equal(unknown.toiletFeeStatus, "unknown");
    assert.equal(unknown.free, false);
  }));
