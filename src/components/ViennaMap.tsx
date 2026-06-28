import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { CompactPlace } from "../data/vienna_cool_places";
import { TRANSLATIONS, translateCategory } from "../data/translations";
import { getPlaceType, googleMapsUrlForPlace, UserLocation } from "../data/place_utils";

interface ViennaMapProps {
  places: CompactPlace[];
  selectedPlaceId: string | null;
  onSelectPlace: (id: string | null, fromMap?: boolean) => void;
  lang: "en" | "de";
  userLocation?: UserLocation | null;
}

type PlaceMarker = L.Marker | L.CircleMarker;

const DENSE_MARKER_THRESHOLD = 250;

export const ViennaMap: React.FC<ViennaMapProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  lang,
  userLocation,
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
    canvasRendererRef.current = L.canvas({ padding: 0.5 });

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
      radius: 8,
      color: "#0F766E",
      weight: 2,
      fillColor: "#14B8A6",
      fillOpacity: 0.85,
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
    let pinColor = "#94A3B8";
    const placeType = getPlaceType(place);

    if (placeType === "drinking") {
      pinColor = "#0EA5E9";
    } else if (placeType === "water") {
      pinColor = "#06B6D4";
    } else if (isSelected) {
      pinColor = "#3498DB";
    } else if (place.category === "Official Cool Zone") {
      pinColor = "#2980B9";
    }

    if (isSelected) {
      pinColor = placeType === "water" ? "#0891B2" : placeType === "drinking" ? "#0284C7" : "#3498DB";
    }

    return pinColor;
  };

  const getCircleMarkerOptions = (place: CompactPlace, isSelected: boolean): L.CircleMarkerOptions => ({
    renderer: canvasRendererRef.current ?? undefined,
    radius: isSelected ? 8 : 5,
    color: "#ffffff",
    weight: isSelected ? 3 : 1.5,
    opacity: 1,
    fillColor: getMarkerColor(isSelected, place),
    fillOpacity: isSelected ? 0.95 : 0.85,
    bubblingMouseEvents: false,
  });

  const setMarkerSelection = (marker: PlaceMarker, place: CompactPlace, isSelected: boolean) => {
    if (marker instanceof L.Marker) {
      marker.setIcon(createCustomIcon(isSelected, place));
      return;
    }

    marker.setStyle(getCircleMarkerOptions(place, isSelected));
  };

  const createPlaceMarker = (place: CompactPlace, isSelected: boolean, useDenseMarkers: boolean): PlaceMarker => {
    if (useDenseMarkers) {
      return L.circleMarker([place.lat, place.lng], getCircleMarkerOptions(place, isSelected));
    }

    return L.marker([place.lat, place.lng], {
      icon: createCustomIcon(isSelected, place),
    });
  };

  // Function to create marker SVG dynamically
  const createCustomIcon = (isSelected: boolean, place: CompactPlace) => {
    // Clean Minimalism blue tones:
    // Selected is #3498DB (electric blue)
    // Non-selected Official Cool Zone is #2980B9 (strong blue)
    // Non-selected other spots are #94A3B8 (slate)
    const pinColor = getMarkerColor(isSelected, place);
    const size = isSelected ? 36 : 28;
    const svgHtml = `
      <div class="relative flex items-center justify-center">
        ${isSelected ? `<span class="absolute inline-flex h-full w-full rounded-full bg-[#3498DB] opacity-30 animate-pulse"></span>` : ""}
        <svg width="${size}" height="${size + 8}" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-sm">
          <path d="M12 2C7.58172 2 4 5.58172 4 10C4 15.25 12 28 12 28C12 28 20 15.25 20 10C20 5.58172 16.4183 2 12 2Z" fill="${pinColor}" stroke="#ffffff" stroke-width="2"/>
          <circle cx="12" cy="10" r="4" fill="#ffffff" />
        </svg>
      </div>
    `;

    return L.divIcon({
      html: svgHtml,
      className: "custom-div-icon",
      iconSize: [size, size + 8],
      iconAnchor: [size / 2, size + 8],
      popupAnchor: [0, -size],
    });
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
          : place.ac
            ? "bg-[#3498DB] text-white"
            : "bg-[#D4E6F1] text-[#1F618D]";
    const primaryLabel = `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${typeBadgeColor}">${escapeHtml(typeLabel)}</span>`;
    const categoryLabel = escapeHtml(translateCategory(place.category, lang));
    const mapsUrl = googleMapsUrlForPlace(place);

    return `
      <div class="p-1 max-w-[240px] font-sans">
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <h3 class="font-bold text-base text-[#2C3E50] leading-snug m-0">${escapeHtml(place.name)}</h3>
        </div>
        <div class="flex flex-wrap gap-1 mb-2">
          ${primaryLabel}
          ${placeType !== "cool" || place.category !== "Official Cool Zone" ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EBF5FB] text-[#1F618D]">${categoryLabel}</span>` : ""}
        </div>
        <p class="text-xs text-[#718096] mb-2 leading-relaxed font-normal">${escapeHtml(place.address)}</p>
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
    const useDenseMarkers = currentPlaces.length > DENSE_MARKER_THRESHOLD;

    // Remove existing markers
    Object.values(markersRef.current).forEach((marker) => {
      map.removeLayer(marker);
    });
    markersRef.current = {};
    selectedPlaceIdRef.current = activeId;

    // Add new markers
    currentPlaces.forEach((place) => {
      const isSelected = place.id === activeId;
      const marker = createPlaceMarker(place, isSelected, useDenseMarkers).addTo(map);

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
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm border border-slate-100">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-10" id="map-leaflet" />
    </div>
  );
};
