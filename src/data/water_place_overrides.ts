import type { CompactPlace } from "./vienna_cool_places";

const VENEDIGER_AU_WATER_NOTE =
  'Official Vienna data identifies this as a Spielbrunnen, and the City park page confirms a children\'s playground with water play. "Kinderplantschbecken" (children\'s paddling pool) is the visitor-reported local description. Round-the-clock access is visitor-reported and is also listed by Sunny.at; the City page does not publish opening hours.';

const WATER_PLACE_OVERRIDES: Record<string, Partial<CompactPlace>> = {
  "refresh-fountain-6949873": {
    name: "Kinderplanschbecken / Wasserspiel – Venediger-Au-Park",
    hours: ["Mon - Sun: 00:00 - 24:00"],
    notes: VENEDIGER_AU_WATER_NOTE,
    sourceUrls: [
      "https://www.data.gv.at/suche/?searchterm=TRINKBRUNNENOGD",
      "https://www.wien.gv.at/freizeit/venediger-au",
      "https://www.sunny.at/freizeittipp/kinderspielplatz-im-venediger-au-park/",
      "https://github.com/tommasodesantis/Make_Vienna_Cool/issues/27"
    ]
  }
};

export const applyWaterPlaceOverrides = (places: CompactPlace[]): CompactPlace[] =>
  places.map((place) => {
    const override = WATER_PLACE_OVERRIDES[place.id];
    return override ? { ...place, ...override } : place;
  });
