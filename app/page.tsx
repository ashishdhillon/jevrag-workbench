"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { QueryBar } from "@/components/QueryBar";
import { TelemetryStrip } from "@/components/TelemetryStrip";
import { SplitScreenArena } from "@/components/SplitScreenArena";
import { DecisionTraceInspector } from "@/components/DecisionTraceInspector";
import { SettingsModal, SettingsState } from "@/components/SettingsModal";
import { UploadModal } from "@/components/UploadModal";
import { DocumentViewerModal } from "@/components/DocumentViewerModal";
import { ScaleRoiCalculator } from "@/components/ScaleRoiCalculator";
import { ComparisonResult } from "@/lib/rag-pipelines";
import { SAMPLE_HANDBOOK_NAME, PRESET_TESTS } from "@/lib/sample-doc";
import { generateMarkdownReport, downloadFile } from "@/lib/export-report";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

export default function WorkbenchPage() {
  const [query, setQuery] = useState(PRESET_TESTS[0].query);
  const [activeDocName, setActiveDocName] = useState(SAMPLE_HANDBOOK_NAME);
  const [chunkCount, setChunkCount] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [isRoiCalculatorOpen, setIsRoiCalculatorOpen] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<SettingsState>({
    demoMode: true,
    sufficiencyThreshold: 0.7,
    jevApiKey: "",
    jevBaseUrl: "https://api.typesafe.ai/v1/systemone",
    openAiApiKey: "",
    openAiBaseUrl: "https://api.openai.com/v1",
    llmModel: "gpt-4o",
  });

  // Notification Banner
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Run benchmark comparison on query
  const executeComparison = async (overrideQuery?: string) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          sufficiencyThreshold: settings.sufficiencyThreshold,
          demoMode: settings.demoMode,
          openAiApiKey: settings.openAiApiKey,
          openAiBaseUrl: settings.openAiBaseUrl,
          llmModel: settings.llmModel,
          jevApiKey: settings.jevApiKey,
          jevBaseUrl: settings.jevBaseUrl,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Comparison execution failed.");
      }

      setComparisonResult(json.data);
      if (json.activeDocument) setActiveDocName(json.activeDocument);
      if (json.totalChunksIndexed) setChunkCount(json.totalChunksIndexed);
    } catch (err: any) {
      console.error("Execute error:", err);
      showToast("error", err.message || "Failed to execute pipeline comparison.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reload the built-in sample handbook
  const handleLoadSample = async () => {
    setIsLoadingSample(true);
    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ load_sample: true }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to reload sample document.");
      }

      setActiveDocName(json.docName);
      setChunkCount(json.chunkCount);
      showToast("success", `Loaded sample handbook (${json.chunkCount} dense chunks indexed).`);
    } catch (err: any) {
      showToast("error", err.message || "Failed to load sample document.");
    } finally {
      setIsLoadingSample(false);
    }
  };

  // Upload handler
  const handleUploadSuccess = (docName: string, chunks: number, chars: number) => {
    setActiveDocName(docName);
    setChunkCount(chunks);
    setComparisonResult(null);
    showToast("success", `Document "${docName}" indexed (${chunks} chunks, ${chars.toLocaleString()} chars).`);
  };

  // Export report
  const handleExportReport = () => {
    if (!comparisonResult) return;
    const reportMd = generateMarkdownReport(comparisonResult, activeDocName);
    const dateStr = new Date().toISOString().replace(/[:.]/g, "-");
    downloadFile(reportMd, `JevRAG_Audit_Report_${dateStr}.md`, "text/markdown");
    showToast("success", "Audit report downloaded as Markdown.");
  };

  // Initial load: trigger Test 1 automatically so the workbench opens with rich populated comparison!
  useEffect(() => {
    executeComparison(PRESET_TESTS[0].query);
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border ${
              toast.type === "success"
                ? "bg-emerald-950/95 text-emerald-200 border-emerald-500/50 shadow-emerald-950/40"
                : toast.type === "error"
                ? "bg-red-950/95 text-red-200 border-red-500/50 shadow-red-950/40"
                : "bg-slate-900/95 text-slate-200 border-slate-700"
            }`}
          >
            {toast.type === "success" && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {toast.type === "info" && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <Header
        activeDocName={activeDocName}
        chunkCount={chunkCount}
        demoMode={settings.demoMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenDocViewer={() => setIsDocViewerOpen(true)}
        onOpenRoiCalculator={() => setIsRoiCalculatorOpen(true)}
        onExportReport={handleExportReport}
        hasComparisonData={!!comparisonResult}
        onLoadSample={handleLoadSample}
        isLoadingSample={isLoadingSample}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 pt-6 space-y-6 flex-1">
        {/* Query Bar & Presets */}
        <section aria-label="Query and Presets">
          <QueryBar
            query={query}
            setQuery={setQuery}
            onExecute={executeComparison}
            isLoading={isLoading}
          />
        </section>

        {/* Telemetry Comparison Strip */}
        <section aria-label="Telemetry Comparison">
          <TelemetryStrip data={comparisonResult} isLoading={isLoading} />
        </section>

        {/* Split Screen Arena: Naive vs Jev-Gated */}
        <section aria-label="Split Screen Evaluation">
          <SplitScreenArena data={comparisonResult} isLoading={isLoading} />
        </section>

        {/* Expandable Decision Trace & Telemetry Inspector */}
        <section aria-label="Jev Decision Trace">
          <DecisionTraceInspector
            jevResult={comparisonResult?.jevGated || null}
            isLoading={isLoading}
          />
        </section>
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          showToast("success", "Settings updated.");
        }}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <DocumentViewerModal
        isOpen={isDocViewerOpen}
        onClose={() => setIsDocViewerOpen(false)}
        activeDocName={activeDocName}
      />

      <ScaleRoiCalculator
        isOpen={isRoiCalculatorOpen}
        onClose={() => setIsRoiCalculatorOpen(false)}
      />
    </div>
  );
}
