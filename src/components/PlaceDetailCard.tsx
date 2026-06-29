import React, { useEffect, useRef, useState } from "react";
import { CompactPlace } from "../data/vienna_cool_places";
import { isAirConditioningAmenity, TRANSLATIONS, translateAmenity, translateCategory, translateNote } from "../data/translations";
import { formatDistance, getAccessibilityStatus, getPlaceType, googleMapsUrlForPlace } from "../data/place_utils";
import { AlertCircle, ArrowRight, CheckCircle2, ExternalLink, Flag, Loader2, Send, X } from "lucide-react";

interface PlaceDetailCardProps {
  place: CompactPlace | null;
  lang: "en" | "de";
}

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove?: (widgetId: string) => void;
  reset?: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const REPORT_ENDPOINT = import.meta.env.VITE_REPORT_ENDPOINT;
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const turnstileScriptId = "cloudflare-turnstile-script";

const loadTurnstileScript = () => {
  if (typeof document === "undefined" || document.getElementById(turnstileScriptId)) return;

  const script = document.createElement("script");
  script.id = turnstileScriptId;
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

export const PlaceDetailCard: React.FC<PlaceDetailCardProps> = ({ place, lang }) => {
  const t = TRANSLATIONS[lang];
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null);
  const [reportStatus, setReportStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [reportMessage, setReportMessage] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  const closeReport = () => {
    setIsReportOpen(false);
    setReportText("");
    setHoneypot("");
    setTurnstileToken(null);
    setReportStatus("idle");
    setReportMessage(null);
    if (turnstileWidgetId && window.turnstile?.remove) {
      window.turnstile.remove(turnstileWidgetId);
    }
    setTurnstileWidgetId(null);
  };

  useEffect(() => {
    if (!isReportOpen || !TURNSTILE_SITE_KEY || !turnstileRef.current || turnstileWidgetId) return;

    loadTurnstileScript();
    const container = turnstileRef.current;
    let cancelled = false;

    const interval = window.setInterval(() => {
      if (cancelled || !window.turnstile || !container.isConnected) return;
      window.clearInterval(interval);
      const widgetId = window.turnstile.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(null),
        "error-callback": () => setTurnstileToken(null),
      });
      setTurnstileWidgetId(widgetId);
    }, 150);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isReportOpen, turnstileWidgetId]);

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

  const placeType = getPlaceType(place);
  const isCoolPlace = placeType === "cool";
  const accessibility = getAccessibilityStatus(place);
  const mapsUrl = googleMapsUrlForPlace(place);
  const visibleAmenities = place.amenities.filter((amenity) => !isAirConditioningAmenity(amenity));
  const primarySourceUrl = place.sourceUrls?.[0];

  const getPrimaryBadge = () => {
    if (placeType === "drinking") {
      return {
        bg: "bg-sky-100 text-sky-800",
        text: t.modeDrinking,
      };
    }

    if (placeType === "water") {
      return {
        bg: "bg-cyan-100 text-cyan-800",
        text: t.modeWater,
      };
    }

    if (placeType === "toilet") {
      return {
        bg: "bg-violet-100 text-violet-900",
        text: t.modeToilets,
      };
    }

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

  const badge = getPrimaryBadge();

  const submitReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = reportText.trim();

    if (trimmed.length < 12) {
      setReportStatus("error");
      setReportMessage(t.reportTooShort);
      return;
    }

    if (!REPORT_ENDPOINT || !TURNSTILE_SITE_KEY) {
      setReportStatus("error");
      setReportMessage(t.reportUnavailable);
      return;
    }

    if (!turnstileToken) {
      setReportStatus("error");
      setReportMessage(t.reportError);
      return;
    }

    setReportStatus("submitting");
    setReportMessage(null);

    try {
      const response = await fetch(REPORT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: place.id,
          placeName: place.name,
          placeType,
          pageUrl: window.location.href,
          reportText: trimmed,
          turnstileToken,
          honeypot,
        }),
      });

      if (!response.ok) throw new Error(`Report failed with ${response.status}`);

      setReportStatus("success");
      setReportMessage(t.reportSuccess);
      setReportText("");
      setHoneypot("");
      if (turnstileWidgetId && window.turnstile?.reset) {
        window.turnstile.reset(turnstileWidgetId);
      }
      setTurnstileToken(null);
    } catch (error) {
      setReportStatus("error");
      setReportMessage(t.reportError);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-full hover:border-green-brand/30 transition-all duration-300">
      {/* Category & Status Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge.bg}`}>
          {badge.text}
        </span>
        {(placeType !== "cool" || place.category !== "Official Cool Zone") && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-aqua text-dark-green">
            {translateCategory(place.category, lang)}
          </span>
        )}
        {(isCoolPlace || placeType === "toilet") && (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${place.free ? "bg-mint text-dark-green" : "bg-amber-100 text-amber-800"}`}>
            {place.free ? (placeType === "toilet" ? t.freeAccess : t.freeEntry) : t.paidRequired}
          </span>
        )}
      </div>

      {/* Place Title */}
      <h2 className="text-xl font-bold text-slate-800 leading-snug mb-3">
        {place.name}
      </h2>

      {/* Address / Location */}
      <div className="mb-4 group">
        <div className="flex-1">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-0.5">
            {placeType === "cool" ? t.address : t.location}
          </p>
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

      {typeof place.distanceMeters === "number" && (
        <div className="mb-4">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-0.5">
            {t.useMyLocation}
          </p>
          <p className="text-sky-700 text-sm font-bold m-0">
            {formatDistance(place.distanceMeters, lang)}
          </p>
        </div>
      )}

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

      {(isCoolPlace || placeType === "toilet") && (
        <div className="mb-4">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{t.accessible}</p>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
            accessibility === "yes"
              ? "bg-mint text-dark-green"
              : accessibility === "limited"
                ? "bg-amber-100 text-amber-800"
                : accessibility === "no"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-slate-100 text-slate-500"
          }`}>
            {accessibility === "yes"
              ? t.accessibilityYes
              : accessibility === "limited"
                ? t.accessibilityLimited
                : accessibility === "no"
                  ? t.accessibilityNo
                  : t.accessibilityUnknown}
          </span>
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

      {place.notes && (
        <p className="text-slate-500 text-xs leading-relaxed mb-4">{translateNote(place.notes, lang)}</p>
      )}

      {primarySourceUrl && (
        <a
          href={primarySourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-dark-green hover:text-green-brand"
        >
          {t.source}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}

      {/* Actions */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-green-brand hover:bg-green-brand/90 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-sm hover:shadow transition-all duration-200 group"
        >
          {t.openInGoogleMaps}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>
        <button
          type="button"
          onClick={() => setIsReportOpen(true)}
          className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-offwhite text-slate-700 font-bold text-sm px-4 py-3 rounded-xl transition-all duration-200"
        >
          <Flag className="h-4 w-4" />
          {t.reportWrongInfo}
        </button>
      </div>

      {isReportOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/60 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="m-0 text-base font-bold text-slate-800">{t.reportTitle}</h3>
                <p className="mt-1 text-sm text-slate-500">{t.reportDescription}</p>
              </div>
              <button
                type="button"
                onClick={closeReport}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label={t.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submitReport} className="space-y-3">
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />
              <textarea
                value={reportText}
                onChange={(event) => {
                  setReportText(event.target.value);
                  if (reportStatus !== "submitting") {
                    setReportStatus("idle");
                    setReportMessage(null);
                  }
                }}
                placeholder={t.reportPlaceholder}
                maxLength={1200}
                className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-offwhite px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-green-brand focus:ring-2 focus:ring-mint"
              />

              {TURNSTILE_SITE_KEY ? (
                <div ref={turnstileRef} className="min-h-[65px]" />
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {t.reportUnavailable}
                </div>
              )}

              {reportMessage && (
                <div className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                  reportStatus === "success" ? "bg-mint text-dark-green" : "bg-rose-50 text-rose-800"
                }`}>
                  {reportMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={reportStatus === "submitting" || !REPORT_ENDPOINT || !TURNSTILE_SITE_KEY || !turnstileToken}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-green-brand/90 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {reportStatus === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.reportSubmitting}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t.reportSubmit}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
