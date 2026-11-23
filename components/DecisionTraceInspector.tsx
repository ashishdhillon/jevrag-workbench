"use client";

import React, { useState } from "react";
import {
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Eye,
  Filter,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  XCircle,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { JevGatedRAGResult } from "@/lib/rag-pipelines";
import { ChunkEvaluation } from "@/lib/jev-client";

interface DecisionTraceInspectorProps {
  jevResult: JevGatedRAGResult | null;
  isLoading: boolean;
}

export function DecisionTraceInspector({ jevResult, isLoading }: DecisionTraceInspectorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [chunkFilter, setChunkFilter] = useState<"all" | "kept" | "dropped" | "contradiction">("all");
  const [sortBy, setSortBy] = useState<"composite" | "cosine" | "utility" | "contradiction">("composite");
  const [expandedChunkId, setExpandedChunkId] = useState<string | null>(null);

  if (isLoading || !jevResult) return null;

  const { stage1, stage2Evaluations, stage3, survivingChunks } = jevResult.telemetry;

  // Filter chunks
  let displayedChunks = [...stage2Evaluations];
  if (chunkFilter === "kept") {
    displayedChunks = displayedChunks.filter((c) => c.status === "KEPT");
  } else if (chunkFilter === "dropped") {
    displayedChunks = displayedChunks.filter((c) => c.status === "DROPPED");
  } else if (chunkFilter === "contradiction") {
    displayedChunks = displayedChunks.filter((c) => c.isPreservedByContradiction);
  }

  // Sort chunks
  displayedChunks.sort((a, b) => {
    if (sortBy === "composite") return b.compositeScore - a.compositeScore;
    if (sortBy === "cosine") return b.vectorSimilarity - a.vectorSimilarity;
    if (sortBy === "utility") return b.answerUtilityScore - a.answerUtilityScore;
    if (sortBy === "contradiction") return b.contradictsPremiseProbability - a.contradictsPremiseProbability;
    return 0;
  });

  const keptCount = stage2Evaluations.filter((c) => c.status === "KEPT").length;
  const droppedCount = stage2Evaluations.filter((c) => c.status === "DROPPED").length;
  const contradictionCount = stage2Evaluations.filter((c) => c.isPreservedByContradiction).length;

  return (
    <div className="w-full rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl overflow-hidden transition-all mt-4">
      {/* Header bar that toggles inspector */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-950/90 border-b border-slate-800 hover:bg-slate-950 text-left transition"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Jev Decision Trace & Telemetry Inspector
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                System One Deep Inspection
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              3-Stage internal trace: Intent Router &bull; Parallel Contradiction Filter &bull; Sufficiency Gate
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline-block font-mono">
            {isOpen ? "Collapse Trace" : "Expand Full Trace"}
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 space-y-6">
          {/* STAGE 1: PRE-RETRIEVAL ROUTER */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-semibold">
                  STAGE 1
                </span>
                <h3 className="text-sm font-bold text-slate-200">
                  Pre-Retrieval Router (Choice + Noul)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Intent Classification:</span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    stage1.intent === "needs_docs"
                      ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/40"
                      : "bg-amber-950/90 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {stage1.intent} ({(stage1.rawConfidence * 100).toFixed(0)}% conf)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Ambiguity Meter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Ambiguity Probability (Noul):</span>
                  <span className="font-mono text-slate-200 font-semibold">
                    {(stage1.ambiguityProbability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      stage1.isAmbiguous ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${stage1.ambiguityProbability * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {stage1.isAmbiguous
                    ? "⚠️ High query ambiguity: clarification recommended before expensive retrieval."
                    : "✓ Query is specific and well-scoped. Clean pass to vector retrieval."}
                </p>
              </div>

              {/* Latency & Routing status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Router Decision:</div>
                  <div className="text-slate-200 font-semibold mt-0.5">
                    {stage1.intent === "needs_docs"
                      ? "Proceed to Vector Search"
                      : "Short-circuit: Chitchat / Out of scope"}
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-400">
                  <div>Latency: {jevResult.latencyMs.stage1RouterMs}ms</div>
                  <div className="text-emerald-400">Jev TypeSafe API</div>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 2: PARALLEL FILTER & RERANK CHUNK MATRIX */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-semibold">
                  STAGE 2
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    Parallel Filter & Rerank Matrix (Noul + Score)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Evaluated 15 retrieved vector chunks &bull; Always preserves contradiction (&ge; 60%)
                  </p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setChunkFilter("all")}
                  className={`px-2.5 py-1 rounded-md font-mono transition ${
                    chunkFilter === "all"
                      ? "bg-slate-800 text-white border border-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  All ({stage2Evaluations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setChunkFilter("kept")}
                  className={`px-2.5 py-1 rounded-md font-mono transition ${
                    chunkFilter === "kept"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : "text-emerald-400/70 hover:text-emerald-300"
                  }`}
                >
                  Kept ({keptCount})
                </button>
                <button
                  type="button"
                  onClick={() => setChunkFilter("dropped")}
                  className={`px-2.5 py-1 rounded-md font-mono transition ${
                    chunkFilter === "dropped"
                      ? "bg-slate-800 text-slate-300 border border-slate-700"
                      : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  Dropped ({droppedCount})
                </button>
                {contradictionCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setChunkFilter("contradiction")}
                    className={`px-2.5 py-1 rounded-md font-mono transition ${
                      chunkFilter === "contradiction"
                        ? "bg-purple-950 text-purple-300 border border-purple-500/40"
                        : "text-purple-400 hover:text-purple-300"
                    }`}
                  >
                    Contradictions ({contradictionCount})
                  </button>
                )}
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider bg-slate-900/60">
                    <th className="py-2.5 px-3">Chunk ID</th>
                    <th className="py-2.5 px-3">Vector Sim</th>
                    <th className="py-2.5 px-3">Jev Utility (Score)</th>
                    <th className="py-2.5 px-3">Contradiction (Noul)</th>
                    <th className="py-2.5 px-3">Jev Composite</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {displayedChunks.map((evalItem) => {
                    const isKept = evalItem.status === "KEPT";
                    const isExpanded = expandedChunkId === evalItem.chunkId;

                    return (
                      <React.Fragment key={evalItem.chunkId}>
                        <tr
                          onClick={() =>
                            setExpandedChunkId(isExpanded ? null : evalItem.chunkId)
                          }
                          className={`cursor-pointer transition hover:bg-slate-800/40 ${
                            evalItem.isPreservedByContradiction
                              ? "bg-purple-950/20"
                              : isKept
                              ? "bg-emerald-950/10"
                              : "opacity-60"
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-300 flex items-center gap-1.5">
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                            )}
                            <span className={isKept ? "text-emerald-400 font-bold" : ""}>
                              {evalItem.chunkId}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-400">
                            {(evalItem.vectorSimilarity * 100).toFixed(1)}%
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            <span
                              className={
                                evalItem.answerUtilityScore >= 0.7
                                  ? "text-emerald-400 font-semibold"
                                  : "text-slate-400"
                              }
                            >
                              {(evalItem.answerUtilityScore * 100).toFixed(0)}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            {evalItem.contradictsPremiseProbability >= 0.6 ? (
                              <span className="px-2 py-0.5 rounded bg-purple-900/80 text-purple-200 border border-purple-500/40 font-bold">
                                {(evalItem.contradictsPremiseProbability * 100).toFixed(0)}% Contradiction
                              </span>
                            ) : (
                              <span className="text-slate-500">
                                {(evalItem.contradictsPremiseProbability * 100).toFixed(0)}%
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-200 font-semibold">
                            {evalItem.compositeScore.toFixed(3)}
                          </td>
                          <td className="py-2.5 px-3">
                            {isKept ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                KEPT
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800 text-[10px] font-mono">
                                <XCircle className="w-3 h-3 text-slate-600" />
                                DROPPED
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[11px] text-slate-400 truncate max-w-xs font-sans">
                            {evalItem.reason}
                          </td>
                        </tr>

                        {/* Expanded details row */}
                        {isExpanded && (
                          <tr className="bg-slate-900/90 border-b border-slate-800">
                            <td colSpan={7} className="p-4 text-xs text-slate-300 space-y-2">
                              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono border-b border-slate-800 pb-1.5">
                                <span>
                                  Inspection for <strong>{evalItem.chunkId}</strong>:
                                </span>
                                <span className="text-emerald-400">
                                  {evalItem.status === "KEPT"
                                    ? "Passed Stage 2 Filter"
                                    : "Eliminated by Jev to eliminate noise"}
                                </span>
                              </div>
                              <p className="text-slate-400 italic font-mono text-[11px]">
                                {evalItem.reason}
                              </p>
                              {evalItem.isPreservedByContradiction && (
                                <div className="p-2.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs flex items-center gap-2">
                                  <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
                                  <span>
                                    <strong>Contradiction Preservation Rule Engaged:</strong> This chunk contradicts the user's premise. Jev elevated it to priority #1 so the generator LLM can explicitly refute the false assumption!
                                  </span>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* STAGE 3: SUFFICIENCY GATE METER */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-semibold">
                  STAGE 3
                </span>
                <h3 className="text-sm font-bold text-slate-200">
                  Sufficiency Gate (Noul Calibrated Probabilities)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Gate Threshold:</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                  {(stage3.threshold * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Calibrated Evidence Sufficiency:{" "}
                  <strong
                    className={
                      stage3.isSufficient ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"
                    }
                  >
                    {(stage3.sufficiencyProbability * 100).toFixed(1)}%
                  </strong>
                </span>
                <span className="text-slate-500 text-[11px]">
                  Threshold Line: {(stage3.threshold * 100).toFixed(0)}%
                </span>
              </div>

              {/* Progress bar with threshold marker */}
              <div className="relative w-full h-4 rounded-full bg-slate-850 bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 rounded-full ${
                    stage3.isSufficient
                      ? "bg-gradient-to-r from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/30"
                      : "bg-gradient-to-r from-amber-600 to-red-500 shadow-lg shadow-amber-500/30"
                  }`}
                  style={{ width: `${stage3.sufficiencyProbability * 100}%` }}
                />
                {/* Marker line for threshold */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-sm z-10"
                  style={{ left: `${stage3.threshold * 100}%` }}
                  title={`Threshold: ${(stage3.threshold * 100).toFixed(0)}%`}
                />
              </div>

              {/* Status Outcome Description */}
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                  stage3.isSufficient
                    ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
                    : "bg-amber-950/30 border-amber-500/40 text-amber-200"
                }`}
              >
                {stage3.isSufficient ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-slate-100">
                    {stage3.isSufficient
                      ? "Gate Cleared: Evidence contains factual basis."
                      : "Gate Short-Circuit: Insufficient evidence detected."}
                  </div>
                  <div className="text-slate-400 mt-0.5 font-sans leading-relaxed">
                    {stage3.reason}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
