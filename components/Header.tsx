"use client";

import React from "react";
import {
  Sparkles,
  FileText,
  Upload,
  Settings,
  RefreshCw,
  Cpu,
  Calculator,
  Download,
  BookOpen,
} from "lucide-react";

interface HeaderProps {
  activeDocName: string;
  chunkCount: number;
  demoMode: boolean;
  onOpenSettings: () => void;
  onOpenUpload: () => void;
  onOpenDocViewer: () => void;
  onOpenRoiCalculator: () => void;
  onExportReport: () => void;
  hasComparisonData: boolean;
  onLoadSample: () => void;
  isLoadingSample: boolean;
}

export function Header({
  activeDocName,
  chunkCount,
  demoMode,
  onOpenSettings,
  onOpenUpload,
  onOpenDocViewer,
  onOpenRoiCalculator,
  onExportReport,
  hasComparisonData,
  onLoadSample,
  isLoadingSample,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-[#0c121e]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl shrink-0">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                JevRAG <span className="text-emerald-400 font-extrabold">Workbench</span>
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-medium">
                v1.0 • System One
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Side-by-side benchmark: Naive Vector RAG vs. 3-Stage Jev-Gated Pipeline
            </p>
          </div>
        </div>

        {/* Active Doc Badge & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Document Badge (Clickable to open Explorer) */}
          <button
            onClick={onOpenDocViewer}
            title="Click to explore and inspect all indexed chunks in this handbook"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 hover:border-emerald-500/50 border border-slate-800 text-xs text-slate-300 font-mono transition group text-left"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="truncate max-w-[150px] font-semibold text-slate-200 group-hover:text-emerald-300" title={activeDocName}>
              {activeDocName}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 font-sans">
              {chunkCount} chunks
            </span>
          </button>

          {/* Mode Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
              demoMode
                ? "bg-amber-950/40 text-amber-300 border-amber-500/30"
                : "bg-emerald-950/40 text-emerald-300 border-emerald-500/30"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                demoMode ? "bg-amber-400 animate-pulse-subtle" : "bg-emerald-400"
              }`}
            />
            <span className="hidden sm:inline">{demoMode ? "Demo Mode (Simulated)" : "Live API"}</span>
            <span className="sm:hidden">{demoMode ? "Demo" : "Live"}</span>
          </div>

          {/* Action: ROI Calculator */}
          <button
            onClick={onOpenRoiCalculator}
            title="Calculate monthly cost savings at scale"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">ROI Calculator</span>
          </button>

          {/* Action: Export Report */}
          {hasComparisonData && (
            <button
              onClick={onExportReport}
              title="Download Markdown evaluation audit report"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 border border-emerald-500/30 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Export Audit</span>
            </button>
          )}

          {/* Action: Load Sample */}
          <button
            onClick={onLoadSample}
            disabled={isLoadingSample}
            title="Reload the 25-chunk dense policy handbook"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-xs font-semibold text-slate-200 border border-slate-700 transition disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isLoadingSample ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Reset Handbook</span>
          </button>

          {/* Action: Upload Doc */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Action: Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Configure API Keys & Sufficiency Threshold"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
