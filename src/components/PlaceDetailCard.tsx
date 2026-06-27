import React from "react";
import { CompactPlace } from "../data/vienna_cool_places";
import { isAirConditioningAmenity, TRANSLATIONS, translateAmenity, translateCategory } from "../data/translations";
import { CheckCircle2, ExternalLink, ArrowRight } from "lucide-react";

interface PlaceDetailCardProps {
  place: CompactPlace | null;
  lang: "en" | "de";
}

export const PlaceDetailCard: React.FC<PlaceDetailCardProps> = ({ place, lang }) => {
  const t = TRANSLATIONS[lang];

  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-white rounded-2xl border border-slate-100/80 shadow-sm min-h-[220px]">
        <h3 className="text-slate-800 font-semibold text-base mb-1.5">{t.details}</h3>
        <p className="text-slate-500 text-sm max-w-[260px] leading-relaxed">
          {t.mapHint}
        </p>
      </div>
    );
  }

  // Determine cooling label styles & badge
  const getCoolingBadge = () => {
    switch (place.coolingType) {
      case "confirmed_air_conditioned":
        return {
          bg: "bg-green-brand text-white",
          text: t.acConfirmed,
        };
      case "likely_air_conditioned":
        return {
          bg: "bg-mint text-dark-green",
          text: t.acLikely,
        };
      case "reddit_claim_air_conditioned_unverified":
        return {
          bg: "bg-mint text-dark-green",
          text: t.acUnverified,
        };
      case "official_cool_indoor_room_not_ac_confirmed":
        return {
          bg: "bg-mint text-dark-green",
          text: t.acOfficialZone,
        };
      default:
        return {
          bg: "bg-mint text-dark-green",
          text: t.acCoolRoom,
        };
    }
  };

  const badge = getCoolingBadge();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ", " + place.address)}`;
  const visibleAmenities = place.amenities.filter((amenity) => !isAirConditioningAmenity(amenity));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-full hover:border-green-brand/30 transition-all duration-300">
      {/* Category & Status Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge.bg}`}>
          {badge.text}
        </span>
        {place.category !== "Official Cool Zone" && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-aqua text-dark-green">
            {translateCategory(place.category, lang)}
          </span>
        )}
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${place.free ? "bg-mint text-dark-green" : "bg-amber-100 text-amber-800"}`}>
          {place.free ? t.freeEntry : t.paidRequired}
        </span>
      </div>

      {/* Place Title */}
      <h2 className="text-xl font-bold text-slate-800 leading-snug mb-3">
        {place.name}
      </h2>

      {/* Address */}
      <div className="mb-4 group">
        <div className="flex-1">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-0.5">{t.address}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-700 text-sm hover:text-green-brand transition-colors underline decoration-slate-300 hover:decoration-green-brand underline-offset-4 flex items-center gap-1 leading-normal font-medium"
            title={t.openInGoogleMaps}
          >
            {place.address}
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-green-brand transition-colors" />
          </a>
        </div>
      </div>

      {/* Opening Hours */}
      {place.hours && place.hours.length > 0 && (
        <div className="mb-4">
          <div className="flex-1">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-0.5">{t.hours}</p>
            <div className="space-y-0.5">
              {place.hours.map((hour, idx) => (
                <p key={idx} className="text-slate-700 text-sm font-medium m-0">
                  {hour}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Amenities / Features List */}
      {visibleAmenities.length > 0 && (
        <div className="mb-5 flex-1">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{t.amenities}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {visibleAmenities.map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-700 text-xs bg-offwhite border border-slate-100 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-brand shrink-0" />
                <span className="truncate leading-none font-medium">{translateAmenity(amenity, lang)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex gap-3">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-green-brand hover:bg-green-brand/90 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-sm hover:shadow transition-all duration-200 group"
        >
          {t.openInGoogleMaps}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};
