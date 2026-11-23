"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Info,
  DollarSign,
  Clock,
  Sparkles,
} from "lucide-react";
import { ComparisonResult } from "@/lib/rag-pipelines";

interface SplitScreenArenaProps {
  data: ComparisonResult | null;
  isLoading: boolean;
}

export function SplitScreenArena({ data, isLoading }: SplitScreenArenaProps) {
  const [showNaiveChunks, setShowNaiveChunks] = useState(false);
  const [showJevChunks, setShowJevChunks] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {/* Skeleton Left */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-pulse min-h-[380px]">
          <div className="h-6 w-48 rounded bg-slate-800" />
          <div className="h-4 w-full rounded bg-slate-800/60" />
          <div className="h-4 w-5/6 rounded bg-slate-800/60" />
          <div className="h-28 w-full rounded bg-slate-800/40" />
        </div>
        {/* Skeleton Right */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-pulse min-h-[380px]">
          <div className="h-6 w-48 rounded bg-slate-800" />
          <div className="h-4 w-full rounded bg-slate-800/60" />
          <div className="h-4 w-5/6 rounded bg-slate-800/60" />
          <div className="h-28 w-full rounded bg-slate-800/40" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {/* Placeholder Left */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center justify-center text-center min-h-[320px] text-slate-500">
          <Layers className="w-10 h-10 text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-slate-400">Track A: Naive Vector RAG</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Retrieves top 15 chunks via cosine similarity and stuffs them directly into the LLM context without reranking or sufficiency gating.
          </p>
        </div>

        {/* Placeholder Right */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center justify-center text-center min-h-[320px] text-slate-500">
          <Cpu className="w-10 h-10 text-emerald-600/80 mb-3" />
          <h3 className="text-sm font-semibold text-emerald-400">Track B: 3-Stage Jev-Gated RAG</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Stage 1 Intent Router &rarr; Stage 2 Parallel Filter with Contradiction Preservation &rarr; Stage 3 Sufficiency Gate to block hallucinations.
          </p>
        </div>
      </div>
    );
  }

  const { naive, jevGated } = data;
  const isShortCircuited = jevGated.shortCircuited;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
      {/* LEFT COLUMN: TRACK A - NAIVE VECTOR RAG */}
      <div className="flex flex-col justify-between rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        <div>
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-500/30">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  Track A: Naive Vector RAG
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">
                  Standard Cosine Top-15 Context Stuffing
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30">
              15 Chunks Stuffed
            </span>
          </div>

          {/* Alert Banner for Hallucination Risk */}
          {naive.hallucinationRisk === "HIGH" && (
            <div className="px-4 py-2.5 bg-amber-950/40 border-b border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Vulnerability Detected:</strong> Stuffed noisy context caused LLM to hallucinate or adopt false premise.
              </span>
            </div>
          )}

          {/* Response Text */}
          <div className="p-5 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Generated Answer</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-slate-200 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans min-h-[170px]">
              {naive.answer}
            </div>

            {/* Collapsible 15 chunks inspector */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowNaiveChunks(!showNaiveChunks)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-xs transition border border-slate-800"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  View All {naive.chunks.length} Stuffed Context Chunks
                </span>
                {showNaiveChunks ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {showNaiveChunks && (
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto pr-1">
                  {naive.chunks.map((c, idx) => (
                    <div
                      key={c.id || idx}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                        <span className="font-semibold text-blue-400">
                          [{c.id}] {c.section ? `Sec ${c.section}:` : ""} {c.title || ""}
                        </span>
                        <span>Cosine Sim: {(c.score * 100).toFixed(1)}%</span>
                      </div>
                      <p className="line-clamp-2 text-slate-400 font-sans">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Telemetry */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              Prompt: <strong className="text-slate-200">{naive.inputTokens}</strong> tok
            </span>
            <span>
              Output: <strong className="text-slate-200">{naive.outputTokens}</strong> tok
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {naive.latencyMs}ms
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <DollarSign className="w-3 h-3 text-yellow-400" />
              ${naive.estimatedCostUsd.toFixed(5)}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: TRACK B - 3-STAGE JEV-GATED RAG */}
      <div className="flex flex-col justify-between rounded-2xl bg-slate-900/90 border border-emerald-500/30 overflow-hidden shadow-xl shadow-emerald-950/10 ring-1 ring-emerald-500/20">
        <div>
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-emerald-900/30 bg-emerald-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                <Cpu className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Track B: 3-Stage Jev-Gated RAG
                </h3>
                <p className="text-[11px] text-emerald-300/80 font-sans">
                  Router &bull; Contradiction Filter &bull; Sufficiency Gate
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {jevGated.contradictionPreserved && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/90 text-purple-300 border border-purple-500/40 font-semibold">
                  Contradiction Saved
                </span>
              )}
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                {isShortCircuited ? "Gate Short-Circuit" : `${jevGated.chunksUsed} Chunks Filtered`}
              </span>
            </div>
          </div>

          {/* Sufficiency Status Banner */}
          {isShortCircuited ? (
            <div className="px-4 py-2.5 bg-amber-950/60 border-b border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Hallucination Gate Engaged:</strong> Insufficient evidence in handbook. LLM call stopped with 0 tokens.
              </span>
            </div>
          ) : (
            <div className="px-4 py-2.5 bg-emerald-950/40 border-b border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Sufficiency Gate Passed:</strong> Verified {(jevGated.telemetry.stage3.sufficiencyProbability * 100).toFixed(0)}% factual confidence.
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                Prompt Saved: +{jevGated.tokenSavingsPercent}%
              </span>
            </div>
          )}

          {/* Response Text / Blocked Card */}
          <div className="p-5 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90 flex items-center justify-between">
              <span>{isShortCircuited ? "Sufficiency Gate Interception" : "Verified Response"}</span>
              {isShortCircuited && (
                <span className="text-[10px] text-amber-400 font-mono">
                  0 LLM Tokens Billed
                </span>
              )}
            </div>

            {isShortCircuited ? (
              /* CRISP AMBER REFUSAL CARD */
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/50 text-amber-100 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans min-h-[170px] space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Blocked by Jev Sufficiency Gate (Probability: {(jevGated.telemetry.stage3.sufficiencyProbability * 100).toFixed(0)}% &lt; {(jevGated.telemetry.stage3.threshold * 100).toFixed(0)}%)</span>
                </div>
                <p className="text-slate-300">
                  The Jev decision model inspected the surviving evidence and determined the handbook contains <strong>no specific factual data</strong> to answer this query without guessing or fabricating numbers.
                </p>
                <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/20 font-mono text-xs text-amber-200 space-y-1">
                  <div>• Generator LLM Call: <strong className="text-amber-400">ABORTED (llmCalled = false)</strong></div>
                  <div>• Prompt Tokens Wasted: <strong className="text-emerald-400">0 tokens (100% saved)</strong></div>
                  <div>• Hallucination Prevented: <strong className="text-emerald-400">YES</strong> (Naive RAG hallucinated ₹500/day)</div>
                </div>
              </div>
            ) : (
              /* VERIFIED ANSWER */
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-slate-100 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans min-h-[170px]">
                {jevGated.answer}
              </div>
            )}

            {/* Collapsible surviving chunks inspector */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowJevChunks(!showJevChunks)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-950/30 hover:bg-emerald-950/50 text-emerald-300 text-xs transition border border-emerald-500/20"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  View Surviving Chunks ({jevGated.telemetry.survivingChunks.length} Kept vs {15 - jevGated.telemetry.survivingChunks.length} Dropped)
                </span>
                {showJevChunks ? (
                  <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </button>

              {showJevChunks && (
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto pr-1">
                  {jevGated.telemetry.survivingChunks.map((c, idx) => (
                    <div
                      key={c.id || idx}
                      className="p-2.5 rounded-lg bg-slate-950/90 border border-emerald-500/30 text-[11px] text-slate-200"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                        <span className="font-semibold text-emerald-400">
                          [{c.id}] {c.section ? `Sec ${c.section}:` : ""} {c.title || ""}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          SURVIVED FILTER
                        </span>
                      </div>
                      <p className="line-clamp-2 text-slate-300 font-sans">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Telemetry */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              LLM In: <strong className="text-emerald-400">{jevGated.inputTokens}</strong> tok
            </span>
            <span>
              Saved: <strong className="text-emerald-400">+{jevGated.tokenSavingsPercent}%</strong>
            </span>
            <span>
              Jev In: <strong className="text-slate-300">{jevGated.jevTokens}</strong> tok
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              {jevGated.latencyMs.totalMs}ms
            </span>
            <span className="flex items-center gap-1 text-emerald-300 font-bold">
              <DollarSign className="w-3 h-3 text-yellow-400" />
              ${jevGated.costs.totalCostUsd.toFixed(5)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
