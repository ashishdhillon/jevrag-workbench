"use client";

import React from "react";
import { Search, Play, X, ShieldAlert, Sparkles, Filter, AlertTriangle } from "lucide-react";
import { PRESET_TESTS } from "@/lib/sample-doc";

interface QueryBarProps {
  query: string;
  setQuery: (q: string) => void;
  onExecute: (presetQuery?: string) => void;
  isLoading: boolean;
}

export function QueryBar({ query, setQuery, onExecute, isLoading }: QueryBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onExecute();
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative flex items-center shadow-lg">
        <div className="absolute left-4 text-slate-400 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-emerald-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask any policy question against the loaded handbook (or pick a preset below)..."
          className="w-full pl-12 pr-32 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-100 placeholder-slate-500 text-sm md:text-base outline-none transition font-medium"
        />
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1.5 text-slate-400 hover:text-slate-200 transition"
              title="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs md:text-sm font-semibold shadow-md shadow-emerald-600/30 transition disabled:opacity-50 disabled:pointer-events-none"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Evaluating..." : "Run Test"}</span>
          </button>
        </div>
      </form>

      {/* Preset Test Case Buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Killer Presets:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto flex-1 md:ml-3">
          {PRESET_TESTS.map((test) => {
            const isSelected = query === test.query;
            let badgeClass = "bg-amber-950/70 text-amber-300 border-amber-500/40";
            let hoverClass = "hover:border-amber-500/60";
            let icon = <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />;

            if (test.id === "test-2") {
              badgeClass = "bg-purple-950/70 text-purple-300 border-purple-500/40";
              hoverClass = "hover:border-purple-500/60";
              icon = <ShieldAlert className="w-3 h-3 text-purple-400 shrink-0" />;
            } else if (test.id === "test-3") {
              badgeClass = "bg-emerald-950/70 text-emerald-300 border-emerald-500/40";
              hoverClass = "hover:border-emerald-500/60";
              icon = <Filter className="w-3 h-3 text-emerald-400 shrink-0" />;
            }

            return (
              <button
                key={test.id}
                type="button"
                onClick={() => {
                  setQuery(test.query);
                  onExecute(test.query);
                }}
                disabled={isLoading}
                className={`flex flex-col text-left p-2.5 rounded-lg border transition group text-xs ${
                  isSelected
                    ? "bg-slate-800/90 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30"
                    : `bg-slate-900/60 border-slate-800 ${hoverClass}`
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-semibold text-slate-200 group-hover:text-white flex items-center gap-1">
                    {icon}
                    {test.title}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium border ${badgeClass}`}>
                    {test.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 group-hover:text-slate-300 font-sans">
                  {test.query}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
