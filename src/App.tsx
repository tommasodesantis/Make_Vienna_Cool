import { useEffect, useMemo, useState } from "react";
import { COOL_PLACES, CompactPlace, PlaceType } from "./data/vienna_cool_places";
import { TRANSLATIONS } from "./data/translations";
import { ViennaMap } from "./components/ViennaMap";
import { PlaceList } from "./components/PlaceList";
import { PlaceDetailCard } from "./components/PlaceDetailCard";
import { Droplets, LocateFixed, Loader2, Snowflake, Waves, X } from "lucide-react";
import { distanceMetersBetween, getAccessibilityStatus, UserLocation } from "./data/place_utils";

type LocationConsent = "unknown" | "granted" | "denied";
type LocationStatus = "idle" | "requesting" | "granted" | "denied" | "unsupported";

interface StoredPreferences {
  lang?: "en" | "de";
  locationConsent?: LocationConsent;
}

const PREFERENCES_KEY = "make-vienna-cool.preferences.v1";

const readStoredPreferences = (): StoredPreferences => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(PREFERENCES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export default function App() {
  const storedPreferences = useMemo(readStoredPreferences, []);
  const [lang, setLang] = useState<"en" | "de">(storedPreferences.lang ?? "de");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");
  const [activeMode, setActiveMode] = useState<PlaceType>("cool");
  const [datasets, setDatasets] = useState<Partial<Record<PlaceType, CompactPlace[]>>>({
    cool: COOL_PLACES,
  });
  const [isDatasetLoading, setIsDatasetLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [sortByNearest, setSortByNearest] = useState(false);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationConsent, setLocationConsent] = useState<LocationConsent>(
    storedPreferences.locationConsent ?? "unknown",
  );
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(
    () => typeof window !== "undefined" && !window.localStorage.getItem(PREFERENCES_KEY),
  );
  const [preferencesLang, setPreferencesLang] = useState<"en" | "de">(lang);
  const [preferencesLocationEnabled, setPreferencesLocationEnabled] = useState(
    locationConsent === "granted",
  );

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
  const preferencesT = TRANSLATIONS[preferencesLang];
  const activeDataset = datasets[activeMode];
  const datasetPlaces = activeDataset ?? [];

  useEffect(() => {
    if (activeDataset || activeMode === "cool") return;

    let cancelled = false;
    setIsDatasetLoading(true);

    const loader =
      activeMode === "drinking"
        ? import("./data/drinking_water_places").then((module) => module.VIENNA_DRINKING_WATER_FOUNTAINS)
        : import("./data/water_access_places").then((module) => module.VIENNA_WATER_ACCESS_PLACES);

    loader
      .then((places) => {
        if (cancelled) return;
        setDatasets((current) => ({ ...current, [activeMode]: places }));
      })
      .finally(() => {
        if (!cancelled) setIsDatasetLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeDataset, activeMode]);

  const persistPreferences = (next: StoredPreferences) => {
    if (typeof window === "undefined") return;

    const current = readStoredPreferences();
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ ...current, ...next }));
  };

  const updateLanguage = (nextLang: "en" | "de") => {
    setLang(nextLang);
    setPreferencesLang(nextLang);
    persistPreferences({ lang: nextLang });
  };

  const openPreferences = () => {
    setPreferencesLang(lang);
    setPreferencesLocationEnabled(locationConsent === "granted");
    setIsPreferencesOpen(true);
  };

  const savePreferences = () => {
    const nextConsent: LocationConsent = preferencesLocationEnabled ? "granted" : "denied";
    setLang(preferencesLang);
    setLocationConsent(nextConsent);
    persistPreferences({ lang: preferencesLang, locationConsent: nextConsent });
    setIsPreferencesOpen(false);
  };

  const dismissPreferences = () => {
    setLocationConsent((current) => {
      const next = current === "unknown" ? "denied" : current;
      persistPreferences({ lang, locationConsent: next });
      return next;
    });
    setIsPreferencesOpen(false);
  };

  // Dynamically extract categories
  const categories = useMemo(() => {
    const cats = datasetPlaces.map((p) => p.category);
    return Array.from(new Set(cats)).sort();
  }, [datasetPlaces]);

  const districts = useMemo(() => {
    const districtValues = datasetPlaces
      .map((place) => place.district)
      .filter((district) => /^\d+$/.test(district));

    return Array.from(new Set(districtValues)).sort((a, b) => Number(a) - Number(b));
  }, [datasetPlaces]);

  const resetFilters = () => {
    setSelectedPlaceId(null);
    setSelectedCategory("ALL");
    setSelectedDistrict("ALL");
    setFilterAc(false);
    setFilterSeating(false);
    setFilterWifi(false);
    setFilterFree(false);
    setFilterSockets(false);
    setFilterTables(false);
    setFilterAccessible(false);
    setSelectedDay("ALL");
    setSelectedHourRange("ALL");
  };

  const handleModeChange = (mode: PlaceType) => {
    setActiveMode(mode);
    resetFilters();
  };

  const requestUserLocation = () => {
    if (locationConsent !== "granted") {
      setLocationStatus("denied");
      openPreferences();
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }

    setLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setSortByNearest(true);
        setLocationStatus("granted");
      },
      () => {
        setLocationStatus("denied");
      },
      {
        enableHighAccuracy: false,
        maximumAge: 300000,
        timeout: 12000,
      },
    );
  };

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
      const currentDayIndex = viennaTime.getDay();
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

  const filteredPlaces = useMemo(() => {
    return datasetPlaces.filter((place) => {
      if (activeMode === "drinking") {
        return true;
      }

      if (selectedCategory !== "ALL" && place.category !== selectedCategory) {
        return false;
      }

      if (activeMode !== "cool") {
        return true;
      }

      if (filterAccessible && getAccessibilityStatus(place) !== "yes") {
        return false;
      }

      if (filterAc && !place.ac) {
        return false;
      }

      if (filterSeating && !place.sitting) {
        return false;
      }

      if (filterWifi && !place.wifi) {
        return false;
      }

      if (filterFree && !place.free) {
        return false;
      }

      if (filterSockets) {
        const hasSockets = place.amenities.some(a =>
          /socket|power|outlet|charge|steckdose|lade/i.test(a)
        ) || (place.notes && /socket|power|outlet|charge|steckdose|lade/i.test(place.notes));
        if (!hasSockets) return false;
      }

      if (filterTables) {
        const hasTables = place.amenities.some(a =>
          /table|desk|tisch|schreibtisch|arbeits/i.test(a)
        ) || (place.notes && /table|desk|tisch|schreibtisch|arbeits/i.test(place.notes));
        if (!hasTables) return false;
      }

      if (selectedDay !== "ALL" && !isPlaceOpenOnDay(place.hours, selectedDay)) {
        return false;
      }

      if (selectedHourRange !== "ALL" && !isPlaceOpenAtHourRange(place.hours, selectedHourRange)) {
        return false;
      }

      return true;
    });
  }, [datasetPlaces, activeMode, selectedCategory, filterAccessible, filterAc, filterSeating, filterWifi, filterFree, filterSockets, filterTables, selectedDay, selectedHourRange]);

  const visiblePlaces = useMemo(() => {
    if (!userLocation) return filteredPlaces;

    const withDistance = filteredPlaces.map((place) => ({
      ...place,
      distanceMeters: distanceMetersBetween(userLocation, { lat: place.lat, lng: place.lng }),
    }));

    if (!sortByNearest) return withDistance;

    return [...withDistance].sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
  }, [filteredPlaces, sortByNearest, userLocation]);

  const selectedPlace = useMemo(() => {
    if (!selectedPlaceId) return null;
    return visiblePlaces.find((p) => p.id === selectedPlaceId) || datasetPlaces.find((p) => p.id === selectedPlaceId) || null;
  }, [selectedPlaceId, visiblePlaces, datasetPlaces]);

  const handleSelectPlace = (id: string | null, fromMap = false) => {
    setSelectedPlaceId(id);
    if (id && !fromMap) {
      const element = document.getElementById(`place-item-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      if (window.innerWidth < 768) {
        const mapElement = document.getElementById("map-section");
        if (mapElement) {
          mapElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const locationMessage =
    locationStatus === "unsupported"
      ? t.locationUnsupported
      : locationStatus === "denied"
        ? t.locationDenied
        : userLocation && sortByNearest
          ? t.nearestActive
          : null;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-offwhite text-slate-brand overflow-x-hidden">
      <header className="sticky top-0 z-[1010] border-b border-white/40 bg-white/45 backdrop-blur-2xl shadow-[0_12px_40px_rgba(30,64,175,0.10)] supports-[backdrop-filter]:bg-white/35">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-[#2C3E50] tracking-tight leading-none m-0 flex items-center gap-1.5 select-none whitespace-nowrap flex-nowrap">
              <span>Make Vienna</span>
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-sky-600 drop-shadow-[0_1.5px_3px_rgba(56,189,248,0.4)] tracking-wide">
                Cool ❄️
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-1 bg-offwhite p-1 rounded-xl border border-slate-200/40 shrink-0">
            <button
              onClick={() => updateLanguage("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                lang === "en"
                  ? "bg-green-brand text-white shadow-sm"
                  : "text-slate-500 hover:text-[#2C3E50] hover:bg-white/50"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => updateLanguage("de")}
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

      <div className="bg-aqua py-6 sm:py-8 border-b border-slate-100">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center sm:text-left">
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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid w-full grid-cols-3 rounded-xl border border-slate-200/70 bg-white/70 p-1 shadow-sm backdrop-blur-xl sm:w-auto">
            {[
              { mode: "cool" as const, label: t.modeCool, shortLabel: t.modeCoolShort, icon: Snowflake },
              { mode: "drinking" as const, label: t.modeDrinking, shortLabel: t.modeDrinkingShort, icon: Droplets },
              { mode: "water" as const, label: t.modeWater, shortLabel: t.modeWaterShort, icon: Waves },
            ].map(({ mode, label, shortLabel, icon: Icon }) => {
              const selected = activeMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleModeChange(mode)}
                  className={`min-w-0 inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-bold transition-all sm:px-3 sm:text-xs ${
                    selected
                      ? "bg-green-brand text-white shadow-sm"
                      : "text-slate-500 hover:bg-white hover:text-slate-brand"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate sm:hidden">{shortLabel}</span>
                  <span className="hidden truncate sm:inline">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
            <button
              type="button"
              onClick={requestUserLocation}
              disabled={locationStatus === "requesting"}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-green-brand/40 hover:bg-white disabled:cursor-wait disabled:text-slate-400"
            >
              {locationStatus === "requesting" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LocateFixed className="h-4 w-4 text-green-brand" />
              )}
              {locationStatus === "requesting" ? t.locating : t.useMyLocation}
            </button>
            {locationMessage && (
              <span className="text-[11px] font-semibold text-slate-500 sm:text-right">
                {locationMessage}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-1">
            <PlaceList
              places={visiblePlaces}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={handleSelectPlace}
              lang={lang}
              activeMode={activeMode}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedDistrict={selectedDistrict}
              onDistrictChange={setSelectedDistrict}
              districts={districts}
              isLoading={isDatasetLoading}
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

            <div className="block lg:hidden">
              <PlaceDetailCard place={selectedPlace} lang={lang} />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-2">
            <div id="map-section" className="h-[350px] sm:h-[450px] md:h-[500px]">
              <ViennaMap
                places={visiblePlaces}
                selectedPlaceId={selectedPlaceId}
                onSelectPlace={handleSelectPlace}
                lang={lang}
                userLocation={userLocation}
              />
            </div>

            <div className="hidden lg:block">
              <PlaceDetailCard place={selectedPlace} lang={lang} />
            </div>
          </div>
        </div>
      </main>

      <footer className="h-12 bg-white border-t border-[#E2E8F0] flex items-center justify-center font-sans font-medium text-[11px] text-[#94A3B8] uppercase tracking-widest mt-16 shrink-0">
        {t.madeBy}
      </footer>

      {isPreferencesOpen && (
        <div className="fixed inset-0 z-[3200] flex items-end justify-center bg-slate-950/30 px-4 py-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="m-0 text-base font-bold text-slate-800">{preferencesT.preferencesTitle}</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{preferencesT.preferencesDescription}</p>
              </div>
              <button
                type="button"
                onClick={dismissPreferences}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label={preferencesT.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {preferencesT.languagePreference}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(["de", "en"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPreferencesLang(option)}
                      className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                        preferencesLang === option
                          ? "border-green-brand bg-mint text-dark-green"
                          : "border-slate-200 bg-offwhite text-slate-600 hover:bg-white"
                      }`}
                    >
                      {option.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-offwhite p-3">
                <input
                  type="checkbox"
                  checked={preferencesLocationEnabled}
                  onChange={(event) => setPreferencesLocationEnabled(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-green-brand focus:ring-green-brand/30"
                />
                <span>
                  <span className="block text-sm font-bold text-slate-700">{preferencesT.locationConsent}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                    {preferencesT.locationConsentDescription}
                  </span>
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={dismissPreferences}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-offwhite"
                >
                  {preferencesT.maybeLater}
                </button>
                <button
                  type="button"
                  onClick={savePreferences}
                  className="rounded-xl bg-green-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-green-brand/90"
                >
                  {preferencesT.savePreferences}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
