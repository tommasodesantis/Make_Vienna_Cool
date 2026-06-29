import React from "react";
import { Search, X } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  clearLabel: string;
  resultCount: number;
  label: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  placeholder,
  clearLabel,
  resultCount,
  label,
}) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {label}
    </label>
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        role="searchbox"
        inputMode="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="h-11 w-full rounded-xl border border-slate-200 bg-offwhite pl-9 pr-16 text-sm font-medium text-slate-700 outline-none transition focus:border-green-brand focus:ring-2 focus:ring-mint"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700"
          aria-label={clearLabel}
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <span className="pointer-events-none absolute right-10 top-1/2 hidden -translate-y-1/2 rounded-full bg-mint px-2 py-0.5 text-[10px] font-black text-dark-green sm:inline">
        {resultCount}
      </span>
    </div>
  </div>
);
