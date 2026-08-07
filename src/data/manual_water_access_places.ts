import type { CompactPlace } from "./vienna_cool_places";

// Manually reviewed swimming places that are not part of the municipal-pool
// directory or the City's generated bathing-water and water-feature layers.
export const MANUAL_WATER_ACCESS_PLACES: CompactPlace[] = [
  {
    id: "private-pool-badeschiff-wien",
    name: "Badeschiff Wien",
    address: "Wolfgang-Schmitz-Promenade 4, 1010 Wien",
    district: "1",
    lat: 48.21178,
    lng: 16.38161,
    category: "Private Pool",
    coolingType: "private_pool",
    ac: null,
    sitting: null,
    wifi: null,
    amenities: [],
    hours: [],
    free: false,
    notes:
      "Privately operated outdoor pool. A ticket is required. The 27-metre pool is unheated and unsupervised; check the operator page for current seasonal hours, prices, and safety information.",
    sourceUrls: [
      "https://www.wien.gv.at/freizeit/badeschiff",
      "https://www.badeschiff.at/pool/",
      "https://www.openstreetmap.org/node/444247110",
    ],
    placeType: "water",
    accessibility: "unknown",
    poolFacilityType: "outdoor",
    openingHoursUrl: "https://www.badeschiff.at/pool/",
  },
];
