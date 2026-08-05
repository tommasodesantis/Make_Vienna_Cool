import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2] ?? "C:/tmp/vienna_municipal_pools.json";
const outputPath = process.argv[3] ?? "src/data/municipal_pool_places.ts";

const MUNICIPAL_TERM_ID = 141386;
const POOL_DIRECTORY_URL =
  "https://www.wien.gv.at/freizeit/baeder?q=&terms7%5B1%5D=141386";

const POOL_TYPE_TERMS = [
  [3275648, "family"],
  [3275432, "combined"],
  [3927922, "lido"],
  [3275323, "indoor"],
  [3275307, "outdoor"],
];

const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const hits = raw?.hits?.hits;

if (!Array.isArray(hits)) {
  throw new Error("Municipal pool schema changed: expected hits.hits to be an array.");
}

const roundCoord = (value) => Number(value.toFixed(8));

const getTermIds = (source) =>
  new Set(
    (source.defined_terms ?? [])
      .map((term) => Number(term?.id))
      .filter(Number.isFinite),
  );

const getFacilityType = (termIds) => {
  for (const [termId, facilityType] of POOL_TYPE_TERMS) {
    if (termIds.has(termId)) return facilityType;
  }
  return null;
};

const getAddress = (source) => {
  const address = source.address?.[0];
  const street = [address?.addressStreet, address?.addressNumber].filter(Boolean).join(" ").trim();
  const additional = String(address?.addressAdditionalInfo ?? "").trim();
  const postcode = String(address?.district?.[0]?.plz ?? "").trim();
  const label = [street, additional].filter(Boolean).join(", ");
  return [label, postcode ? `${postcode} Wien` : ""].filter(Boolean).join(", ");
};

const getDistrict = (source) => {
  const postcode = String(source.address?.[0]?.district?.[0]?.plz ?? "");
  const postcodeMatch = postcode.match(/^1(\d{2})0$/);
  if (postcodeMatch) return String(Number(postcodeMatch[1]));

  const title = String(source.address?.[0]?.district?.[0]?.title ?? "");
  const titleMatch = title.match(/^(\d{1,2})\./);
  return titleMatch ? String(Number(titleMatch[1])) : "Vienna";
};

const places = hits
  .map((hit) => hit?._source ?? null)
  .filter(Boolean)
  .map((source) => {
    const termIds = getTermIds(source);
    const facilityType = getFacilityType(termIds);
    if (!termIds.has(MUNICIPAL_TERM_ID) || !facilityType) return null;

    const coordinates = source.address?.[0]?.location?.coordinates ?? [];
    const lng = Number(coordinates[0]);
    const lat = Number(coordinates[1]);
    const sourceId = Number(source.source_id);
    const openingHoursUrl = String(source.link ?? "").trim();
    const name = String(source.teaser_box_title || source.title || "").trim();

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(sourceId)) {
      throw new Error(`Municipal pool schema changed: invalid location or source ID for ${name || "record"}.`);
    }
    if (!name || !openingHoursUrl.startsWith("https://www.wien.gv.at/")) {
      throw new Error(`Municipal pool schema changed: invalid title or official link for source ${sourceId}.`);
    }

    return {
      id: `municipal-pool-${sourceId}`,
      name,
      address: getAddress(source) || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      district: getDistrict(source),
      lat: roundCoord(lat),
      lng: roundCoord(lng),
      category: "Municipal Pool",
      coolingType: "municipal_pool",
      ac: null,
      sitting: null,
      wifi: null,
      amenities: [],
      hours: [],
      free: false,
      notes:
        "Municipal swimming facility operated by the City of Vienna. Check the official page for current opening hours, closures, and admission information.",
      sourceUrls: [openingHoursUrl, POOL_DIRECTORY_URL],
      placeType: "water",
      accessibility: termIds.has(141519) ? "yes" : "unknown",
      accessibilitySource: termIds.has(141519) ? "City of Vienna pool directory" : undefined,
      poolFacilityType: facilityType,
      openingHoursUrl,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name, "de") || a.id.localeCompare(b.id));

if (places.length === 0) {
  throw new Error("Municipal pool generation failed: no swimming facilities found.");
}

const output = `import type { CompactPlace } from "./vienna_cool_places";

// Generated from the City of Vienna municipal-pool directory.
// Directory: ${POOL_DIRECTORY_URL}

export const VIENNA_MUNICIPAL_POOL_PLACES: CompactPlace[] = ${JSON.stringify(places)};
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output, "utf8");
console.log(`Wrote ${places.length} municipal swimming facilities to ${outputPath}`);
