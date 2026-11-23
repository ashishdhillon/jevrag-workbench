"use client";

import React, { useState, useEffect } from "react";
import { X, Search, FileText, Layers, Copy, Check, Hash, ExternalLink } from "lucide-react";

interface DocumentChunk {
  id: string;
  text: string;
  metadata: {
    docName: string;
    section?: string;
    title?: string;
    chunkIndex: number;
    totalChunks: number;
  };
}

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDocName: string;
}

export function DocumentViewerModal({ isOpen, onClose, activeDocName }: DocumentViewerModalProps) {
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedChunkId, setCopiedChunkId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchChunks = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/chunks");
        const json = await res.json();
        if (json.success && json.chunks) {
          setChunks(json.chunks);
        }
      } catch (err) {
        console.error("Failed to load chunks:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChunks();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredChunks = chunks.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const textMatch = c.text.toLowerCase().includes(q);
    const titleMatch = c.metadata.title?.toLowerCase().includes(q) ?? false;
    const secMatch = c.metadata.section?.toLowerCase().includes(q) ?? false;
    const idMatch = c.id.toLowerCase().includes(q);
    return textMatch || titleMatch || secMatch || idMatch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChunkId(id);
    setTimeout(() => setCopiedChunkId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[88vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Document & Chunks Explorer</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {chunks.length} chunks
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md font-mono mt-0.5">
                {activeDocName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Filters */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter chunks by keyword (e.g. '500', 'internship', 'meal', 'prohibited')..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-xs text-slate-200 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-slate-400 font-mono">
            <span>Quick:</span>
            {["Section 1.3", "Section 2.1", "Section 5.1", "₹500", "meal"].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className={`px-2 py-1 rounded border text-[11px] transition ${
                  searchQuery === term
                    ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300"
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Chunks List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 rounded-xl bg-slate-800/50 animate-pulse" />
              ))}
            </div>
          ) : filteredChunks.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">
              No chunks match query &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredChunks.map((chunk) => (
              <div
                key={chunk.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                      {chunk.id}
                    </span>
                    {chunk.metadata.section && (
                      <span className="font-mono text-slate-300 font-semibold">
                        Section {chunk.metadata.section}:
                      </span>
                    )}
                    <span className="font-semibold text-slate-200">
                      {chunk.metadata.title || "Handbook Excerpt"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(chunk.id, chunk.text)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 opacity-80 group-hover:opacity-100 transition"
                    title="Copy chunk text"
                  >
                    {copiedChunkId === chunk.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-mono">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {chunk.text}
                </p>
                <div className="text-[10px] text-slate-500 font-mono pt-1 flex items-center justify-between">
                  <span>Length: {chunk.text.length} chars</span>
                  <span>
                    Chunk {chunk.metadata.chunkIndex} of {chunk.metadata.totalChunks || chunks.length}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>
            Showing {filteredChunks.length} of {chunks.length} chunks
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-sans font-medium"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
