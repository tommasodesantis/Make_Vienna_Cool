import React, { useMemo, useState } from "react";
import { CompactPlace, PlaceType } from "../data/vienna_cool_places";
import { TRANSLATIONS, translateCategory } from "../data/translations";
import { ChevronDown, ChevronUp, Droplets, HelpCircle, Loader2 } from "lucide-react";
import { formatDistance, getAccessibilityStatus, hasAccessWarning, isTemporarilyClosed } from "../data/place_utils";

interface PlaceListProps {
  places: CompactPlace[];
  selectedPlaceId: string | null;
  onSelectPlace: (id: string | null, fromMap?: boolean) => void;
  lang: "en" | "de";
  activeMode: PlaceType;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  selectedDistrict: string;
  onDistrictChange: (val: string) => void;
  districts: string[];
  isLoading: boolean;
  filterAc: boolean;
  onFilterAcChange: (val: boolean) => void;
  filterSeating: boolean;
  onFilterSeatingChange: (val: boolean) => void;
  filterWifi: boolean;
  onFilterWifiChange: (val: boolean) => void;
  filterFree: boolean;
  onFilterFreeChange: (val: boolean) => void;
  filterSockets: boolean;
  onFilterSocketsChange: (val: boolean) => void;
  filterTables: boolean;
  onFilterTablesChange: (val: boolean) => void;
  filterAccessible: boolean;
  onFilterAccessibleChange: (val: boolean) => void;
  filterOpenNow: boolean;
  onFilterOpenNowChange: (val: boolean) => void;
  selectedDay: string;
  onSelectedDayChange: (val: string) => void;
  selectedHourRange: string;
  onSelectedHourRangeChange: (val: string) => void;
  categories: string[];
  mode?: "full" | "filters" | "list";
}

export const PlaceList: React.FC<PlaceListProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  lang,
  activeMode,
  selectedCategory,
  onCategoryChange,
  selectedDistrict,
  onDistrictChange,
  districts,
  isLoading,
  filterAc,
  onFilterAcChange,
  filterSeating,
  onFilterSeatingChange,
  filterWifi,
  onFilterWifiChange,
  filterFree,
  onFilterFreeChange,
  filterSockets,
  onFilterSocketsChange,
  filterTables,
  onFilterTablesChange,
  filterAccessible,
  onFilterAccessibleChange,
  filterOpenNow,
  onFilterOpenNowChange,
  selectedDay,
  onSelectedDayChange,
  selectedHourRange,
  onSelectedHourRangeChange,
  categories,
  mode = "full",
}) => {
  const t = TRANSLATIONS[lang];
  const isCoolMode = activeMode === "cool";
  const isToiletMode = activeMode === "toilet";
  const showCategoryFilter = !isToiletMode;
  const hasFilterControls = activeMode !== "drinking";
  const showFilterSection = mode !== "list" && hasFilterControls;
  const showResultsSection = mode !== "filters";
  const filterTitle =
    activeMode === "drinking"
      ? t.filterDrinkingWater
      : activeMode === "water"
        ? t.filterWaterAccess
        : activeMode === "toilet"
          ? t.filterPublicToilets
          : t.filterCoolPlaces;

  const [showAcTooltip, setShowAcTooltip] = useState(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 1024
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (showCategoryFilter && selectedCategory !== "ALL") count++;

    if (isCoolMode) {
      if (filterAccessible) count++;
      if (filterAc) count++;
      if (filterSeating) count++;
      if (filterWifi) count++;
      if (filterFree) count++;
      if (filterSockets) count++;
      if (filterTables) count++;
      if (filterOpenNow) count++;
      if (selectedDay !== "ALL") count++;
      if (selectedHourRange !== "ALL") count++;
    }

    if (isToiletMode) {
      if (filterAccessible) count++;
      if (filterFree) count++;
    }

    return count;
  }, [
    selectedCategory,
    isCoolMode,
    isToiletMode,
    showCategoryFilter,
    filterAccessible,
    filterAc,
    filterSeating,
    filterWifi,
    filterFree,
    filterSockets,
    filterTables,
    filterOpenNow,
    selectedDay,
    selectedHourRange,
  ]);

  const clearFilters = () => {
    onCategoryChange("ALL");
    onDistrictChange("ALL");
    onFilterAcChange(false);
    onFilterSeatingChange(false);
    onFilterWifiChange(false);
    onFilterFreeChange(false);
    onFilterSocketsChange(false);
    onFilterTablesChange(false);
    onFilterAccessibleChange(false);
    onFilterOpenNowChange(false);
    onSelectedDayChange("ALL");
    onSelectedHourRangeChange("ALL");
  };

  if (mode === "filters" && !hasFilterControls) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm animate-fade-in relative z-20">
      {showFilterSection && (
        <button
          onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
          className={`flex items-center justify-between w-full p-4 bg-offwhite text-left hover:bg-slate-50 transition-colors cursor-pointer select-none rounded-t-2xl ${
            isFiltersCollapsed || !showResultsSection ? "rounded-b-2xl" : "border-b border-slate-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 text-sm">
              {filterTitle}
            </span>
            {activeFiltersCount > 0 && (
              <span className="bg-green-brand text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
            <span>{isFiltersCollapsed ? t.showFilters : t.hideFilters}</span>
            {isFiltersCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>
      )}

      {showFilterSection && (
      <div className={`${isFiltersCollapsed ? "hidden" : "flex"} flex-col gap-3 p-4 bg-offwhite ${showResultsSection ? "border-b border-slate-100" : "rounded-b-2xl"}`}>
        {showCategoryFilter && (
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {t.category}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full py-1.5 px-2 bg-white border border-slate-200 focus:border-green-brand focus:ring-1 focus:ring-mint rounded-lg text-xs text-slate-700 outline-none transition-all cursor-pointer font-medium"
              >
                <option value="ALL">{t.allCategories}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {translateCategory(cat, lang)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {isCoolMode && (
          <div className="flex flex-col gap-2 border-t border-slate-200/40 pt-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t.filterByFeatures}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative flex items-center justify-between px-2 py-1.5 bg-white border border-slate-200/60 hover:border-green-brand/40 rounded-lg transition-colors">
                <label className="flex items-center gap-2 cursor-pointer select-none flex-1">
                  <input
                    type="checkbox"
                    checked={filterAc}
                    onChange={(e) => onFilterAcChange(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-green-brand border-slate-300 focus:ring-green-brand/30"
                  />
                  <span className="text-xs font-semibold text-slate-700">{t.acFilterLabel}</span>
                </label>

                <div className="relative group flex items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowAcTooltip(!showAcTooltip);
                    }}
                    className="text-slate-400 hover:text-green-brand p-0.5 focus:outline-none cursor-pointer"
                    title="Info"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                  <div className={`fixed left-4 right-4 top-36 max-h-[calc(100vh-10rem)] overflow-y-auto sm:absolute sm:left-1/2 sm:right-auto sm:top-full sm:mt-2 sm:w-72 sm:max-h-none sm:overflow-visible sm:-translate-x-1/2 bg-slate-800 text-white text-[11.5px] leading-relaxed p-3.5 rounded-lg shadow-xl z-[3000] transition-all duration-200 ${
                    showAcTooltip ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible sm:group-hover:opacity-100 sm:group-hover:scale-100 sm:group-hover:visible"
                  }`}>
                    <div className="font-bold mb-1.5 border-b border-slate-700 pb-1 text-xs text-[#2ECC71]">
                      {t.acTooltipTitle}
                    </div>
                    <p className="mb-2 text-slate-200">
                      {t.acTooltipBody}
                    </p>
                    <a
                      href="https://www.wien.gv.at/umwelt/coole-zonen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:underline font-bold inline-flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      wien.gv.at/umwelt/coole-zonen
                    </a>
                    <div className="hidden sm:block absolute top-0 right-[46px] sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-2.5 h-2.5 bg-slate-800 transform rotate-45 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 px-2 py-1.5 bg-white border border-slate-200/60 hover:border-green-brand/40 rounded-lg cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={filterSeating}
                  onChange={(e) => onFilterSeatingChange(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-green-brand border-slate-300 focus:ring-green-brand/30"
                />
                <span className="text-xs font-semibold text-slate-700">{t.seating}</span>
              </label>

              <label className="flex items-center gap-2 px-2 py-1.5 bg-white border border-slate-200/60 hover:border-green-brand/40 rounded-lg cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={filterWifi}
                  onChange={(e) => onFilterWifiChange(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-green-brand border-slate-300 focus:ring-green-brand/30"
                />
                <span className="text-xs font-semibold text-slate-700">Wi-Fi</span>
              </label>

              <label className="flex items-center gap-2 px-2 py-1.5 bg-white border border-slate-200/60 hover:border-green-brand/40 rounded-lg cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={filterTables}
                  onChange={(e) => onFilterTablesChange(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-green-brand border-slate-300 focus:ring-green-brand/30"
                />
                <span className="text-xs font-semibold text-slate-700 truncate">{t.tablesDesks}</span>
              </label>

              <label className="flex items-center gap-2 px-2 py-1.5 bg-white border border-slate-200/60 hover:border-green-brand/40 rounded-lg cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={filterSockets}
                  onChange={(e) => onFilterSocketsChange(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-green-brand border-slate-300 focus:ring-green-brand/30"
                />
                <span className="text-xs font-semibold text-slate-700">{t.sockets}</span>
              </label>

              <label className="flex items-center gap-2 px-2 py-1.5 bg-white border border-slate-200/60 hover:border-green-brand/40 rounded-lg cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={filterAccessible}
                  onChange={(e) => onFilterAccessibleChange(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-green-brand border-slate-300 focus:ring-green-brand/30"
                />
                <span className="text-xs font-semibold text-slate-700">{t.accessible}</span>
              </label>

              <label className="flex items-center gap-2 px-2 py-1.5 bg-white border border-slate-200/60 hover:border-green-brand/40 rounded-lg cursor-pointer select-none transition-colors col-span-2">
                <input
                  type="checkbox"
                  checked={filterFree}
                  onChange={(e) => onFilterFreeChange(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-green-brand border-slate-300 focus:ring-green-brand/30"
                />
                <span className="text-xs font-semibold text-slate-700 truncate">{t.freeEntry}</span>
              </label>
            </div>
          </div>
        )}

        {isToiletMode && (
          <div className="grid grid-cols-2 gap-2 border-t border-slate-200/40 pt-2.5">
            <label className="flex items-center gap-2 px-2 py-1.5 bg-white border border-slate-200/60 hover:border-green-brand/40 rounded-lg cursor-pointer select-none transition-colors">
              <input
                type="checkbox"
                checked={filterAccessible}
                onChange={(e) => onFilterAccessibleChange(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-green-brand border-slate-300 focus:ring-green-brand/30"
              />
              <span className="text-xs font-semibold text-slate-700">{t.accessible}</span>
            </label>

            <label className="flex items-center gap-2 px-2 py-1.5 bg-white border border-slate-200/60 hover:border-green-brand/40 rounded-lg cursor-pointer select-none transition-colors">
              <input
                type="checkbox"
                checked={filterFree}
                onChange={(e) => onFilterFreeChange(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-green-brand border-slate-300 focus:ring-green-brand/30"
              />
              <span className="text-xs font-semibold text-slate-700">{t.freeAccess}</span>
            </label>
          </div>
        )}

        {isCoolMode && (
          <div className="flex flex-col gap-2 border-t border-slate-200/40 pt-2.5">
            <label className="flex items-center justify-between gap-3 rounded-xl border border-green-brand/30 bg-mint px-3 py-2.5 cursor-pointer select-none transition-colors hover:border-green-brand/60">
              <span className="text-sm font-black text-dark-green">{t.openNow}</span>
              <input
                type="checkbox"
                checked={filterOpenNow}
                onChange={(e) => onFilterOpenNowChange(e.target.checked)}
                className="h-4 w-4 shrink-0 rounded border-green-brand/40 text-green-brand focus:ring-green-brand/30"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {t.openingDay}
              </label>
              <select
                value={selectedDay}
                onChange={(e) => onSelectedDayChange(e.target.value)}
                className="w-full py-1.5 px-2 bg-white border border-slate-200 focus:border-green-brand focus:ring-1 focus:ring-mint rounded-lg text-xs text-slate-700 outline-none transition-all cursor-pointer"
              >
                <option value="ALL">{t.anyDay}</option>
                <option value="Mon">{t.monday}</option>
                <option value="Tue">{t.tuesday}</option>
                <option value="Wed">{t.wednesday}</option>
                <option value="Thu">{t.thursday}</option>
                <option value="Fri">{t.friday}</option>
                <option value="Sat">{t.saturday}</option>
                <option value="Sun">{t.sunday}</option>
              </select>
              </div>

              <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {t.openingHour}
              </label>
              <select
                value={selectedHourRange}
                onChange={(e) => onSelectedHourRangeChange(e.target.value)}
                className="w-full py-1.5 px-2 bg-white border border-slate-200 focus:border-green-brand focus:ring-1 focus:ring-mint rounded-lg text-xs text-slate-700 outline-none transition-all cursor-pointer"
              >
                <option value="ALL">{t.anyTime}</option>
                <option value="morning">{t.morning}</option>
                <option value="afternoon">{t.afternoon}</option>
                <option value="evening">{t.evening}</option>
              </select>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {showResultsSection && (
      <>
      <div className="px-4 py-2 bg-offwhite border-b border-slate-100 flex justify-between items-center text-xs text-slate-500 font-medium">
        <span>{t.places}</span>
        <span className="bg-mint text-dark-green px-2.5 py-0.5 rounded-full font-bold text-[11px]">
          {places.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[380px] md:max-h-[500px] rounded-b-2xl">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-aqua rounded-full flex items-center justify-center text-green-brand mx-auto mb-3">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-[#2C3E50] text-sm font-bold mb-1">{t.datasetLoading}</p>
          </div>
        ) : places.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-aqua rounded-full flex items-center justify-center text-green-brand mx-auto mb-3">
              <Droplets className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-[#2C3E50] text-sm font-bold mb-1">
              {isCoolMode ? t.noPlacesFound : t.noLocationsFound}
            </p>
            <p className="text-slate-400 text-xs mb-4">
              {t.tryAdjustingFilters}
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-green-brand hover:bg-green-brand/90 rounded-lg transition-colors cursor-pointer animate-pulse"
            >
              {t.clearFilters}
            </button>
          </div>
        ) : (
          places.map((place) => {
            const isSelected = place.id === selectedPlaceId;
            const acLabel = place.ac
              ? t.acFilterLabel
              : (place.coolingType === "official_cool_indoor_room_not_ac_confirmed" ? t.acOfficialZone : t.acCoolRoom);
            const showCoolBadge = isCoolMode && place.category !== "Official Cool Zone";
            const accessibility = getAccessibilityStatus(place);
            const accessWarning = hasAccessWarning(place);
            const metadataItems: React.ReactNode[] = [];

            if (isCoolMode) {
              metadataItems.push(
                <span className="text-dark-green font-bold">{translateCategory(place.category, lang)}</span>
              );
              metadataItems.push(
                <span className={place.free ? "text-[#2ECC71] font-bold" : "text-amber-600 font-bold"}>
                  {place.free ? t.freeEntry : t.paid}
                </span>
              );

              if (accessibility !== "unknown") {
                metadataItems.push(
                  <span>
                    {accessibility === "yes" ? t.accessibilityYes : accessibility === "limited" ? t.accessibilityLimited : t.accessibilityNo}
                  </span>
                );
              }
            }

            if (isToiletMode) {
              metadataItems.push(
                <span className={place.free ? "text-[#2ECC71] font-bold" : "text-amber-600 font-bold"}>
                  {place.free ? t.freeAccess : t.paid}
                </span>
              );

              if (accessibility !== "unknown") {
                metadataItems.push(
                  <span>
                    {accessibility === "yes" ? t.accessibilityYes : accessibility === "limited" ? t.accessibilityLimited : t.accessibilityNo}
                  </span>
                );
              }
            }

            if (typeof place.distanceMeters === "number") {
              metadataItems.push(
                <span className="text-sky-700 font-bold">{formatDistance(place.distanceMeters, lang)}</span>
              );
            }

            return (
              <div
                key={place.id}
                id={`place-item-${place.id}`}
                onClick={() => onSelectPlace(place.id)}
                className={`p-4 flex flex-col gap-1 cursor-pointer transition-all duration-200 text-left ${
                  isSelected
                    ? "bg-mint/60 border-l-4 border-l-green-brand pl-3"
                    : "hover:bg-aqua border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-[#2C3E50] text-sm leading-snug break-words flex-1">
                    {place.name}
                  </h4>
                  {isTemporarilyClosed(place) ? (
                    <span className="inline-flex items-center shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
                      {t.temporarilyClosed}
                    </span>
                  ) : accessWarning ? (
                    <span className="inline-flex items-center shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                      {t.accessWarning}
                    </span>
                  ) : showCoolBadge ? (
                    <span className={`inline-flex items-center shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      place.ac
                        ? "bg-green-brand text-white"
                        : "bg-mint text-dark-green"
                    }`}>
                      {acLabel}
                    </span>
                  ) : !isCoolMode ? (
                    <span className="inline-flex items-center shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-aqua text-dark-green">
                      {translateCategory(place.category, lang)}
                    </span>
                  ) : null}
                </div>

                {metadataItems.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-slate-400 font-medium">
                    {metadataItems.map((item, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <span>•</span>}
                        {item}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      </>
      )}
    </div>
  );
};
