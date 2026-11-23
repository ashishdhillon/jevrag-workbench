"use client";

import React from "react";
import {
  Layers,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Clock,
  DollarSign,
  TrendingDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ComparisonResult } from "@/lib/rag-pipelines";

interface TelemetryStripProps {
  data: ComparisonResult | null;
  isLoading: boolean;
}

export function TelemetryStrip({ data, isLoading }: TelemetryStripProps) {
  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-slate-800/60" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center text-xs text-slate-500 font-mono">
        💡 Execute a query above or click any preset to generate live side-by-side telemetry metrics.
      </div>
    );
  }

  const { naive, jevGated } = data;
  const isShortCircuited = jevGated.shortCircuited;

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {/* 1. Chunks Fed to LLM */}
      <div className="flex flex-col justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            Chunks to LLM
          </span>
          <span className="text-[10px] font-mono text-slate-500">Track A vs B</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-sm font-mono text-slate-400 line-through">
            {naive.chunksUsed}
          </span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span
            className={`text-lg font-bold font-mono ${
              isShortCircuited ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {isShortCircuited ? "0" : jevGated.chunksUsed}
          </span>
          <span className="text-[10px] text-slate-400 font-sans">
            {isShortCircuited ? "(Blocked)" : "chunks"}
          </span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 font-sans">
          {isShortCircuited ? "Zero chunks fed to LLM" : `Dropped ${15 - jevGated.chunksUsed} noise chunks`}
        </div>
      </div>

      {/* 2. Prompt Tokens Saved */}
      <div className="flex flex-col justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            Prompt Tokens
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            +{jevGated.tokenSavingsPercent}%
          </span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold font-mono text-emerald-400">
            {jevGated.promptTokensSaved > 0
              ? `-${jevGated.promptTokensSaved}`
              : "0"}
          </span>
          <span className="text-[11px] text-slate-400 font-sans">tokens</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 font-sans">
          {isShortCircuited ? "100% LLM tokens saved" : `Reduced prompt bloat by ${jevGated.tokenSavingsPercent}%`}
        </div>
      </div>

      {/* 3. Hallucination Gate Status */}
      <div className="flex flex-col justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            {isShortCircuited ? (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
            Sufficiency Gate
          </span>
          <span className="text-[10px] font-mono text-slate-500">Stage 3</span>
        </div>
        <div className="mt-2">
          {isShortCircuited ? (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono">
              BLOCKED (0 LLM)
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono">
              PASSED ({(jevGated.telemetry.stage3.sufficiencyProbability * 100).toFixed(0)}%)
            </div>
          )}
        </div>
        <div className="text-[11px] text-slate-500 mt-1 font-sans">
          {isShortCircuited ? "Hallucination blocked with 0 tokens" : "Sufficient evidence verified"}
        </div>
      </div>

      {/* 4. Total Latency */}
      <div className="flex flex-col justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Total Latency
          </span>
          <span className="text-[10px] font-mono text-slate-500">Speed</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2 font-mono">
          <span className="text-sm text-slate-400">{naive.latencyMs}ms</span>
          <span className="text-slate-600">/</span>
          <span className="text-lg font-bold text-cyan-400">
            {jevGated.latencyMs.totalMs}ms
          </span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 font-sans">
          Jev decision: {jevGated.latencyMs.stage1RouterMs + jevGated.latencyMs.stage2FilterMs + jevGated.latencyMs.stage3SufficiencyMs}ms
        </div>
      </div>

      {/* 5. Estimated Cost Comparison */}
      <div className="flex flex-col justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-yellow-400" />
            Est. Query Cost
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            -{jevGated.costSavingsPercent}%
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-2 font-mono">
          <span className="text-xs text-slate-400 line-through">
            ${naive.estimatedCostUsd.toFixed(5)}
          </span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-base font-bold text-yellow-300">
            ${jevGated.costs.totalCostUsd.toFixed(5)}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-1 font-sans flex items-center justify-between">
          <span>Jev: $42/1B tokens</span>
          <span className="text-emerald-400 font-mono">Save ~{jevGated.costSavingsPercent}%</span>
        </div>
      </div>
    </div>
  );
}
