export interface LanguageTranslations {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchLabel: string;
  clearSearch: string;
  category: string;
  allCategories: string;
  places: string;
  noPlacesFound: string;
  clearFilters: string;
  openInGoogleMaps: string;
  address: string;
  hours: string;
  amenities: string;
  access: string;
  freeEntry: string;
  freeAccess: string;
  paidRequired: string;
  airConditioning: string;
  acConfirmed: string;
  acLikely: string;
  acUnverified: string;
  acVisitorUnverified: string;
  acOfficialZone: string;
  acCoolRoom: string;
  excludedTitle: string;
  excludedDesc: string;
  madeBy: string;
  district: string;
  yes: string;
  no: string;
  seating: string;
  wifi: string;
  mapHint: string;
  expandMap: string;
  exitFullscreenMap: string;
  details: string;
  filters: string;
  total: string;
  allDistricts: string;
  districtFilter: string;
  heatEyebrow: string;
  heroTextBeforeLink: string;
  githubRepository: string;
  heroTextAfterLink: string;
  introCollapsedLabel: string;
  introExpandedLabel: string;
  filterCoolPlaces: string;
  showFilters: string;
  hideFilters: string;
  filterByFeatures: string;
  acFilterLabel: string;
  acTooltipTitle: string;
  acTooltipBody: string;
  openingDay: string;
  openingHour: string;
  anyDay: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  anyTime: string;
  openNow: string;
  morning: string;
  afternoon: string;
  evening: string;
  tryAdjustingFilters: string;
  paid: string;
  sockets: string;
  tablesDesks: string;
  accessible: string;
  modeCool: string;
  modeDrinking: string;
  modeWater: string;
  modeToilets: string;
  modeCoolShort: string;
  modeDrinkingShort: string;
  modeWaterShort: string;
  modeToiletsShort: string;
  filterDrinkingWater: string;
  filterWaterAccess: string;
  filterPublicToilets: string;
  datasetLoading: string;
  useMyLocation: string;
  locating: string;
  nearestActive: string;
  locationDenied: string;
  locationUnsupported: string;
  preferencesTitle: string;
  preferencesDescription: string;
  languagePreference: string;
  locationConsent: string;
  locationConsentDescription: string;
  savePreferences: string;
  maybeLater: string;
  noLocationsFound: string;
  location: string;
  source: string;
  accessibilityYes: string;
  accessibilityLimited: string;
  accessibilityNo: string;
  accessibilityUnknown: string;
  reportWrongInfo: string;
  reportTitle: string;
  reportDescription: string;
  reportWrongInfoOnly: string;
  reportPlaceholder: string;
  reportSubmit: string;
  reportSubmitting: string;
  reportSuccess: string;
  reportUnavailable: string;
  reportError: string;
  reportTooShort: string;
  suggestPlace: string;
  suggestPlaceTitle: string;
  suggestPlaceDescription: string;
  suggestPlaceExistingMatchesTitle: string;
  suggestPlaceExistingMatchesDescription: string;
  suggestPlaceViewExisting: string;
  suggestPlaceLoadingMatches: string;
  suggestedPlaceType: string;
  suggestedPlaceName: string;
  suggestedPlaceNamePlaceholder: string;
  suggestedPlaceLocation: string;
  suggestedPlaceLocationPlaceholder: string;
  suggestedPlaceNotes: string;
  suggestedPlaceNotesPlaceholder: string;
  suggestPlaceSubmit: string;
  suggestPlaceSuccess: string;
  suggestPlaceTooShort: string;
  suggestPlaceMissingName: string;
  suggestPlaceMissingLocation: string;
  suggestPlaceMissingNotes: string;
  close: string;
  info: string;
  temporarilyClosed: string;
  temporarilyClosedNote: string;
  accessWarning: string;
  accessWarningNote: string;
  dataLastUpdated: string;
  autoUpdateUnknown: string;
  officialOpeningHours: string;
  poolFacilityType: string;
  municipalPoolPassTitle: string;
  municipalPoolPassBody: string;
  municipalPoolPassLink: string;
  conditionalFee: string;
  feeUnknown: string;
}

export const TRANSLATIONS: { en: LanguageTranslations; de: LanguageTranslations } = {
  en: {
    title: "Make Vienna Cool",
    subtitle: "Find public cool zones and air-conditioned spots in Vienna.",
    searchPlaceholder: "Search by name, category, address or amenities...",
    searchLabel: "Search",
    clearSearch: "Clear search",
    category: "Category",
    allCategories: "All Categories",
    places: "Places",
    noPlacesFound: "No cool places found matching your search.",
    clearFilters: "Clear search & filters",
    openInGoogleMaps: "Open in Google Maps",
    address: "Address",
    hours: "Opening Hours",
    amenities: "Amenities",
    access: "Access",
    freeEntry: "No paid/consumption",
    freeAccess: "Free access",
    paidRequired: "Purchase Required / Ticket Required",
    airConditioning: "Air Conditioning",
    acConfirmed: "Confirmed AC",
    acLikely: "Likely AC",
    acUnverified: "Reddit Claimed AC (Unverified)",
    acVisitorUnverified: "Visitor-Reported AC (Unverified)",
    acOfficialZone: "Official Cool Zone",
    acCoolRoom: "Cool Indoor Room",
    excludedTitle: "Paid Venues Excluded",
    excludedDesc: "The following places were recommended as air-conditioned but require a paid entry ticket. They are excluded from our primary map & list:",
    madeBy: "OS project started by Tommaso De Santis, Vienna",
    district: "District",
    yes: "Yes",
    no: "No",
    seating: "Seating",
    wifi: "Free Wi-Fi",
    mapHint: "Click a pin on the map or select a place from the list to view full details.",
    expandMap: "Expand map",
    exitFullscreenMap: "Exit fullscreen",
    details: "Details",
    filters: "Filters",
    total: "Total",
    allDistricts: "All Districts",
    districtFilter: "District Filter",
    heatEyebrow: "Beat the Heat in Vienna",
    heroTextBeforeLink: "Find public AC, fountains, swim spots and toilets in Vienna. This is an indie open-source project, not affiliated with the City of Vienna. If you want to collaborate, visit the ",
    githubRepository: "repo",
    heroTextAfterLink: ".",
    introCollapsedLabel: "What is this?",
    introExpandedLabel: "Hide",
    filterCoolPlaces: "Filter Cool Places",
    showFilters: "Show Filters",
    hideFilters: "Hide Filters",
    filterByFeatures: "Filter by Features",
    acFilterLabel: "AC",
    acTooltipTitle: "About Cool Spaces & AC",
    acTooltipBody: "All places on the map are meant to be cool. However, some places from Vienna's Coole Zonen directory do not have confirmed AC, only claimed pleasant room temperatures of max 24C. This filter includes only places with likely or confirmed AC. AC units can be turned off or out of service; this app does not verify live operations, only the presence of the system.",
    openingDay: "Opening Day",
    openingHour: "Opening Hours",
    anyDay: "Any Day",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    anyTime: "Any Time",
    openNow: "Open Now",
    morning: "Morning (08-12)",
    afternoon: "Afternoon (12-17)",
    evening: "Evening (17-21)",
    tryAdjustingFilters: "Try adjusting your filters.",
    paid: "Paid",
    sockets: "Sockets",
    tablesDesks: "Tables / Desks",
    accessible: "Accessible",
    modeCool: "Cool places",
    modeDrinking: "Drinking water",
    modeWater: "Swim / refresh",
    modeToilets: "Public toilets",
    modeCoolShort: "Cool",
    modeDrinkingShort: "Water",
    modeWaterShort: "Swim",
    modeToiletsShort: "Toilets",
    filterDrinkingWater: "Filter Drinking Water",
    filterWaterAccess: "Filter Swim / Refresh",
    filterPublicToilets: "Filter Public Toilets",
    datasetLoading: "Loading locations...",
    useMyLocation: "Near me",
    locating: "Locating...",
    nearestActive: "Sorted by distance",
    locationDenied: "Location access is not enabled.",
    locationUnsupported: "Geolocation is not supported by this browser.",
    preferencesTitle: "Preferences",
    preferencesDescription: "Save your language and whether this app may ask for your browser location.",
    languagePreference: "Language",
    locationConsent: "Allow nearest-place features",
    locationConsentDescription: "Your exact location stays in this browser session and is not stored.",
    savePreferences: "Save preferences",
    maybeLater: "Maybe later",
    noLocationsFound: "No locations found matching your filters.",
    location: "Location",
    source: "Source",
    accessibilityYes: "Wheelchair accessible",
    accessibilityLimited: "Limited accessibility",
    accessibilityNo: "Not wheelchair accessible",
    accessibilityUnknown: "Accessibility unknown",
    reportWrongInfo: "Report wrong info",
    reportTitle: "Report wrong information",
    reportDescription: "Use this only when the information shown for this place is wrong or outdated.",
    reportWrongInfoOnly: "Do not use this form to confirm that something is present or to suggest a missing place.",
    reportPlaceholder: "Example: the address is wrong, the place is closed, accessibility info is incorrect, or an amenity listed here is not actually available...",
    reportSubmit: "Submit report",
    reportSubmitting: "Submitting...",
    reportSuccess: "Report submitted. Thank you.",
    reportUnavailable: "Online reports are not configured in this build.",
    reportError: "The report could not be submitted. Please try again later.",
    reportTooShort: "Please add a little more detail.",
    suggestPlace: "Suggest place",
    suggestPlaceTitle: "Suggest a missing place",
    suggestPlaceDescription: "Send a place that should be reviewed for the map. Check the live matches below before submitting.",
    suggestPlaceExistingMatchesTitle: "Already on the map?",
    suggestPlaceExistingMatchesDescription: "These existing places look similar. Open one before submitting if it is the same place.",
    suggestPlaceViewExisting: "Open existing place",
    suggestPlaceLoadingMatches: "Checking existing places...",
    suggestedPlaceType: "Map type",
    suggestedPlaceName: "Place name",
    suggestedPlaceNamePlaceholder: "Example: Stadtpark drinking fountain",
    suggestedPlaceLocation: "Address or map link",
    suggestedPlaceLocationPlaceholder: "Address, coordinates, Google Maps link, or OpenStreetMap link",
    suggestedPlaceNotes: "Why should it be added?",
    suggestedPlaceNotesPlaceholder: "Add useful details, such as access rules, whether it is free, opening hours, or source links.",
    suggestPlaceSubmit: "Submit suggestion",
    suggestPlaceSuccess: "Suggestion submitted. Thank you.",
    suggestPlaceTooShort: "Please include a name, location, and a little more detail.",
    suggestPlaceMissingName: "Add a place name with at least 2 characters.",
    suggestPlaceMissingLocation: "Add an address, coordinates, or map link with at least 5 characters.",
    suggestPlaceMissingNotes: "Add notes explaining why it should be added with at least 12 characters.",
    close: "Close",
    info: "Info",
    temporarilyClosed: "Temporarily closed",
    temporarilyClosedNote: "Reported temporarily closed for renovation. Check the venue before going.",
    accessWarning: "Check access",
    accessWarningNote: "Recent user reports indicate access, seating, or cooling may be restricted. Check current on-site rules before relying on this as a cooling stop.",
    dataLastUpdated: "Data last updated",
    autoUpdateUnknown: "not yet recorded",
    officialOpeningHours: "Official opening hours",
    poolFacilityType: "Pool type",
    municipalPoolPassTitle: "Municipal pool passes",
    municipalPoolPassBody: "City pool passes can be used at participating municipal pools. Check the official information for current validity and conditions.",
    municipalPoolPassLink: "Official pass information",
    conditionalFee: "Conditional fee",
    feeUnknown: "Fee unknown",
  },
  de: {
    title: "Make Vienna Cool",
    subtitle: "Finde kühle öffentliche Orte, Bibliotheken und klimatisierte Lokale in Wien.",
    searchPlaceholder: "Suche nach Name, Kategorie, Adresse oder Ausstattung...",
    searchLabel: "Suche",
    clearSearch: "Suche löschen",
    category: "Kategorie",
    allCategories: "Alle Kategorien",
    places: "Orte",
    noPlacesFound: "Keine Orte gefunden",
    clearFilters: "Suche & Filter zurücksetzen",
    openInGoogleMaps: "In Google Maps öffnen",
    address: "Adresse",
    hours: "Öffnungszeiten",
    amenities: "Ausstattung",
    access: "Zugang",
    freeEntry: "Kein Verzehrzwang/Eintritt",
    freeAccess: "Freier Zugang",
    paidRequired: "Konsumpflicht oder Ticket erforderlich",
    airConditioning: "Klimaanlage",
    acConfirmed: "Bestätigte Klimaanlage",
    acLikely: "Wahrscheinlich klimatisiert",
    acUnverified: "Klimaanlage laut Reddit (nicht bestätigt)",
    acVisitorUnverified: "Klimaanlage von Besucher*in gemeldet (nicht bestätigt)",
    acOfficialZone: "Offizielle Coole Zone",
    acCoolRoom: "Kühler Raum (ohne Klima)",
    excludedTitle: "Kostenpflichtige Orte ausgeschlossen",
    excludedDesc: "Die folgenden Orte wurden als klimatisiert empfohlen, erfordern jedoch ein kostenpflichtiges Eintrittsticket. Sie sind aus unserer Hauptkarte & Liste ausgeschlossen:",
    madeBy: "OS-Projekt gestartet von Tommaso De Santis, Wien",
    district: "Bezirk",
    yes: "Ja",
    no: "Nein",
    seating: "Sitzmöglichkeiten",
    wifi: "Kostenloses WLAN",
    mapHint: "Klicke auf eine Nadel auf der Karte oder wähle einen Ort aus der Liste aus, um Details anzuzeigen.",
    expandMap: "Karte vergrößern",
    exitFullscreenMap: "Vollbild beenden",
    details: "Detailansicht",
    filters: "Filter",
    total: "Gesamt",
    allDistricts: "Alle Bezirke",
    districtFilter: "Bezirksfilter",
    heatEyebrow: "Abkühlung in Wien",
    heroTextBeforeLink: "Finde öffentliche klimatisierte Orte, Trinkbrunnen, Badestellen und WCs in Wien. Dies ist ein unabhängiges Open-Source-Projekt und steht in keiner Verbindung zur Stadt Wien. Wenn du mitarbeiten möchtest, besuche das ",
    githubRepository: "Repository",
    heroTextAfterLink: ".",
    introCollapsedLabel: "Was ist das?",
    introExpandedLabel: "Weniger anzeigen",
    filterCoolPlaces: "Kühle Orte filtern",
    showFilters: "Filter anzeigen",
    hideFilters: "Filter ausblenden",
    filterByFeatures: "Nach Merkmalen filtern",
    acFilterLabel: "Klima",
    acTooltipTitle: "Über kühle Orte & Klima",
    acTooltipBody: "Alle Orte auf der Karte sollen kühl sein. Einige Orte aus dem Coole-Zonen-Verzeichnis der Stadt Wien haben jedoch keine bestätigte Klimaanlage, sondern nur angenehme Raumtemperaturen von maximal 24C. Dieser Filter zeigt Orte mit wahrscheinlicher oder bestätigter Klimaanlage. Klimaanlagen können abgeschaltet oder defekt sein; diese App prüft nicht den Live-Betrieb, sondern nur das Vorhandensein der Anlage.",
    openingDay: "Öffnungstag",
    openingHour: "Uhrzeit",
    anyDay: "Alle Tage",
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag",
    sunday: "Sonntag",
    anyTime: "Egal",
    openNow: "Jetzt geöffnet",
    morning: "Vormittag (08-12)",
    afternoon: "Nachmittag (12-17)",
    evening: "Abend (17-21)",
    tryAdjustingFilters: "Passe deine Filter an.",
    paid: "Konsumpflicht",
    sockets: "Steckdosen",
    tablesDesks: "Arbeitstische / Tische",
    accessible: "Barrierefrei",
    modeCool: "Kühle Orte",
    modeDrinking: "Trinkwasser",
    modeWater: "Baden / Erfrischen",
    modeToilets: "Öffentliche WCs",
    modeCoolShort: "Kühl",
    modeDrinkingShort: "Wasser",
    modeWaterShort: "Baden",
    modeToiletsShort: "WCs",
    filterDrinkingWater: "Trinkwasser filtern",
    filterWaterAccess: "Baden / Erfrischen filtern",
    filterPublicToilets: "Öffentliche WCs filtern",
    datasetLoading: "Standorte werden geladen...",
    useMyLocation: "In der Nähe",
    locating: "Standort wird gesucht...",
    nearestActive: "Nach Entfernung sortiert",
    locationDenied: "Standortzugriff ist nicht aktiviert.",
    locationUnsupported: "Geolokalisierung wird von diesem Browser nicht unterstützt.",
    preferencesTitle: "Einstellungen",
    preferencesDescription: "Speichere deine Sprache und ob diese App nach deinem Browser-Standort fragen darf.",
    languagePreference: "Sprache",
    locationConsent: "Orte in der Nähe erlauben",
    locationConsentDescription: "Dein genauer Standort bleibt nur in dieser Browser-Sitzung und wird nicht gespeichert.",
    savePreferences: "Einstellungen speichern",
    maybeLater: "Vielleicht später",
    noLocationsFound: "Keine Standorte mit diesen Filtern gefunden.",
    location: "Standort",
    source: "Quelle",
    accessibilityYes: "Rollstuhlgerecht",
    accessibilityLimited: "Eingeschränkt barrierefrei",
    accessibilityNo: "Nicht rollstuhlgerecht",
    accessibilityUnknown: "Barrierefreiheit unbekannt",
    reportWrongInfo: "Falsche Info melden",
    reportTitle: "Falsche Information melden",
    reportDescription: "Nutze dieses Formular nur, wenn die angezeigten Informationen zu diesem Ort falsch oder veraltet sind.",
    reportWrongInfoOnly: "Bitte nicht verwenden, um vorhandene Orte oder Ausstattung nur zu bestätigen oder um fehlende Orte vorzuschlagen.",
    reportPlaceholder: "Beispiel: Die Adresse stimmt nicht, der Ort ist geschlossen, die Barrierefreiheit ist falsch oder eine hier gelistete Ausstattung ist nicht vorhanden...",
    reportSubmit: "Meldung senden",
    reportSubmitting: "Wird gesendet...",
    reportSuccess: "Meldung gesendet. Danke.",
    reportUnavailable: "Online-Meldungen sind in diesem Build nicht konfiguriert.",
    reportError: "Die Meldung konnte nicht gesendet werden. Bitte versuche es später erneut.",
    reportTooShort: "Bitte beschreibe das Problem etwas genauer.",
    suggestPlace: "Ort vorschlagen",
    suggestPlaceTitle: "Fehlenden Ort vorschlagen",
    suggestPlaceDescription: "Sende einen Ort, der für die Karte geprüft werden sollte. Prüfe vor dem Senden die Live-Treffer unten.",
    suggestPlaceExistingMatchesTitle: "Schon auf der Karte?",
    suggestPlaceExistingMatchesDescription: "Diese vorhandenen Orte sehen ähnlich aus. Öffne einen Treffer, bevor du sendest, wenn es derselbe Ort ist.",
    suggestPlaceViewExisting: "Vorhandenen Ort öffnen",
    suggestPlaceLoadingMatches: "Vorhandene Orte werden geprüft...",
    suggestedPlaceType: "Kartentyp",
    suggestedPlaceName: "Name des Orts",
    suggestedPlaceNamePlaceholder: "Beispiel: Trinkbrunnen im Stadtpark",
    suggestedPlaceLocation: "Adresse oder Kartenlink",
    suggestedPlaceLocationPlaceholder: "Adresse, Koordinaten, Google-Maps-Link oder OpenStreetMap-Link",
    suggestedPlaceNotes: "Warum sollte der Ort ergänzt werden?",
    suggestedPlaceNotesPlaceholder: "Nützliche Details, z.B. Zugangsregeln, ob der Ort gratis ist, Öffnungszeiten oder Quellen.",
    suggestPlaceSubmit: "Vorschlag senden",
    suggestPlaceSuccess: "Vorschlag gesendet. Danke.",
    suggestPlaceTooShort: "Bitte gib Name, Standort und etwas mehr Detail an.",
    suggestPlaceMissingName: "Gib einen Ortsnamen mit mindestens 2 Zeichen ein.",
    suggestPlaceMissingLocation: "Gib eine Adresse, Koordinaten oder einen Kartenlink mit mindestens 5 Zeichen ein.",
    suggestPlaceMissingNotes: "Ergänze Hinweise, warum der Ort hinzugefügt werden sollte, mit mindestens 12 Zeichen.",
    close: "Schließen",
    info: "Info",
    temporarilyClosed: "Vorübergehend geschlossen",
    temporarilyClosedNote: "Als vorübergehend wegen Sanierung geschlossen gemeldet. Prüfe den Ort, bevor du hingehst.",
    accessWarning: "Zugang prüfen",
    accessWarningNote: "Aktuelle Nutzerhinweise deuten darauf hin, dass Zugang, Sitzplätze oder Kühlung eingeschränkt sein können. Prüfe die Regeln vor Ort, bevor du diesen Ort als Abkühlungsstopp einplanst.",
    dataLastUpdated: "Daten zuletzt aktualisiert",
    autoUpdateUnknown: "noch nicht erfasst",
    officialOpeningHours: "Offizielle Öffnungszeiten",
    poolFacilityType: "Badtyp",
    municipalPoolPassTitle: "Städtische Bäderkarten",
    municipalPoolPassBody: "Bäderkarten der Stadt gelten in teilnehmenden städtischen Bädern. Aktuelle Gültigkeit und Bedingungen stehen in der offiziellen Information.",
    municipalPoolPassLink: "Offizielle Karteninformation",
    conditionalFee: "Zeitweise kostenpflichtig",
    feeUnknown: "Gebühr unbekannt",
  }
};

export const CATEGORY_LABELS: Record<string, { en: string; de: string }> = {
  "Official Cool Zone": { en: "Official Cool Zone", de: "Offizielle Coole Zone" },
  "Public Library": { en: "Public Library", de: "Öffentliche Bibliothek" },
  "Museum": { en: "Museum", de: "Museum" },
  "Public Concourse": { en: "Public Concourse", de: "Öffentliche Halle" },
  "Department Store": { en: "Department Store", de: "Kaufhaus" },
  "University Library": { en: "University Library", de: "Universitätsbibliothek" },
  "University Study Room": { en: "University Study Room", de: "Universitärer Lernraum" },
  "Shopping Mall": { en: "Shopping Mall", de: "Einkaufszentrum" },
  "Shopping Mall & Transit Station": { en: "Shopping Mall & Transit Station", de: "Einkaufszentrum & Bahnhof" },
  "Bookstore": { en: "Bookstore", de: "Buchhandlung" },
  "Pub / Bar": { en: "Pub / Bar", de: "Pub / Bar" },
  "Café / Bar": { en: "Café / Bar", de: "Café / Bar" },
  "Café": { en: "Café", de: "Café" },
  "Family Café": { en: "Family Café", de: "Familiencafé" },
  "Confectionery / Café": { en: "Confectionery / Café", de: "Konditorei / Café" },
  "Grand Café": { en: "Grand Café", de: "Traditionscafé" },
  "Fast Food": { en: "Fast Food", de: "Fast Food" },
  "Restaurant": { en: "Restaurant", de: "Restaurant" },
  "Hotel Lobby / Bar": { en: "Hotel Lobby / Bar", de: "Hotellobby / Bar" },
  "Public Indoor Space": { en: "Public Indoor Space", de: "Öffentlicher Innenraum" },
  "Day Center": { en: "Day Center", de: "Tageszentrum" },
  "Drinking Water Fountain": { en: "Drinking Water Fountain", de: "Trinkbrunnen" },
  "Drinking Water Hydrant": { en: "Drinking Water Hydrant", de: "Trinkhydrant" },
  "Natural Bathing Site": { en: "Natural Bathing Site", de: "Naturbadestelle" },
  "Municipal Pool": { en: "Municipal Pool", de: "Städtisches Bad" },
  "Free Natural Water Access": { en: "Free Natural Water Access", de: "Freier Naturwasserzugang" },
  "Mist / Spray Cooling": { en: "Mist / Spray Cooling", de: "Sprühnebel / Sommerspritzer" },
  "Water Play Fountain": { en: "Water Play Fountain", de: "Wasserspiel / Fontäne" },
  "Public Toilet": { en: "Public Toilet", de: "Öffentliches WC" },
};

export const translateCategory = (category: string, lang: "en" | "de"): string =>
  CATEGORY_LABELS[category]?.[lang] || category;

export const POOL_FACILITY_TYPE_LABELS = {
  indoor: { en: "Indoor pool", de: "Hallenbad" },
  outdoor: { en: "Outdoor pool", de: "Freibad" },
  combined: { en: "Combined indoor/outdoor pool", de: "Kombibad" },
  family: { en: "Family pool", de: "Familienbad" },
  lido: { en: "Lido", de: "Strandbad" },
} as const;

export const translatePoolFacilityType = (
  facilityType: keyof typeof POOL_FACILITY_TYPE_LABELS,
  lang: "en" | "de",
): string => POOL_FACILITY_TYPE_LABELS[facilityType][lang];

export const AMENITY_LABELS: Record<string, { en: string; de: string }> = {
  "Official public cooling space": { en: "Official public cooling space", de: "Offizieller kühler Raum (Stadt Wien)" },
  "Official public cooling space (2nd floor)": { en: "Official public cooling space (2nd floor)", de: "Offizieller kühler Raum (2. Stock)" },
  "Cold drinks / free drinking water": { en: "Cold drinks / free drinking water", de: "Kalte Getränke / freies Trinkwasser" },
  "Cold drinks / water": { en: "Cold drinks / water", de: "Kalte Getränke / Wasser" },
  "Cold drinks": { en: "Cold drinks", de: "Kalte Getränke" },
  "Water": { en: "Water", de: "Wasser" },
  "Seating": { en: "Seating", de: "Sitzmöglichkeiten" },
  "Indoor seating": { en: "Indoor seating", de: "Sitzplätze im Innenbereich" },
  "Air conditioning": { en: "Air conditioning", de: "Klimaanlage" },
  "Outdoor seating": { en: "Outdoor seating", de: "Außensitzplätze" },
  "Laptop friendly": { en: "Laptop friendly", de: "Laptopfreundlich" },
  "Micro-roastery": { en: "Micro-roastery", de: "Mikrorösterei" },
  "Specialty coffee": { en: "Specialty coffee", de: "Spezialitätenkaffee" },
  "Cheesecake": { en: "Cheesecake", de: "Cheesecake" },
  "Breakfast": { en: "Breakfast", de: "Frühstück" },
  "Plant-based milk": { en: "Plant-based milk", de: "Pflanzliche Milchalternativen" },
  "Vegan options": { en: "Vegan options", de: "Vegane Optionen" },
  "Kids' area": { en: "Kids' area", de: "Kinderspielecke" },
  "Wheelchair-accessible toilet": { en: "Wheelchair-accessible toilet", de: "Rollstuhlgerechtes WC" },
  "Free Level 0 exhibition": { en: "Free Level 0 exhibition", de: "Kostenlose Ausstellung auf Ebene 0" },
  "Ramen": { en: "Ramen", de: "Ramen" },
  "Korean cuisine": { en: "Korean cuisine", de: "Koreanische Küche" },
  "Cash & card payments": { en: "Cash & card payments", de: "Bar- und Kartenzahlung" },
  "Dog friendly": { en: "Dog friendly", de: "Hundefreundlich" },
  "Latte art workshops": { en: "Latte art workshops", de: "Latte-Art-Workshops" },
  "Children's play area (ages 0-5)": { en: "Children's play area (ages 0-5)", de: "Spielbereich für Kinder (0-5 Jahre)" },
  "High chairs": { en: "High chairs", de: "Kinderhochstühle" },
  "Café food & drinks": { en: "Café food & drinks", de: "Café-Speisen und Getränke" },
  "Birthday parties": { en: "Birthday parties", de: "Geburtstagsfeiern" },
  "Wheelchair & stroller access": { en: "Wheelchair & stroller access", de: "Rollstuhl- und kinderwagengerechter Zugang" },
  "Quiet seating": { en: "Quiet seating", de: "Ruhige Sitzmöglichkeiten" },
  "Museum seating / rest areas": { en: "Museum seating / rest areas", de: "Museums-Sitzbereiche" },
  "Seating benches": { en: "Seating benches", de: "Sitzbänke" },
  "Comfortable seats": { en: "Comfortable seats", de: "Bequeme Sessel" },
  "Cozy seats & corners": { en: "Cozy seats & corners", de: "Gemütliche Sitzecken" },
  "Benches": { en: "Benches", de: "Sitzbänke" },
  "Youth club atmosphere": { en: "Youth club atmosphere", de: "Jugendclub-Atmosphäre" },
  "Heat refuge": { en: "Heat refuge", de: "Schutz vor Hitze" },
  "Daytime shelter": { en: "Daytime shelter", de: "Aufenthalt untertags" },
  "Meals / drinks": { en: "Meals / drinks", de: "Kleine Mahlzeiten / Getränke" },
  "Showers": { en: "Showers", de: "Duschen" },
  "Washing facilities": { en: "Washing facilities", de: "Waschmöglichkeiten" },
  "Dogs welcome": { en: "Dogs welcome", de: "Hunde willkommen" },
  "City library branch Coole Zone": { en: "City library branch Coole Zone", de: "Bücherei-Filiale Coole Zone" },
  "Books": { en: "Books", de: "Bücher" },
  "Books & media": { en: "Books & media", de: "Bücher & Medien" },
  "Study areas": { en: "Study areas", de: "Lernbereiche" },
  "Study space": { en: "Study space", de: "Lernplätze" },
  "Quiet study tables": { en: "Quiet study tables", de: "Ruhige Lerntische" },
  "Study desks": { en: "Study desks", de: "Arbeitstische" },
  "Quiet study zones": { en: "Quiet study zones", de: "Ruhige Lernzonen" },
  "Student study room": { en: "Student study room", de: "Studenten-Lernraum" },
  "Study tables": { en: "Study tables", de: "Lerntische" },
  "University library": { en: "University library", de: "Universitätsbibliothek" },
  "Free Wi-Fi": { en: "Free Wi-Fi", de: "Kostenloses WLAN" },
  "Free permanent exhibition": { en: "Free permanent exhibition", de: "Freie Dauerausstellung" },
  "Toilets": { en: "Toilets", de: "Toiletten" },
  "Toilets & nursing room": { en: "Toilets & nursing room", de: "Toiletten & Stillraum" },
  "Toilets in station": { en: "Toilets in station", de: "Toiletten im Bahnhof" },
  "Toilets in mall": { en: "Toilets in mall", de: "Toiletten im Einkaufszentrum" },
  "Lockers & toilets": { en: "Lockers & toilets", de: "Schließfächer & Toiletten" },
  "Public toilet": { en: "Public toilet", de: "Öffentliches WC" },
  "OpenStreetMap toilet point": { en: "OpenStreetMap toilet point", de: "WC-Punkt aus OpenStreetMap" },
  "Official Vienna public WC information": { en: "Official Vienna public WC information", de: "Öffentliche-WC-Information der Stadt Wien" },
  "Changing table": { en: "Changing table", de: "Wickeltisch" },
  "Fee may apply": { en: "Fee may apply", de: "Gebühr möglich" },
  "Free public toilet": { en: "Free public toilet", de: "Kostenloses öffentliches WC" },
  "24/7": { en: "24/7", de: "Rund um die Uhr" },
  "Shower": { en: "Shower", de: "Dusche" },
  "Staffed public toilet": { en: "Staffed public toilet", de: "WC mit Wartepersonal" },
  "Euro-key": { en: "Euro-key", de: "Euro-Key" },
  "Tampon/pad dispenser": { en: "Tampon/pad dispenser", de: "Tampon-/Bindenspender" },
  "Café": { en: "Café", de: "Café" },
  "Cafés nearby": { en: "Cafés nearby", de: "Cafés in der Nähe" },
  "Café / restaurant": { en: "Café / restaurant", de: "Café / Restaurant" },
  "Lockers": { en: "Lockers", de: "Schließfächer" },
  "Public library": { en: "Public library", de: "Öffentliche Bibliothek" },
  "Newspapers & magazines": { en: "Newspapers & magazines", de: "Zeitungen & Zeitschriften" },
  "Hospital public concourse": { en: "Hospital public concourse", de: "Öffentliche Spitalshalle" },
  "Shops & cafés": { en: "Shops & cafés", de: "Geschäfte & Cafés" },
  "Bistros": { en: "Bistros", de: "Bistros" },
  "Rooftop garden": { en: "Rooftop garden", de: "Dachgarten" },
  "Family friendly": { en: "Family friendly", de: "Familienfreundlich" },
  "Reading rooms": { en: "Reading rooms", de: "Lesesäle" },
  "Internet workstations": { en: "Internet workstations", de: "Internet-Arbeitsplätze" },
  "Futuristic architecture": { en: "Futuristic architecture", de: "Futuristische Architektur" },
  "Power outlets": { en: "Power outlets", de: "Steckdosen" },
  "Shopping & food courts": { en: "Shopping & food courts", de: "Shopping & Food-Courts" },
  "Large food court": { en: "Large food court", de: "Großer Food-Court" },
  "Rest areas": { en: "Rest areas", de: "Ruhebereiche" },
  "Quiet rest spots": { en: "Quiet rest spots", de: "Ruhige Rastplätze" },
  "Indoor rest benches": { en: "Indoor rest benches", de: "Sitzbänke im Innenbereich" },
  "Transit connected (Handelskai)": { en: "Transit connected (Handelskai)", de: "Verbindung zu Öffis (Handelskai)" },
  "Transit connected (Westbahnhof)": { en: "Transit connected (Westbahnhof)", de: "Verbindung zu Öffis (Westbahnhof)" },
  "Central transit hub": { en: "Central transit hub", de: "Zentraler Verkehrsknotenpunkt" },
  "Major travel hub": { en: "Major travel hub", de: "Großer Verkehrsknotenpunkt" },
  "Western Vienna regional hub": { en: "Western Vienna regional hub", de: "Regionaler Knotenpunkt Westwien" },
  "Restaurants": { en: "Restaurants", de: "Restaurants" },
  "Restaurant seating": { en: "Restaurant seating", de: "Restaurant-Sitzplätze" },
  "Restaurants open Sundays": { en: "Restaurants open Sundays", de: "Sonntags geöffnete Restaurants" },
  "Vietnamese cuisine": { en: "Vietnamese cuisine", de: "Vietnamesische Küche" },
  "Vegetarian options": { en: "Vegetarian options", de: "Vegetarische Speisen" },
  "Takeaway": { en: "Takeaway", de: "Speisen zum Mitnehmen" },
  "Food outlets": { en: "Food outlets", de: "Gastronomie-Angebote" },
  "Rooftop dining views": { en: "Rooftop dining views", de: "Rooftop-Dining mit Aussicht" },
  "Cinema nearby": { en: "Cinema nearby", de: "Kino in der Nähe" },
  "Public events & seating": { en: "Public events & seating", de: "Öffentliche Events & Sitzplätze" },
  "Shops open Sundays": { en: "Shops open Sundays", de: "Sonntags geöffnete Geschäfte" },
  "Phone charging": { en: "Phone charging", de: "Handyladestation" },
  "Modern design": { en: "Modern design", de: "Modernes Design" },
  "Children rest areas": { en: "Children rest areas", de: "Kinder-Rastbereiche" },
  "Spacious indoor mall": { en: "Spacious indoor mall", de: "Großzügiges Einkaufszentrum" },
  "Book browsing": { en: "Book browsing", de: "Bücher stöbern" },
  "Book reading spots": { en: "Book reading spots", de: "Ecken zum Lesen" },
  "Book browse tables": { en: "Book browse tables", de: "Büchertische zum Schmökern" },
  "Multi-story bookstore": { en: "Multi-story bookstore", de: "Mehrstöckige Buchhandlung" },
  "Historical pub seating": { en: "Historical pub seating", de: "Historische Pub-Sitzplätze" },
  "Draft beers": { en: "Draft beers", de: "Biere vom Fass" },
  "Late-night hours": { en: "Late-night hours", de: "Bis spät in die Nacht geöffnet" },
  "Late opening": { en: "Late opening", de: "Späte Öffnungszeiten" },
  "Cozy bar seating": { en: "Cozy bar seating", de: "Gemütliche Bar-Sitzplätze" },
  "Drinks & cocktails": { en: "Drinks & cocktails", de: "Getränke & Cocktails" },
  "Drinks": { en: "Drinks", de: "Getränke" },
  "Coffee drinks": { en: "Coffee drinks", de: "Kaffeespezialitäten" },
  "Charging sockets": { en: "Charging sockets", de: "Steckdosen zum Laden" },
  "Hotel lobby": { en: "Hotel lobby", de: "Hotellobby" },
  "Publicly accessible ground floor": { en: "Publicly accessible ground floor", de: "Öffentlich zugängliches Erdgeschoß" },
  "District cooling": { en: "District cooling", de: "Fernkälte" },
  "Restaurants / cafés": { en: "Restaurants / cafés", de: "Restaurants / Cafés" },
  "Bar / restaurant": { en: "Bar / restaurant", de: "Bar / Restaurant" },
  "Coworking space": { en: "Coworking space", de: "Coworking-Bereich" },
  "Outdoor seating nearby": { en: "Outdoor seating nearby", de: "Sitzplätze im Außenbereich in der Nähe" },
  "Traditional Viennese Café": { en: "Traditional Viennese Café", de: "Traditionelles Wiener Café" },
  "Classic Viennese interior": { en: "Classic Viennese interior", de: "Klassisches Wiener Interieur" },
  "Cakes & coffee": { en: "Cakes & coffee", de: "Kuchen & Kaffee" },
  "Famous pastries & cakes": { en: "Famous pastries & cakes", de: "Berühmte Mehlspeisen & Torten" },
  "Famous Original Sacher-Torte": { en: "Famous Original Sacher-Torte", de: "Berühmte Original Sacher-Torte" },
  "Imperial Torte": { en: "Imperial Torte", de: "Imperial Torte" },
  "Central location": { en: "Central location", de: "Zentrale Lage" },
  "Barrier free": { en: "Barrier free", de: "Barrierefrei" },
  "Barrier-free access": { en: "Barrier-free access", de: "Barrierefreier Zugang" },
  "Wheelchair accessible": { en: "Wheelchair accessible", de: "Barrierefrei" },
  "Limited wheelchair access": { en: "Limited wheelchair access", de: "Eingeschränkt barrierefrei" },
  "Ringstraße luxury café": { en: "Ringstraße luxury café", de: "Ringstraßen-Luxuscafé" },
  "Elegant atmosphere": { en: "Elegant atmosphere", de: "Elegante Atmosphäre" },
  "Fast service": { en: "Fast service", de: "Schneller Service" },
  "Station connected": { en: "Station connected", de: "Direkt im Bahnhof" },
  "McCafé": { en: "McCafé", de: "McCafé" },
  "Burgers": { en: "Burgers", de: "Burger" },
  "Italian cuisine": { en: "Italian cuisine", de: "Italienische Küche" },
  "Quick stop": { en: "Quick stop", de: "Schneller Stopp" },
  "Quick meals": { en: "Quick meals", de: "Schnelle Mahlzeiten" },
  "Sub sandwiches": { en: "Sub sandwiches", de: "Sub-Sandwiches" },
  "Drinking water": { en: "Drinking water", de: "Trinkwasser" },
  "Official Vienna Open Data": { en: "Official Vienna Open Data", de: "Offene Daten der Stadt Wien" },
  "Public water refresh point": { en: "Public water refresh point", de: "Öffentlicher Wasser-Erfrischungspunkt" },
  "Free natural water access": { en: "Free natural water access", de: "Freier Naturwasserzugang" },
  "Public Danube access": { en: "Public Danube access", de: "Öffentlicher Donauzugang" },
  "No lifeguard / no official bathing operation": { en: "No lifeguard / no official bathing operation", de: "Keine Badeaufsicht / kein offizieller Badebetrieb" },
  "Official bathing-water monitoring": { en: "Official bathing-water monitoring", de: "Offizielle Badewasser-Überwachung" },
  "Bathing water quality class 1": { en: "Bathing water quality class 1", de: "Badewasserqualität Klasse 1" },
  "Bathing water quality class 2": { en: "Bathing water quality class 2", de: "Badewasserqualität Klasse 2" },
  "Trinkbrunnen": { en: "Drinking fountain", de: "Trinkbrunnen" },
  "Trinkbrunnen mit Tränke": { en: "Drinking fountain with trough", de: "Trinkbrunnen mit Tränke" },
  "Trinkhydrant": { en: "Drinking hydrant", de: "Trinkhydrant" },
  "Trinkhydrant mit Tränke": { en: "Drinking hydrant with trough", de: "Trinkhydrant mit Tränke" },
  "Mobiler Trinkbrunnen mit Sprühnebelfunktion": { en: "Mobile drinking fountain with mist", de: "Mobiler Trinkbrunnen mit Sprühnebelfunktion" },
  "Sommerspritzer": { en: "Summer sprayer", de: "Sommerspritzer" },
  "Sprühnebeldusche": { en: "Mist shower", de: "Sprühnebeldusche" },
  "Spielbrunnen": { en: "Play fountain", de: "Spielbrunnen" },
  "Wasserspielmöglichkeit": { en: "Water play feature", de: "Wasserspielmöglichkeit" },
  "Bodenfontäne": { en: "Ground fountain", de: "Bodenfontäne" },
};

export const translateAmenity = (amenity: string, lang: "en" | "de"): string => {
  const waterTemperature = amenity.match(/^Water temperature (.+)$/);
  if (waterTemperature) {
    return lang === "de" ? `Wassertemperatur ${waterTemperature[1]}` : amenity;
  }

  return AMENITY_LABELS[amenity]?.[lang] || amenity;
};

const DRINKING_WATER_NOTE =
  "Official Vienna open-data drinking-water point. Address label is based on the nearest official Vienna address point; availability can vary seasonally or during maintenance.";

const WATER_REFRESH_NOTE =
  "Official Vienna open-data water feature for cooling down or getting wet. Address label is based on the nearest official Vienna address point. This is not a monitored swimming site; follow posted local rules.";

const NORDLICHT_NOTE =
  "Volkshilfe day center for adult homeless and roofless people. Provides daytime shelter, heat and storm protection, small meals and drinks, showers, WCs, laundry facilities, and advice. No referral is required for day-center access.";

const SAIGON_VIENNA_NOTE =
  "Visitor-suggested cool indoor restaurant serving Vietnamese food. A purchase is expected. The venue website confirms the address, opening hours, vegetarian dishes, and takeaway; OpenStreetMap currently lists air_conditioning=no, so this entry does not claim air conditioning.";

const SIEBEN_ZWERGE_NOTE =
  "Air-conditioned family café for children ages 0-5. The venue currently advertises summer hours of Tue-Sun 10:00-20:00, a €7.90 play fee per child for up to three hours, and recommends reservations on weekends or during school holidays. WIENXTRA additionally lists a €5 sibling fee, high chairs, a changing table, and wheelchair/stroller access. Children remain under adult supervision.";

const VOGEL_KAFFEE_NOTE =
  "Specialty coffee shop and micro-roastery; a purchase is expected. OpenStreetMap currently lists air_conditioning=yes, but a recent visitor reports that the café is often uncomfortably hot and that the system may not be running. The venue confirms the address and current hours; OpenStreetMap lists limited wheelchair access and a wheelchair-accessible toilet.";

const IBIS_HAUPTBAHNHOF_NOTE =
  "Accor describes a lobby open to everyone for a short rest or checking email, with 24/7 reception service, and lists air conditioning among the hotel's on-site services. The source does not state separately that the lobby itself is air-conditioned, so this is marked as likely rather than confirmed. Staff rules or purchase expectations can apply.";

const ERSTE_CAMPUS_NOTE =
  "Erste Group says the ground-floor zones are publicly accessible, contain restaurants and a café, and that the building is connected to Vienna's district-cooling network. This is listed as a cool indoor space rather than conventional air conditioning. Access hours, security rules, and purchase expectations at individual businesses can vary.";

const MCDONALDS_HAUPTBAHNHOF_NOTE =
  "Visitor-reported air-conditioned McDonald's at Vienna Hauptbahnhof; the AC claim is not independently confirmed. A purchase is expected. ÖBB confirms the ground-floor location, current hours, integrated McCafé, and lounge seating.";

const SUBWAY_HAUPTBAHNHOF_NOTE =
  "Visitor-reported air-conditioned Subway at Vienna Hauptbahnhof; the AC claim is not independently confirmed. A purchase is expected. ÖBB confirms the lower-ground-floor location and current daily hours.";

const BURGER_KING_HAUPTBAHNHOF_NOTE =
  "Visitor-reported air-conditioned Burger King at Vienna Hauptbahnhof; the AC claim is not independently confirmed. A purchase is expected. ÖBB confirms the ground-floor location and current daily hours.";

const LOSTERIA_HAUPTBAHNHOF_NOTE =
  "Visitor-reported air-conditioned L'Osteria at Vienna Hauptbahnhof; the AC claim is not independently confirmed. A purchase is expected. ÖBB confirms the ground-floor location and current hours.";

const PHIL_NOTE =
  "Air-conditioned café, bookshop, and evening bar. A purchase is expected. The venue confirms AC, current hours, more than 4,000 books, and a seasonal outdoor garden. OpenStreetMap lists indoor and outdoor seating, limited wheelchair access, and a wheelchair-accessible toilet.";

const MUMOK_LEVEL_0_NOTE =
  "Air-conditioned museum entrance-level exhibition. Only Level 0 is free from 20 June through 30 September 2026; other levels normally require paid admission. The museum's renovation information documents climate control and cooling operation. OpenStreetMap lists free Wi-Fi, wheelchair access, and a wheelchair-accessible toilet.";

const SIL_NOTE =
  "Air-conditioned all-day breakfast and specialty-coffee restaurant. A purchase is expected. Official hours are daily 09:00-18:00, with the kitchen open until 17:30. The venue confirms weekday laptop use, unlimited Wi-Fi, and power outlets; OpenStreetMap and WIENerLEBEN corroborate AC and wheelchair access.";

const TOMOCHAN_NOTE =
  "Visitor-reported air-conditioned ramen restaurant; the AC claim is not independently confirmed. A purchase is expected. The official site confirms the Stiegengasse 16/18 location and current hours; OpenStreetMap lists indoor and outdoor seating and wheelchair=no.";

const SANG_SANG_NOTE =
  "Visitor-reported air-conditioned Korean restaurant; the AC claim is not independently confirmed. A purchase is expected. The venue confirms its current hours, effective 1 August 2026, and Korean menu; OpenStreetMap lists indoor and outdoor seating and wheelchair=no.";

const VENEDIGER_AU_WATER_NOTE =
  'Official Vienna data identifies this as a Spielbrunnen, and the City park page confirms a children\'s playground with water play. "Kinderplantschbecken" (children\'s paddling pool) is the visitor-reported local description. Round-the-clock access is visitor-reported and is also listed by Sunny.at; the City page does not publish opening hours.';

export const translateNote = (note: string, lang: "en" | "de"): string => {
  if (lang === "en") return note;

  if (note === DRINKING_WATER_NOTE) {
    return "Offizieller Trinkwasserpunkt aus offenen Daten der Stadt Wien. Die Adressbezeichnung basiert auf dem nächstgelegenen offiziellen Wiener Adresspunkt; die Verfügbarkeit kann saisonal oder wegen Wartungsarbeiten variieren.";
  }

  if (note === WATER_REFRESH_NOTE) {
    return "Offizielle Wasseranlage aus offenen Daten der Stadt Wien zum Abkühlen oder Nasswerden. Die Adressbezeichnung basiert auf dem nächstgelegenen offiziellen Wiener Adresspunkt. Dies ist keine überwachte Badestelle; beachte die örtlich ausgeschilderten Regeln.";
  }

  if (note === NORDLICHT_NOTE) {
    return "Tageszentrum der Volkshilfe für erwachsene obdach- und wohnungslose Menschen. Bietet Aufenthalt untertags, Schutz vor Hitze und Unwettern, kleine Mahlzeiten und Getränke, Duschen, WCs, Waschmöglichkeiten und Beratung. Für den Zugang zum Tageszentrum ist keine Zuweisung notwendig.";
  }

  if (note === SAIGON_VIENNA_NOTE) {
    return "Von einem Besucher vorgeschlagenes kühles Innenraum-Restaurant mit vietnamesischer Küche. Konsumation wird erwartet. Die Website des Lokals bestätigt Adresse, Öffnungszeiten, vegetarische Gerichte und Speisen zum Mitnehmen; OpenStreetMap führt derzeit air_conditioning=no, daher wird für diesen Eintrag keine Klimaanlage angegeben.";
  }

  if (note === SIEBEN_ZWERGE_NOTE) {
    return "Klimatisiertes Familiencafé für Kinder von 0 bis 5 Jahren. Das Lokal nennt derzeit Sommeröffnungszeiten Di-So 10:00-20:00, einen Spielbeitrag von 7,90 € pro Kind für bis zu drei Stunden und empfiehlt am Wochenende oder in den Ferien eine Reservierung. WIENXTRA führt zusätzlich einen Geschwisterbeitrag von 5 €, Kinderhochstühle, einen Wickeltisch sowie rollstuhl- und kinderwagengerechten Zugang an. Kinder bleiben unter Aufsicht ihrer Begleitpersonen.";
  }

  if (note === VOGEL_KAFFEE_NOTE) {
    return "Spezialitätencafé mit Mikrorösterei; Konsumation wird erwartet. OpenStreetMap führt derzeit air_conditioning=yes, ein aktueller Besucherbericht beschreibt das Café jedoch als oft unangenehm heiß und die Anlage als möglicherweise nicht in Betrieb. Das Lokal bestätigt Adresse und aktuelle Öffnungszeiten; OpenStreetMap führt eingeschränkte Rollstuhlzugänglichkeit und ein rollstuhlgerechtes WC.";
  }

  if (note === IBIS_HAUPTBAHNHOF_NOTE) {
    return "Accor beschreibt eine für alle offene Lobby für eine kurze Pause oder zum E-Mail-Lesen, einen rund um die Uhr erreichbaren Rezeptionsservice und führt Klimaanlage als Hotelleistung vor Ort. Die Quelle bestätigt nicht gesondert, dass die Lobby selbst klimatisiert ist; der Eintrag ist daher als wahrscheinlich statt bestätigt gekennzeichnet. Hausregeln oder Konsumerwartungen können gelten.";
  }

  if (note === ERSTE_CAMPUS_NOTE) {
    return "Laut Erste Group sind die Erdgeschoßzonen öffentlich zugänglich, beherbergen Restaurants und ein Café, und das Gebäude ist an das Wiener Fernkältenetz angeschlossen. Der Eintrag ist als kühler Innenraum und nicht als konventionell klimatisiert gekennzeichnet. Zugangszeiten, Sicherheitsregeln und Konsumerwartungen einzelner Betriebe können variieren.";
  }

  if (note === MCDONALDS_HAUPTBAHNHOF_NOTE) {
    return "Von einem Besucher als klimatisiert gemeldetes McDonald's im Wiener Hauptbahnhof; die Klimaanlage ist nicht unabhängig bestätigt. Konsumation wird erwartet. ÖBB bestätigt den Standort im Erdgeschoß, die aktuellen Öffnungszeiten, das integrierte McCafé und Lounge-Sitzplätze.";
  }

  if (note === SUBWAY_HAUPTBAHNHOF_NOTE) {
    return "Von einem Besucher als klimatisiert gemeldetes Subway im Wiener Hauptbahnhof; die Klimaanlage ist nicht unabhängig bestätigt. Konsumation wird erwartet. ÖBB bestätigt den Standort im ersten Untergeschoß und die aktuellen täglichen Öffnungszeiten.";
  }

  if (note === BURGER_KING_HAUPTBAHNHOF_NOTE) {
    return "Von einem Besucher als klimatisiert gemeldetes Burger King im Wiener Hauptbahnhof; die Klimaanlage ist nicht unabhängig bestätigt. Konsumation wird erwartet. ÖBB bestätigt den Standort im Erdgeschoß und die aktuellen täglichen Öffnungszeiten.";
  }

  if (note === LOSTERIA_HAUPTBAHNHOF_NOTE) {
    return "Von einem Besucher als klimatisiert gemeldete L'Osteria im Wiener Hauptbahnhof; die Klimaanlage ist nicht unabhängig bestätigt. Konsumation wird erwartet. ÖBB bestätigt den Standort im Erdgeschoß und die aktuellen Öffnungszeiten.";
  }

  if (note === PHIL_NOTE) {
    return "Klimatisiertes Café, Buchhandlung und abendliche Bar. Konsumation wird erwartet. Das Lokal bestätigt Klimaanlage, aktuelle Öffnungszeiten, mehr als 4.000 Bücher und einen saisonalen Schanigarten. OpenStreetMap führt Innen- und Außensitzplätze, eingeschränkte Rollstuhlzugänglichkeit und ein rollstuhlgerechtes WC.";
  }

  if (note === MUMOK_LEVEL_0_NOTE) {
    return "Klimatisierte Ausstellung im Eingangsbereich des Museums. Nur Ebene 0 ist vom 20. Juni bis 30. September 2026 bei freiem Eintritt zugänglich; für andere Ebenen ist normalerweise ein Ticket erforderlich. Die Renovierungsinformation des Museums belegt Klimatisierung und Kühlbetrieb. OpenStreetMap führt kostenloses WLAN, rollstuhlgerechten Zugang und ein rollstuhlgerechtes WC.";
  }

  if (note === SIL_NOTE) {
    return "Klimatisiertes Restaurant mit ganztägigem Frühstück und Spezialitätenkaffee. Konsumation wird erwartet. Die offiziellen Öffnungszeiten sind täglich 09:00-18:00, die Küche ist bis 17:30 geöffnet. Das Lokal bestätigt Laptopnutzung an Werktagen, unbegrenztes WLAN und Steckdosen; OpenStreetMap und WIENerLEBEN bestätigen Klimaanlage und rollstuhlgerechten Zugang.";
  }

  if (note === TOMOCHAN_NOTE) {
    return "Von einem Besucher als klimatisiert gemeldetes Ramen-Restaurant; die Klimaanlage ist nicht unabhängig bestätigt. Konsumation wird erwartet. Die offizielle Website bestätigt den Standort Stiegengasse 16/18 und die aktuellen Öffnungszeiten; OpenStreetMap führt Innen- und Außensitzplätze sowie wheelchair=no.";
  }

  if (note === SANG_SANG_NOTE) {
    return "Von einem Besucher als klimatisiert gemeldetes koreanisches Restaurant; die Klimaanlage ist nicht unabhängig bestätigt. Konsumation wird erwartet. Das Lokal bestätigt die seit 1. August 2026 geltenden Öffnungszeiten und die koreanische Speisekarte; OpenStreetMap führt Innen- und Außensitzplätze sowie wheelchair=no.";
  }

  if (note === VENEDIGER_AU_WATER_NOTE) {
    return "Offizielle Wiener Daten führen die Anlage als Spielbrunnen, und die Parkseite der Stadt bestätigt einen Kinderspielplatz mit Wasserspielmöglichkeit. „Kinderplantschbecken“ beziehungsweise Kinderplanschbecken ist die von einem Besucher gemeldete lokale Bezeichnung. Der Rund-um-die-Uhr-Zugang wurde von einem Besucher gemeldet und wird auch von Sunny.at angeführt; die Stadtseite veröffentlicht keine Öffnungszeiten.";
  }

  const bathingMatch = note.match(
    /^City of Vienna bathing-water monitoring point(?: last tested ([^.]+))?\. Check local rules, currents, closures, and posted safety information before entering the water\.$/,
  );

  if (bathingMatch) {
    const testedOn = bathingMatch[1] ? ` zuletzt geprüft am ${bathingMatch[1]}` : "";
    return `Badewasser-Messstelle der Stadt Wien${testedOn}. Prüfe örtliche Regeln, Strömungen, Sperren und ausgeschilderte Sicherheitshinweise, bevor du ins Wasser gehst.`;
  }

  return note;
};

export const isAirConditioningAmenity = (amenity: string): boolean =>
  /\b(ac|air[- ]?condition(?:ing|ed)?)\b/i.test(amenity);
