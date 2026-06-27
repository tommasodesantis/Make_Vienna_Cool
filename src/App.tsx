import { useState, useMemo } from "react";
import { VIENNA_PLACES, CompactPlace } from "./data/vienna_cool_places";
import { TRANSLATIONS } from "./data/translations";
import { ViennaMap } from "./components/ViennaMap";
import { PlaceList } from "./components/PlaceList";
import { PlaceDetailCard } from "./components/PlaceDetailCard";
import { Wind } from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<"en" | "de">("de");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Checklist filters states
  const [filterAc, setFilterAc] = useState<boolean>(false);
  const [filterSeating, setFilterSeating] = useState<boolean>(false);
  const [filterWifi, setFilterWifi] = useState<boolean>(false);
  const [filterFree, setFilterFree] = useState<boolean>(false);
  const [filterSockets, setFilterSockets] = useState<boolean>(false);
  const [filterTables, setFilterTables] = useState<boolean>(false);
  const [filterAccessible, setFilterAccessible] = useState<boolean>(false);

  // Days and hours states
  const [selectedDay, setSelectedDay] = useState<string>("ALL");
  const [selectedHourRange, setSelectedHourRange] = useState<string>("ALL");

  const t = TRANSLATIONS[lang];

  // Dynamically extract categories
  const categories = useMemo(() => {
    const cats = VIENNA_PLACES.map((p) => p.category);
    return Array.from(new Set(cats)).sort();
  }, []);

  // Helper to parse days from hours string
  const parseDaysFromHoursString = (hoursStr: string): string[] => {
    const days: string[] = [];
    const DAYS_LIST = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const parts = hoursStr.split(":");
    if (parts.length === 0) return [];
    const dayPart = parts[0].trim();

    if (dayPart.includes("-")) {
      const rangeParts = dayPart.split("-").map(p => p.trim());
      if (rangeParts.length === 2) {
        const startDay = rangeParts[0].substring(0, 3);
        const endDay = rangeParts[1].substring(0, 3);
        const startIndex = DAYS_LIST.findIndex(d => startDay.includes(d));
        const endIndex = DAYS_LIST.findIndex(d => endDay.includes(d));

        if (startIndex !== -1 && endIndex !== -1) {
          if (startIndex <= endIndex) {
            for (let i = startIndex; i <= endIndex; i++) {
              days.push(DAYS_LIST[i]);
            }
          } else {
            for (let i = startIndex; i < DAYS_LIST.length; i++) days.push(DAYS_LIST[i]);
            for (let i = 0; i <= endIndex; i++) days.push(DAYS_LIST[i]);
          }
        }
      }
    } else {
      DAYS_LIST.forEach(d => {
        if (dayPart.toLowerCase().includes(d.toLowerCase())) {
          days.push(d);
        }
      });
    }
    return days;
  };

  // Helper to check if open on day
  const isPlaceOpenOnDay = (hours: string[], targetDay: string): boolean => {
    if (targetDay === "ALL") return true;
    for (const hStr of hours) {
      const days = parseDaysFromHoursString(hStr);
      if (days.includes(targetDay)) {
        return true;
      }
    }
    return false;
  };

  // Helper to check if open at hour range
  const isPlaceOpenAtHourRange = (hours: string[], range: string): boolean => {
    if (range === "ALL") return true;

    let startHour = 0;
    let endHour = 24;
    if (range === "morning") {
      startHour = 8;
      endHour = 12;
    } else if (range === "afternoon") {
      startHour = 12;
      endHour = 17;
    } else if (range === "evening") {
      startHour = 17;
      endHour = 21;
    } else if (range === "now") {
      const viennaTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Vienna" }));
      const currentDayIndex = viennaTime.getDay(); // 0 = Sunday, 1 = Monday, ...
      const DAYS_LIST = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const currentDayAbbrev = DAYS_LIST[currentDayIndex];
      const currentHour = viennaTime.getHours();
      const currentMinute = viennaTime.getMinutes();
      const currentTotalMinutes = currentHour * 60 + currentMinute;

      let openNow = false;
      for (const hStr of hours) {
        const days = parseDaysFromHoursString(hStr);
        if (days.includes(currentDayAbbrev) || (currentDayAbbrev === "Sun" && days.includes("Sun"))) {
          const timeParts = hStr.split(":");
          if (timeParts.length >= 2) {
            const timeRangePart = timeParts.slice(1).join(":").trim();
            const timeMatch = timeRangePart.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
            if (timeMatch) {
              const sh = parseInt(timeMatch[1]);
              const sm = parseInt(timeMatch[2]);
              const eh = parseInt(timeMatch[3]);
              const em = parseInt(timeMatch[4]);

              const startTotal = sh * 60 + sm;
              const endTotal = eh * 60 + em;

              if (currentTotalMinutes >= startTotal && currentTotalMinutes <= endTotal) {
                openNow = true;
              }
            }
          }
        }
      }
      return openNow;
    }

    for (const hStr of hours) {
      const parts = hStr.split(":");
      if (parts.length >= 2) {
        const timeRangePart = parts.slice(1).join(":").trim();
        const timeMatch = timeRangePart.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          const sh = parseInt(timeMatch[1]);
          const eh = parseInt(timeMatch[3]);
          if (sh < endHour && eh > startHour) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Search & Filter Logic
  const filteredPlaces = useMemo(() => {
    return VIENNA_PLACES.filter((place) => {
      // Category filter
      if (selectedCategory !== "ALL" && place.category !== selectedCategory) {
        return false;
      }

      // AC filter
      if (filterAc && !place.ac) {
        return false;
      }

      // Seating filter
      if (filterSeating && !place.sitting) {
        return false;
      }

      // Wi-Fi filter
      if (filterWifi && !place.wifi) {
        return false;
      }

      // Free Entry filter
      if (filterFree && !place.free) {
        return false;
      }

      // Sockets/Charging outlets filter
      if (filterSockets) {
        const hasSockets = place.amenities.some(a => 
          /socket|power|outlet|charge|steckdose|lade/i.test(a)
        ) || (place.notes && /socket|power|outlet|charge|steckdose|lade/i.test(place.notes));
        if (!hasSockets) return false;
      }

      // Tables/Desks filter
      if (filterTables) {
        const hasTables = place.amenities.some(a => 
          /table|desk|tisch|schreibtisch|arbeits/i.test(a)
        ) || (place.notes && /table|desk|tisch|schreibtisch|arbeits/i.test(place.notes));
        if (!hasTables) return false;
      }

      // Accessible filter
      if (filterAccessible) {
        const hasAccessibility = place.amenities.some(a => 
          /barrier|access|wheelchair|rollstuhl|barriere/i.test(a)
        ) || (place.notes && /barrier|access|wheelchair|rollstuhl|barriere/i.test(place.notes)) ||
        place.category === "Official Cool Zone" || 
        place.category === "Public Library" || 
        place.category === "Shopping Mall" || 
        place.category === "Shopping Mall & Transit Station" ||
        place.category === "Department Store";
        if (!hasAccessibility) return false;
      }

      // Opening Day filter
      if (selectedDay !== "ALL" && !isPlaceOpenOnDay(place.hours, selectedDay)) {
        return false;
      }

      // Opening Hour filter
      if (selectedHourRange !== "ALL" && !isPlaceOpenAtHourRange(place.hours, selectedHourRange)) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, filterAc, filterSeating, filterWifi, filterFree, filterSockets, filterTables, filterAccessible, selectedDay, selectedHourRange]);

  // Selected place object
  const selectedPlace = useMemo(() => {
    if (!selectedPlaceId) return null;
    return VIENNA_PLACES.find((p) => p.id === selectedPlaceId) || null;
  }, [selectedPlaceId]);

  // Automatically scroll to detail card or map on mobile when a place is selected from list
  const handleSelectPlace = (id: string | null, fromMap = false) => {
    setSelectedPlaceId(id);
    if (id && !fromMap) {
      // Scroll list item into view if not already
      const element = document.getElementById(`place-item-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      // If mobile and clicked from list, scroll to map smoothly so they see the centered pin
      if (window.innerWidth < 768) {
        const mapElement = document.getElementById("map-section");
        if (mapElement) {
          mapElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-offwhite text-slate-brand">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-[1010] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-[#2C3E50] tracking-tight leading-none m-0 flex items-center gap-1.5 select-none whitespace-nowrap flex-nowrap">
                <span>Make Vienna</span>
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-sky-600 drop-shadow-[0_1.5px_3px_rgba(56,189,248,0.4)] tracking-wide">
                  Cool ❄️
                </span>
              </h1>
            </div>
          </div>

          {/* Compact English / Deutsch Toggle */}
          <div className="flex items-center gap-1 bg-offwhite p-1 rounded-xl border border-slate-200/40 shrink-0">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                lang === "en"
                  ? "bg-green-brand text-white shadow-sm"
                  : "text-slate-500 hover:text-[#2C3E50] hover:bg-white/50"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("de")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                lang === "de"
                  ? "bg-green-brand text-white shadow-sm"
                  : "text-slate-500 hover:text-[#2C3E50] hover:bg-white/50"
              }`}
            >
              DE
            </button>
          </div>
        </div>
      </header>

      {/* Hero Intro Section */}
      <div className="bg-aqua py-6 sm:py-8 border-b border-slate-100">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <p className="text-dark-green font-bold text-xs uppercase tracking-wider mb-2 flex items-center justify-center sm:justify-start gap-1.5">
            <Wind className="w-4 h-4 text-green-brand" />
            {t.heatEyebrow}
          </p>
          <p className="text-[#2C3E50] text-sm sm:text-base font-medium max-w-none leading-relaxed m-0">
            {t.heroTextBeforeLink}
            <a
              href="https://github.com/tommasodesantis/Make_Vienna_Cool"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-brand hover:underline font-bold"
            >
              {t.githubRepository}
            </a>
            {t.heroTextAfterLink}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Place List Browsing & Search (Mobile: ABOVE map, Desktop: left side) */}
          <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-1">
            <PlaceList
              places={filteredPlaces}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={handleSelectPlace}
              lang={lang}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              filterAc={filterAc}
              onFilterAcChange={setFilterAc}
              filterSeating={filterSeating}
              onFilterSeatingChange={setFilterSeating}
              filterWifi={filterWifi}
              onFilterWifiChange={setFilterWifi}
              filterFree={filterFree}
              onFilterFreeChange={setFilterFree}
              filterSockets={filterSockets}
              onFilterSocketsChange={setFilterSockets}
              filterTables={filterTables}
              onFilterTablesChange={setFilterTables}
              filterAccessible={filterAccessible}
              onFilterAccessibleChange={setFilterAccessible}
              selectedDay={selectedDay}
              onSelectedDayChange={setSelectedDay}
              selectedHourRange={selectedHourRange}
              onSelectedHourRangeChange={setSelectedHourRange}
              categories={categories}
            />

            {/* Selected Place Details (Mobile: displays prominently under search/list) */}
            <div className="block lg:hidden">
              <PlaceDetailCard place={selectedPlace} lang={lang} />
            </div>
          </div>

          {/* Right Column: Map section and details (Mobile: map second) */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-2">
            {/* Map Wrapper */}
            <div id="map-section" className="h-[350px] sm:h-[450px] md:h-[500px]">
              <ViennaMap
                places={filteredPlaces}
                selectedPlaceId={selectedPlaceId}
                onSelectPlace={handleSelectPlace}
                lang={lang}
              />
            </div>

            {/* Selected Place Details (Desktop: displayed side by side below map or inline) */}
            <div className="hidden lg:block">
              <PlaceDetailCard place={selectedPlace} lang={lang} />
            </div>
          </div>
        </div>
      </main>

      {/* Styled Footer */}
      <footer className="h-12 bg-white border-t border-[#E2E8F0] flex items-center justify-center font-sans font-medium text-[11px] text-[#94A3B8] uppercase tracking-widest mt-16 shrink-0">
        {t.madeBy}
      </footer>
    </div>
  );
}
