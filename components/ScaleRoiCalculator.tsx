"use client";

import React, { useState } from "react";
import { X, DollarSign, Calculator, TrendingDown, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

interface ScaleRoiCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScaleRoiCalculator({ isOpen, onClose }: ScaleRoiCalculatorProps) {
  const [monthlyQueries, setMonthlyQueries] = useState<number>(50000);
  const [llmModelTier, setLlmModelTier] = useState<"standard" | "flagship">("flagship");

  if (!isOpen) return null;

  // Pricing assumptions
  // Flagship (e.g. GPT-4o, Claude 3.5): $2.50 / 1M in, $10.00 / 1M out
  // Standard (e.g. GPT-4o-mini, Haiku): $0.15 / 1M in, $0.60 / 1M out
  // Jev System One: $42 / 1 Billion input tokens = $0.042 / 1M tokens
  const costPer1MIn = llmModelTier === "flagship" ? 2.50 : 0.15;
  const costPer1MOut = llmModelTier === "flagship" ? 10.00 : 0.60;
  const jevCostPer1M = 0.042; // $42 / 1B tokens

  // Workload assumptions per query:
  // Naive: 2,500 input tokens, 100 output tokens
  const naiveInputTokensPerQuery = 2500;
  const naiveOutputTokensPerQuery = 100;

  // Jev-Gated:
  // - 15% of queries are blocked/short-circuited by Sufficiency Gate or Stage 1 (0 LLM tokens!)
  // - 85% of queries pass with filtered surviving chunks (600 input tokens, 100 output tokens)
  // - Jev System One tokens per query = ~2,500 tokens across 3 stages
  const jevPassingInputTokens = 600;
  const blockedRate = 0.15;
  const jevTokensPerQuery = 2400;

  // Naive Monthly Cost
  const naiveMonthlyInCost = (monthlyQueries * naiveInputTokensPerQuery / 1_000_000) * costPer1MIn;
  const naiveMonthlyOutCost = (monthlyQueries * naiveOutputTokensPerQuery / 1_000_000) * costPer1MOut;
  const naiveMonthlyTotal = naiveMonthlyInCost + naiveMonthlyOutCost;

  // Jev-Gated Monthly Cost
  const jevMonthlyDecisionCost = (monthlyQueries * jevTokensPerQuery / 1_000_000) * jevCostPer1M;
  const passingQueries = monthlyQueries * (1 - blockedRate);
  const jevMonthlyLlmInCost = (passingQueries * jevPassingInputTokens / 1_000_000) * costPer1MIn;
  const jevMonthlyLlmOutCost = (passingQueries * naiveOutputTokensPerQuery / 1_000_000) * costPer1MOut;
  const jevMonthlyTotal = jevMonthlyDecisionCost + jevMonthlyLlmInCost + jevMonthlyLlmOutCost;

  const monthlySavings = Math.max(0, naiveMonthlyTotal - jevMonthlyTotal);
  const annualSavings = monthlySavings * 12;
  const percentSaved = Math.round((monthlySavings / naiveMonthlyTotal) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Production Scale & ROI Calculator</h2>
              <p className="text-xs text-slate-400 font-sans">
                Real-world monthly cost model: Naive Context Stuffing vs. Jev-Gated Pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto font-sans">
          {/* Query Volume Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Monthly Production Query Volume:</span>
              <span className="font-mono text-emerald-400 text-sm font-bold">
                {monthlyQueries.toLocaleString()} queries / mo
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10000, 50000, 200000, 1000000].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMonthlyQueries(num)}
                  className={`py-2 px-2 rounded-lg border text-xs font-mono font-medium transition ${
                    monthlyQueries === num
                      ? "bg-emerald-950 text-emerald-300 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30"
                      : "bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-400"
                  }`}
                >
                  {num >= 1000000 ? `${num / 1000000}M` : `${num / 1000}K`}
                </button>
              ))}
            </div>
          </div>

          {/* Model Tier Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">Generator Model Tier:</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLlmModelTier("flagship")}
                className={`p-3 rounded-xl border text-left transition ${
                  llmModelTier === "flagship"
                    ? "bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30"
                    : "bg-slate-950/60 border-slate-800 hover:bg-slate-800/40"
                }`}
              >
                <div className="text-xs font-bold text-slate-200">Flagship Class</div>
                <div className="text-[11px] text-slate-400">GPT-4o, Claude 3.5 Sonnet ($2.50/1M in)</div>
              </button>
              <button
                type="button"
                onClick={() => setLlmModelTier("standard")}
                className={`p-3 rounded-xl border text-left transition ${
                  llmModelTier === "standard"
                    ? "bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30"
                    : "bg-slate-950/60 border-slate-800 hover:bg-slate-800/40"
                }`}
              >
                <div className="text-xs font-bold text-slate-200">Lightweight Class</div>
                <div className="text-[11px] text-slate-400">GPT-4o-mini, Claude 3.5 Haiku ($0.15/1M in)</div>
              </button>
            </div>
          </div>

          {/* Savings Highlight Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Estimated Net Savings
              </span>
              <span className="font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                ~{percentSaved}% Saved
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <div className="text-xs text-slate-400">Monthly Net Savings:</div>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  ${Math.round(monthlySavings).toLocaleString()}
                  <span className="text-xs font-sans text-slate-400 font-normal"> / mo</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Annual Net Savings:</div>
                <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                  ${Math.round(annualSavings).toLocaleString()}
                  <span className="text-xs font-sans text-slate-400 font-normal"> / year</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="text-slate-400 font-bold font-sans">Track A: Naive Vector RAG</div>
              <div className="text-lg font-bold text-slate-200">
                ${Math.round(naiveMonthlyTotal).toLocaleString()}/mo
              </div>
              <div className="text-[11px] text-slate-500 font-sans leading-tight">
                2,500 tokens stuffed per query &times; {monthlyQueries.toLocaleString()} queries.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
              <div className="text-emerald-300 font-bold font-sans">Track B: Jev-Gated RAG</div>
              <div className="text-lg font-bold text-emerald-400">
                ${Math.round(jevMonthlyTotal).toLocaleString()}/mo
              </div>
              <div className="text-[11px] text-emerald-300/70 font-sans leading-tight">
                Jev gating ($42/1B) + 75% prompt token cut + 0 tokens on blocked traps.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Jev System One: $42 / 1 Billion tokens
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
}
