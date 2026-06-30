import type { AccessibilityStatus, CompactPlace, PlaceType } from "./vienna_cool_places";

export interface UserLocation {
  lat: number;
  lng: number;
}

export const getPlaceType = (place: CompactPlace): PlaceType => place.placeType ?? "cool";

export const isTemporarilyClosed = (place: CompactPlace): boolean =>
  place.status === "temporarily_closed";

export const hasAccessWarning = (place: CompactPlace): boolean =>
  place.status === "access_warning";

export const getLocalizedText = (
  value: CompactPlace["statusNote"],
  lang: "en" | "de",
): string | null => {
  if (!value) return null;
  if (typeof value === "string") return value;

  return value[lang] ?? value.en ?? value.de ?? null;
};

export const getStatusNote = (
  place: CompactPlace,
  lang: "en" | "de",
  fallback: string,
): string => getLocalizedText(place.statusNote, lang) ?? fallback;

export const getAccessibilityStatus = (place: CompactPlace): AccessibilityStatus => {
  if (place.accessibility) return place.accessibility;

  const text = `${place.amenities.join(" ")} ${place.notes ?? ""}`.toLowerCase();
  if (/limited wheelchair|eingeschränkt|limited access/.test(text)) return "limited";
  if (/wheelchair accessible|barrier[- ]?free|barrierefrei/.test(text)) return "yes";
  if (/wheelchair\s*=\s*no|not wheelchair|wheelchair no/.test(text)) return "no";

  return "unknown";
};

export const isCoordinateAddress = (address: string): boolean =>
  /^-?\d{1,2}\.\d{3,},\s*-?\d{1,3}\.\d{3,}$/.test(address);

export const googleMapsUrlForPlace = (place: CompactPlace): string => {
  if (getPlaceType(place) === "cool" && !isCoordinateAddress(place.address)) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${place.name}, ${place.address}`,
    )}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${place.lat},${place.lng}`,
  )}`;
};

export const distanceMetersBetween = (from: UserLocation, to: UserLocation): number => {
  const earthRadiusMeters = 6371000;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const formatDistance = (distanceMeters: number, lang: "en" | "de"): string => {
  if (distanceMeters < 1000) {
    const rounded = Math.max(10, Math.round(distanceMeters / 10) * 10);
    return lang === "de" ? `${rounded} m entfernt` : `${rounded} m away`;
  }

  const kilometers = distanceMeters / 1000;
  const formatted = kilometers < 10 ? kilometers.toFixed(1) : Math.round(kilometers).toString();
  return lang === "de" ? `${formatted.replace(".", ",")} km entfernt` : `${formatted} km away`;
};
