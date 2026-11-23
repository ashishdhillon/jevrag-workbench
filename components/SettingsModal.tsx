"use client";

import React, { useState } from "react";
import { X, Sliders, Key, Cpu, RotateCcw, Check, Sparkles } from "lucide-react";

export interface SettingsState {
  demoMode: boolean;
  sufficiencyThreshold: number;
  jevApiKey: string;
  jevBaseUrl: string;
  openAiApiKey: string;
  openAiBaseUrl: string;
  llmModel: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
  onSave: (newSettings: SettingsState) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<SettingsState>(settings);

  if (!isOpen) return null;

  const handleReset = () => {
    setLocalSettings({
      demoMode: true,
      sufficiencyThreshold: 0.7,
      jevApiKey: "",
      jevBaseUrl: "https://api.typesafe.ai/v1/systemone",
      openAiApiKey: "",
      openAiBaseUrl: "https://api.openai.com/v1",
      llmModel: "gpt-4o",
    });
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Workbench Settings & API Keys</h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Configure models, Sufficiency Gate threshold, and live keys
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

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Demo Mode Toggle */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Demo / Mock Mode (Active by default)
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Uses calibrated traces and local vectors without requiring external API keys.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.demoMode}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, demoMode: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Sufficiency Gate Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <label htmlFor="sufficiency-slider">Stage 3 Sufficiency Gate Threshold</label>
              <span className="font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30">
                {(localSettings.sufficiencyThreshold * 100).toFixed(0)}%
              </span>
            </div>
            <input
              id="sufficiency-slider"
              type="range"
              min="0.50"
              max="0.95"
              step="0.05"
              value={localSettings.sufficiencyThreshold}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  sufficiencyThreshold: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.50 (Permissive)</span>
              <span>0.70 (Default)</span>
              <span>0.95 (Strict Zero-Hallucination)</span>
            </div>
          </div>

          {/* Jev System One Configuration */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>TypeSafe AI Jev Configuration</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Jev API Key</label>
                <input
                  type="password"
                  placeholder="jev_live_..."
                  value={localSettings.jevApiKey}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, jevApiKey: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 font-mono text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Jev API Endpoint</label>
                <input
                  type="text"
                  value={localSettings.jevBaseUrl}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, jevBaseUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 font-mono text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Generator LLM Configuration */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-400" />
              <span>Generator LLM (OpenAI / OpenRouter / Local)</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">LLM API Key</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={localSettings.openAiApiKey}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, openAiApiKey: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-200 font-mono text-xs outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Base URL</label>
                  <input
                    type="text"
                    value={localSettings.openAiBaseUrl}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, openAiBaseUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-200 font-mono text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Model Name</label>
                  <input
                    type="text"
                    value={localSettings.llmModel}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, llmModel: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-200 font-mono text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
