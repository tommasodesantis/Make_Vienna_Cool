export interface LanguageTranslations {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
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
  paidRequired: string;
  airConditioning: string;
  acConfirmed: string;
  acLikely: string;
  acUnverified: string;
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
  details: string;
  filters: string;
  total: string;
  allDistricts: string;
  districtFilter: string;
  heatEyebrow: string;
  heroTextBeforeLink: string;
  githubRepository: string;
  heroTextAfterLink: string;
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
}

export const TRANSLATIONS: { en: LanguageTranslations; de: LanguageTranslations } = {
  en: {
    title: "Make Vienna Cool",
    subtitle: "Find public cool zones and air-conditioned spots in Vienna.",
    searchPlaceholder: "Search by name, category, address or amenities...",
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
    paidRequired: "Purchase Required / Ticket Required",
    airConditioning: "Air Conditioning",
    acConfirmed: "Confirmed AC",
    acLikely: "Likely AC",
    acUnverified: "Reddit Claimed AC (Unverified)",
    acOfficialZone: "Official Cool Zone",
    acCoolRoom: "Cool Indoor Room",
    excludedTitle: "Paid Venues Excluded",
    excludedDesc: "The following places were recommended as air-conditioned but require a paid entry ticket. They are excluded from our primary map & list:",
    madeBy: "made by Tommaso De Santis",
    district: "District",
    yes: "Yes",
    no: "No",
    seating: "Seating",
    wifi: "Free Wi-Fi",
    mapHint: "Click a pin on the map or select a place from the list to view full details.",
    details: "Details",
    filters: "Filters",
    total: "Total",
    allDistricts: "All Districts",
    districtFilter: "District Filter",
    heatEyebrow: "Beat the Heat in Vienna",
    heroTextBeforeLink: "Find public cool zones and air-conditioned spots in Vienna. This is an independent open-source project, not affiliated with the City of Vienna. If you want to collaborate, please visit this ",
    githubRepository: "GitHub repo",
    heroTextAfterLink: ".",
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
  },
  de: {
    title: "Make Vienna Cool",
    subtitle: "Finde kühle öffentliche Orte, Bibliotheken und klimatisierte Lokale in Wien.",
    searchPlaceholder: "Suche nach Name, Kategorie, Adresse oder Ausstattung...",
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
    paidRequired: "Konsumpflicht oder Ticket erforderlich",
    airConditioning: "Klimaanlage",
    acConfirmed: "Bestätigte Klimaanlage",
    acLikely: "Wahrscheinlich klimatisiert",
    acUnverified: "Klimaanlage laut Reddit (nicht bestätigt)",
    acOfficialZone: "Offizielle Coole Zone",
    acCoolRoom: "Kühler Raum (ohne Klima)",
    excludedTitle: "Kostenpflichtige Orte ausgeschlossen",
    excludedDesc: "Die folgenden Orte wurden als klimatisiert empfohlen, erfordern jedoch ein kostenpflichtiges Eintrittsticket. Sie sind aus unserer Hauptkarte & Liste ausgeschlossen:",
    madeBy: "made by Tommaso De Santis",
    district: "Bezirk",
    yes: "Ja",
    no: "Nein",
    seating: "Sitzmöglichkeiten",
    wifi: "Kostenloses WLAN",
    mapHint: "Klicke auf eine Nadel auf der Karte oder wähle einen Ort aus der Liste aus, um Details anzuzeigen.",
    details: "Detailansicht",
    filters: "Filter",
    total: "Gesamt",
    allDistricts: "Alle Bezirke",
    districtFilter: "Bezirksfilter",
    heatEyebrow: "Abkühlung in Wien",
    heroTextBeforeLink: "Finde kühle öffentliche Orte und klimatisierte Lokale in Wien. Dies ist ein unabhängiges Open-Source-Projekt und steht in keiner Verbindung zur Stadt Wien. Wenn Sie mitarbeiten möchten, besuchen Sie bitte dieses ",
    githubRepository: "GitHub-Repository",
    heroTextAfterLink: ".",
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
  "Confectionery / Café": { en: "Confectionery / Café", de: "Konditorei / Café" },
  "Grand Café": { en: "Grand Café", de: "Traditionscafé" },
  "Fast Food": { en: "Fast Food", de: "Fast Food" },
};

export const translateCategory = (category: string, lang: "en" | "de"): string =>
  CATEGORY_LABELS[category]?.[lang] || category;

export const AMENITY_LABELS: Record<string, { en: string; de: string }> = {
  "Official public cooling space": { en: "Official public cooling space", de: "Offizieller kühler Raum (Stadt Wien)" },
  "Official public cooling space (2nd floor)": { en: "Official public cooling space (2nd floor)", de: "Offizieller kühler Raum (2. Stock)" },
  "Cold drinks / free drinking water": { en: "Cold drinks / free drinking water", de: "Kalte Getränke / freies Trinkwasser" },
  "Cold drinks / water": { en: "Cold drinks / water", de: "Kalte Getränke / Wasser" },
  "Cold drinks": { en: "Cold drinks", de: "Kalte Getränke" },
  "Water": { en: "Water", de: "Wasser" },
  "Seating": { en: "Seating", de: "Sitzmöglichkeiten" },
  "Indoor seating": { en: "Indoor seating", de: "Sitzplätze im Innenbereich" },
  "Quiet seating": { en: "Quiet seating", de: "Ruhige Sitzmöglichkeiten" },
  "Museum seating / rest areas": { en: "Museum seating / rest areas", de: "Museums-Sitzbereiche" },
  "Seating benches": { en: "Seating benches", de: "Sitzbänke" },
  "Comfortable seats": { en: "Comfortable seats", de: "Bequeme Sessel" },
  "Cozy seats & corners": { en: "Cozy seats & corners", de: "Gemütliche Sitzecken" },
  "Benches": { en: "Benches", de: "Sitzbänke" },
  "Youth club atmosphere": { en: "Youth club atmosphere", de: "Jugendclub-Atmosphäre" },
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
  "Central transit hub": { en: "Central transit hub", de: "Zentraler Verkehrsknotenpunkt" },
  "Major travel hub": { en: "Major travel hub", de: "Großer Verkehrsknotenpunkt" },
  "Western Vienna regional hub": { en: "Western Vienna regional hub", de: "Regionaler Knotenpunkt Westwien" },
  "Restaurants": { en: "Restaurants", de: "Restaurants" },
  "Restaurants open Sundays": { en: "Restaurants open Sundays", de: "Sonntags geöffnete Restaurants" },
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
  "Quick stop": { en: "Quick stop", de: "Schneller Stopp" },
  "Quick meals": { en: "Quick meals", de: "Schnelle Mahlzeiten" },
  "Sub sandwiches": { en: "Sub sandwiches", de: "Sub-Sandwiches" },
};

export const translateAmenity = (amenity: string, lang: "en" | "de"): string =>
  AMENITY_LABELS[amenity]?.[lang] || amenity;

export const isAirConditioningAmenity = (amenity: string): boolean =>
  /\b(ac|air[- ]?condition(?:ing|ed)?)\b/i.test(amenity);
