import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { CompactPlace } from "../data/vienna_cool_places";
import { TRANSLATIONS, translateCategory } from "../data/translations";

interface ViennaMapProps {
  places: CompactPlace[];
  selectedPlaceId: string | null;
  onSelectPlace: (id: string | null, fromMap?: boolean) => void;
  lang: "en" | "de";
}

export const ViennaMap: React.FC<ViennaMapProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  lang,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const placesRef = useRef<CompactPlace[]>(places);

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
    });

    mapRef.current = map;

    // Add clean Light OpenStreetMap tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    // Initial load markers
    updateMarkers(places, selectedPlaceId);

    // Leaflet map cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync markers when places or selection changes
  useEffect(() => {
    updateMarkers(places, selectedPlaceId);
  }, [places, selectedPlaceId, lang]);

  // Handle selected place animation/popup
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlaceId) return;

    const marker = markersRef.current[selectedPlaceId];
    const place = places.find((p) => p.id === selectedPlaceId);

    if (marker && place) {
      // Center precisely on the pin, Leaflet's autoPan will adjust to fit the popup
      map.setView([place.lat, place.lng], 15, {
        animate: true,
        duration: 0.8,
      });

      // Open popup
      marker.openPopup();
    }
  }, [selectedPlaceId, places]);

  // Function to create marker SVG dynamically
  const createCustomIcon = (isSelected: boolean, category: string) => {
    // Clean Minimalism blue tones:
    // Selected is #3498DB (electric blue)
    // Non-selected Official Cool Zone is #2980B9 (strong blue)
    // Non-selected other spots are #94A3B8 (slate)
    let pinColor = "#94A3B8";
    if (isSelected) {
      pinColor = "#3498DB";
    } else if (category === "Official Cool Zone") {
      pinColor = "#2980B9";
    }

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

  const updateMarkers = (currentPlaces: CompactPlace[], activeId: string | null) => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((marker) => {
      map.removeLayer(marker);
    });
    markersRef.current = {};

    // Add new markers
    currentPlaces.forEach((place) => {
      const isSelected = place.id === activeId;
      const icon = createCustomIcon(isSelected, place.category);

      const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);

      // Create a nice styled popup content
      const t = TRANSLATIONS[lang];
      const acLabel = place.ac
        ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#3498DB] text-white">${t.acFilterLabel}</span>`
        : `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#D4E6F1] text-[#1F618D]">${place.coolingType === "official_cool_indoor_room_not_ac_confirmed" ? t.acOfficialZone : t.acCoolRoom}</span>`;
      const categoryLabel = translateCategory(place.category, lang);

      const popupHtml = `
        <div class="p-1 max-w-[240px] font-sans">
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <h3 class="font-bold text-base text-[#2C3E50] leading-snug m-0">${place.name}</h3>
          </div>
          <div class="flex flex-wrap gap-1 mb-2">
            ${acLabel}
            ${place.category !== "Official Cool Zone" ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EBF5FB] text-[#1F618D]">${categoryLabel}</span>` : ""}
          </div>
          <p class="text-xs text-[#718096] mb-2 leading-relaxed font-normal">${place.address}</p>
          ${place.hours.length > 0 ? `<p class="text-[11px] text-slate-500 font-semibold m-0 flex items-center gap-1">⏰ ${place.hours[0]}</p>` : ""}
          <div class="mt-2.5 pt-2 border-t border-[#F0F4F8]">
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ", " + place.address)}" target="_blank" rel="noopener noreferrer" style="color: #3498DB; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 2px; font-size: 12px;">
              ${t.openInGoogleMaps} &rarr;
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        offset: [0, -5],
        className: "custom-leaflet-popup",
        autoPan: true,
        autoPanPadding: [20, 20],
      });

      // Marker click handler
      marker.on("click", () => {
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
