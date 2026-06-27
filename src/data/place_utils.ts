import type { AccessibilityStatus, CompactPlace, PlaceType } from "./vienna_cool_places";

export const getPlaceType = (place: CompactPlace): PlaceType => place.placeType ?? "cool";

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
