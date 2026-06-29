import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, Send, X } from "lucide-react";
import { PlaceType } from "../data/vienna_cool_places";
import { TRANSLATIONS } from "../data/translations";

interface SuggestPlaceModalProps {
  isOpen: boolean;
  activeMode: PlaceType;
  lang: "en" | "de";
  onClose: () => void;
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

export const SuggestPlaceModal: React.FC<SuggestPlaceModalProps> = ({
  isOpen,
  activeMode,
  lang,
  onClose,
}) => {
  const t = TRANSLATIONS[lang];
  const [placeType, setPlaceType] = useState<PlaceType>(activeMode);
  const [placeName, setPlaceName] = useState("");
  const [locationText, setLocationText] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPlaceType(activeMode);
    }
  }, [activeMode, isOpen]);

  const resetForm = () => {
    setPlaceType(activeMode);
    setPlaceName("");
    setLocationText("");
    setNotes("");
    setHoneypot("");
    setTurnstileToken(null);
    setStatus("idle");
    setMessage(null);
    if (turnstileWidgetId && window.turnstile?.remove) {
      window.turnstile.remove(turnstileWidgetId);
    }
    setTurnstileWidgetId(null);
  };

  const close = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !TURNSTILE_SITE_KEY || !turnstileRef.current || turnstileWidgetId) return;

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
  }, [isOpen, turnstileWidgetId]);

  const submitSuggestion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = placeName.trim();
    const trimmedLocation = locationText.trim();
    const trimmedNotes = notes.trim();
    const validationErrors = [
      trimmedName.length < 2 ? t.suggestPlaceMissingName : null,
      trimmedLocation.length < 5 ? t.suggestPlaceMissingLocation : null,
      trimmedNotes.length < 12 ? t.suggestPlaceMissingNotes : null,
    ].filter(Boolean);

    if (validationErrors.length > 0) {
      setStatus("error");
      setMessage(validationErrors.join(" "));
      return;
    }

    if (!REPORT_ENDPOINT || !TURNSTILE_SITE_KEY) {
      setStatus("error");
      setMessage(t.reportUnavailable);
      return;
    }

    if (!turnstileToken) {
      setStatus("error");
      setMessage(t.reportError);
      return;
    }

    setStatus("submitting");
    setMessage(null);

    try {
      const response = await fetch(REPORT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionType: "missing_place",
          placeType,
          placeName: trimmedName,
          locationText: trimmedLocation,
          notes: trimmedNotes,
          pageUrl: window.location.href,
          turnstileToken,
          honeypot,
        }),
      });

      if (!response.ok) throw new Error(`Suggestion failed with ${response.status}`);

      setStatus("success");
      setMessage(t.suggestPlaceSuccess);
      setPlaceName("");
      setLocationText("");
      setNotes("");
      setHoneypot("");
      if (turnstileWidgetId && window.turnstile?.reset) {
        window.turnstile.reset(turnstileWidgetId);
      }
      setTurnstileToken(null);
    } catch (error) {
      setStatus("error");
      setMessage(t.reportError);
    }
  };

  if (!isOpen) return null;

  const modeOptions: Array<{ value: PlaceType; label: string }> = [
    { value: "cool", label: t.modeCool },
    { value: "drinking", label: t.modeDrinking },
    { value: "water", label: t.modeWater },
    { value: "toilet", label: t.modeToilets },
  ];

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/60 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="m-0 text-base font-bold text-slate-800">{t.suggestPlaceTitle}</h3>
            <p className="mt-1 text-sm text-slate-500">{t.suggestPlaceDescription}</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label={t.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submitSuggestion} className="space-y-3">
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t.suggestedPlaceType}
            </label>
            <select
              value={placeType}
              onChange={(event) => setPlaceType(event.target.value as PlaceType)}
              className="w-full rounded-xl border border-slate-200 bg-offwhite px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-green-brand focus:ring-2 focus:ring-mint"
            >
              {modeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t.suggestedPlaceName}
            </label>
            <input
              type="text"
              value={placeName}
              onChange={(event) => {
                setPlaceName(event.target.value);
                if (status !== "submitting") {
                  setStatus("idle");
                  setMessage(null);
                }
              }}
              maxLength={160}
              placeholder={t.suggestedPlaceNamePlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-offwhite px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-green-brand focus:ring-2 focus:ring-mint"
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t.suggestedPlaceLocation}
            </label>
            <input
              type="text"
              value={locationText}
              onChange={(event) => {
                setLocationText(event.target.value);
                if (status !== "submitting") {
                  setStatus("idle");
                  setMessage(null);
                }
              }}
              maxLength={500}
              placeholder={t.suggestedPlaceLocationPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-offwhite px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-green-brand focus:ring-2 focus:ring-mint"
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t.suggestedPlaceNotes}
            </label>
            <textarea
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value);
                if (status !== "submitting") {
                  setStatus("idle");
                  setMessage(null);
                }
              }}
              maxLength={1200}
              placeholder={t.suggestedPlaceNotesPlaceholder}
              className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-offwhite px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-green-brand focus:ring-2 focus:ring-mint"
            />
          </div>

          {TURNSTILE_SITE_KEY ? (
            <div ref={turnstileRef} className="min-h-[65px]" />
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {t.reportUnavailable}
            </div>
          )}

          {message && (
            <div className={`rounded-xl px-3 py-2 text-xs font-semibold ${
              status === "success" ? "bg-mint text-dark-green" : "bg-rose-50 text-rose-800"
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting" || !REPORT_ENDPOINT || !TURNSTILE_SITE_KEY || !turnstileToken}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-green-brand/90 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.reportSubmitting}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t.suggestPlaceSubmit}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
