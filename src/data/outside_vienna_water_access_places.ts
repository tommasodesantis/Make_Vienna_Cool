import type { CompactPlace } from "./vienna_cool_places";

// Free public natural-water access outside Vienna, limited to nearby places.
// Paid lidos, pools, and paid seasonal lake access are intentionally excluded.

export const OUTSIDE_VIENNA_WATER_ACCESS_PLACES: CompactPlace[] = [
  {
    id: "outside-strombad-kritzendorf-danube-access",
    name: "Strombad Kritzendorf - Danube access",
    address: "Strombad Kritzendorf, 3420 Kritzendorf",
    district: "outside",
    lat: 48.3394137,
    lng: 16.3064807,
    category: "Free Natural Water Access",
    coolingType: "water_access",
    ac: null,
    sitting: null,
    wifi: null,
    amenities: ["Free natural water access", "Public Danube access", "No lifeguard / no official bathing operation"],
    hours: [],
    free: true,
    notes:
      "The municipality describes Strombad Kritzendorf as publicly accessible Danube access, but explicitly not as a supervised bathing facility. Swim at your own risk and follow posted rules, river conditions, and quiet-hour rules.",
    sourceUrls: [
      "https://www.klosterneuburg.at/Sport_Freizeit/Parks_Spielplaetze/Strombad_Kritzendorf",
      "https://www.openstreetmap.org/way/28434148",
    ],
    placeType: "water",
    accessibility: "unknown",
  },
];
