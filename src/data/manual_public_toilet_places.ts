import type { CompactPlace } from "./vienna_cool_places";

export const MANUAL_PUBLIC_TOILET_PLACES: CompactPlace[] = [
  {
    id: "public-toilet-tu-wien-karlsplatz-13-stiege-3",
    name: "WC - TU Wien Hauptgebäude (Stiege 3)",
    address: "Karlsplatz 13, Stiege 3, Erdgeschoß, 1040 Wien",
    district: "4",
    lat: 48.19860162,
    lng: 16.37065992,
    category: "Public Toilet",
    coolingType: "public_toilet",
    ac: null,
    sitting: null,
    wifi: null,
    amenities: ["Wheelchair accessible", "Changing table"],
    hours: [],
    free: true,
    notes:
      "Visitor-reported free WC in the TU Wien main building. TU Wien lists an accessible WC with a freely accessible changing table at Staircase 3 on the ground floor. Access still depends on building opening and on-site rules.",
    sourceUrls: [
      "https://www.tuwien.at/tu-wien/organisation/zentrale-bereiche/personalentwicklung/vereinbarkeit-tu-kids/familienfreundliche-infrastruktur",
      "https://github.com/tommasodesantis/Make_Vienna_Cool/issues/33",
    ],
    placeType: "toilet",
    accessibility: "yes",
    accessibilitySource: "TU Wien family-friendly infrastructure listing",
    status: "access_warning",
    statusNote: {
      en: "This WC is inside the TU Wien main building. Access depends on building opening and on-site rules.",
      de: "Dieses WC befindet sich im TU-Wien-Hauptgebäude. Der Zugang hängt von den Gebäudeöffnungszeiten und den Regeln vor Ort ab.",
    },
    toiletFeeStatus: "free",
  },
];
