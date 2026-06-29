import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { CompactPlace } from "../data/vienna_cool_places";
import { TRANSLATIONS, translateCategory } from "../data/translations";
import { getPlaceType, googleMapsUrlForPlace, hasAccessWarning, isTemporarilyClosed, UserLocation } from "../data/place_utils";

interface ViennaMapProps {
  places: CompactPlace[];
  selectedPlaceId: string | null;
  onSelectPlace: (id: string | null, fromMap?: boolean) => void;
  lang: "en" | "de";
  userLocation?: UserLocation | null;
  isExpanded?: boolean;
}

type PlaceMarker = L.CircleMarker;

export const ViennaMap: React.FC<ViennaMapProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  lang,
  userLocation,
  isExpanded = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, PlaceMarker>>({});
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const selectedPlaceIdRef = useRef<string | null>(selectedPlaceId);
  const canvasRendererRef = useRef<L.Canvas | null>(null);
  const placesRef = useRef<CompactPlace[]>(places);
  const placeIdsSignature = places.map((place) => place.id).join("|");

  // Keep places ref updated so callbacks can read current places
  useEffect(() => {
    placesRef.current = places;
  }, [places]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const timeout = window.setTimeout(() => {
      map.invalidateSize();
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [isExpanded]);

  // Initial map setup
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map centered on Vienna
    const map = L.map(mapContainerRef.current, {
      center: [48.2082, 16.3738],
      zoom: 12,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: true,
      preferCanvas: true,
    });

    mapRef.current = map;
    canvasRendererRef.current = L.canvas({ padding: 0.5, tolerance: 18 });

    // Add clean Light OpenStreetMap tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    // Leaflet map cleanup on unmount
    return () => {
      if (mapRef.current) {
        if (userMarkerRef.current) {
          mapRef.current.removeLayer(userMarkerRef.current);
          userMarkerRef.current = null;
        }
        mapRef.current.remove();
        mapRef.current = null;
        canvasRendererRef.current = null;
      }
    };
  }, []);

  // Sync markers only when the visible point set or popup language changes.
  // Selection styling is handled separately so selecting one item does not
  // rebuild hundreds of markers.
  useEffect(() => {
    updateMarkers(places, selectedPlaceId);
  }, [placeIdsSignature, lang]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (!userLocation) return;

    userMarkerRef.current = L.circleMarker([userLocation.lat, userLocation.lng], {
      renderer: canvasRendererRef.current ?? undefined,
      radius: 8,
      color: "#0F766E",
      weight: 2,
      fillColor: "#14B8A6",
      fillOpacity: 0.85,
      interactive: false,
      bubblingMouseEvents: false,
    }).addTo(map);

    map.flyTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 15), {
      animate: true,
      duration: 0.8,
    });
  }, [userLocation]);

  // Handle selected place animation/popup without rebuilding every marker.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const previousId = selectedPlaceIdRef.current;
    if (previousId && previousId !== selectedPlaceId) {
      const previousMarker = markersRef.current[previousId];
      const previousPlace = placesRef.current.find((p) => p.id === previousId);
      if (previousMarker && previousPlace) {
        setMarkerSelection(previousMarker, previousPlace, false);
      }
    }

    selectedPlaceIdRef.current = selectedPlaceId;

    if (!selectedPlaceId) {
      map.closePopup();
      return;
    }

    const marker = markersRef.current[selectedPlaceId];
    const place = placesRef.current.find((p) => p.id === selectedPlaceId);

    if (!marker || !place) return;

    setMarkerSelection(marker, place, true);

    if (typeof marker.bringToFront === "function") {
      marker.bringToFront();
    }

    // Center precisely on the pin, Leaflet's autoPan will adjust to fit the popup
    map.setView([place.lat, place.lng], 15, {
      animate: true,
      duration: 0.8,
    });

    marker.bindPopup(createPopupHtml(place), getPopupOptions()).openPopup();
  }, [selectedPlaceId, lang]);

  const getMarkerColor = (isSelected: boolean, place: CompactPlace) => {
    if (isTemporarilyClosed(place)) return isSelected ? "#B91C1C" : "#DC2626";
    if (hasAccessWarning(place)) return isSelected ? "#D97706" : "#F59E0B";

    const nonOfficialCoolColor = "#4C1D95";
    let pinColor = nonOfficialCoolColor;
    const placeType = getPlaceType(place);

    if (isSelected && placeType === "cool") {
      pinColor = place.category === "Official Cool Zone" ? "#1D4ED8" : nonOfficialCoolColor;
    } else if (placeType === "drinking") {
      pinColor = "#0EA5E9";
    } else if (placeType === "water") {
      pinColor = "#06B6D4";
    } else if (placeType === "toilet") {
      pinColor = "#7C3AED";
    } else if (place.category === "Official Cool Zone") {
      pinColor = "#2980B9";
    }

    if (isSelected && placeType !== "cool") {
      pinColor =
        placeType === "water"
          ? "#0891B2"
          : placeType === "drinking"
            ? "#0284C7"
            : placeType === "toilet"
              ? "#6D28D9"
              : "#3498DB";
    }

    return pinColor;
  };

  const getCircleMarkerOptions = (place: CompactPlace, isSelected: boolean): L.CircleMarkerOptions => ({
    renderer: canvasRendererRef.current ?? undefined,
    radius: isSelected ? 10 : 7,
    color: "#ffffff",
    weight: isSelected ? 3 : 2,
    opacity: 1,
    fillColor: getMarkerColor(isSelected, place),
    fillOpacity: isSelected ? 0.96 : 0.88,
    bubblingMouseEvents: false,
    interactive: true,
  });

  const setMarkerSelection = (marker: PlaceMarker, place: CompactPlace, isSelected: boolean) => {
    marker.setStyle(getCircleMarkerOptions(place, isSelected));
  };

  const createPlaceMarker = (place: CompactPlace, isSelected: boolean): PlaceMarker => {
    return L.circleMarker([place.lat, place.lng], getCircleMarkerOptions(place, isSelected));
  };

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const getPopupOptions = (): L.PopupOptions => ({
    closeButton: true,
    offset: [0, -5],
    className: "custom-leaflet-popup",
    autoPan: true,
    autoPanPadding: [20, 20],
  });

  const createPopupHtml = (place: CompactPlace) => {
    const t = TRANSLATIONS[lang];
    const placeType = getPlaceType(place);
    const typeLabel =
      placeType === "drinking"
        ? t.modeDrinking
        : placeType === "water"
          ? t.modeWater
          : placeType === "toilet"
            ? t.modeToilets
          : place.ac
            ? t.acFilterLabel
            : place.coolingType === "official_cool_indoor_room_not_ac_confirmed"
              ? t.acOfficialZone
              : t.acCoolRoom;
    const typeBadgeColor =
      placeType === "drinking"
        ? "bg-[#E0F2FE] text-[#075985]"
        : placeType === "water"
          ? "bg-[#CFFAFE] text-[#155E75]"
          : placeType === "toilet"
            ? "bg-[#EDE9FE] text-[#4C1D95]"
          : place.ac
            ? "bg-[#3498DB] text-white"
            : "bg-[#D4E6F1] text-[#1F618D]";
    const primaryLabel = `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${typeBadgeColor}">${escapeHtml(typeLabel)}</span>`;
    const statusLabel = isTemporarilyClosed(place)
      ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FEE2E2] text-[#991B1B]">${escapeHtml(t.temporarilyClosed)}</span>`
      : hasAccessWarning(place)
        ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#92400E]">${escapeHtml(t.accessWarning)}</span>`
        : "";
    const categoryLabel = escapeHtml(translateCategory(place.category, lang));
    const mapsUrl = googleMapsUrlForPlace(place);

    return `
      <div class="p-1 max-w-[240px] font-sans">
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <h3 class="font-bold text-base text-[#2C3E50] leading-snug m-0">${escapeHtml(place.name)}</h3>
        </div>
        <div class="flex flex-wrap gap-1 mb-2">
          ${statusLabel}
          ${primaryLabel}
          ${placeType !== "cool" || place.category !== "Official Cool Zone" ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EBF5FB] text-[#1F618D]">${categoryLabel}</span>` : ""}
        </div>
        <p class="text-xs text-[#718096] mb-2 leading-relaxed font-normal">${escapeHtml(place.address)}</p>
        ${isTemporarilyClosed(place) ? `<p class="text-[11px] text-[#991B1B] mb-2 leading-relaxed font-semibold">${escapeHtml(t.temporarilyClosedNote)}</p>` : ""}
        ${hasAccessWarning(place) ? `<p class="text-[11px] text-[#92400E] mb-2 leading-relaxed font-semibold">${escapeHtml(t.accessWarningNote)}</p>` : ""}
        ${place.hours.length > 0 ? `<p class="text-[11px] text-slate-500 font-semibold m-0 flex items-center gap-1">${escapeHtml(place.hours[0])}</p>` : ""}
        <div class="mt-2.5 pt-2 border-t border-[#F0F4F8]">
          <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="color: #3498DB; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 2px; font-size: 12px;">
            ${t.openInGoogleMaps} &rarr;
          </a>
        </div>
      </div>
    `;
  };

  const updateMarkers = (currentPlaces: CompactPlace[], activeId: string | null) => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((marker) => {
      map.removeLayer(marker);
    });
    markersRef.current = {};
    selectedPlaceIdRef.current = activeId;

    // Add new markers
    currentPlaces.forEach((place) => {
      const isSelected = place.id === activeId;
      const marker = createPlaceMarker(place, isSelected).addTo(map);

      // Marker click handler
      marker.on("click", () => {
        marker.bindPopup(createPopupHtml(place), getPopupOptions()).openPopup();
        onSelectPlace(place.id, true);
      });

      // Store reference
      markersRef.current[place.id] = marker;
    });

    // Fit map bounds if places are loaded and map has no active selection
    if (currentPlaces.length > 0 && !activeId) {
      const bounds = L.latLngBounds(currentPlaces.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  return (
    <div className={`relative h-full w-full overflow-hidden shadow-sm border border-slate-100 ${
      isExpanded ? "rounded-none" : "rounded-2xl"
    }`}>
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};
