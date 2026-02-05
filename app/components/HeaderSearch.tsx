"use client";

import Link from "next/link";
import { Search, Beaker, Activity } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { searchDiseases } from "../data/pipeline";
import type { DrugProfile } from "../data/types";
import DeepResearchPanel, { type DeepResearchResponse } from "./DeepResearchPanel";

function filterDrugs(drugs: DrugProfile[], q: string): DrugProfile[] {
  if (!q.trim()) return [];
  const lower = q.toLowerCase().trim();
  return drugs.filter(
    (d) => d.name.toLowerCase().includes(lower) || d.id.toLowerCase().includes(lower)
  );
}

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [drugsFromSheet, setDrugsFromSheet] = useState<DrugProfile[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTitle, setPanelTitle] = useState("");
  const [deepLoading, setDeepLoading] = useState(false);
  const [deepError, setDeepError] = useState<string | null>(null);
  const [deepData, setDeepData] = useState<DeepResearchResponse | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/drugs")
      .then((r) => r.ok ? r.json() : [])
      .then(setDrugsFromSheet)
      .catch(() => setDrugsFromSheet([]));
  }, []);

  const drugs = filterDrugs(drugsFromSheet, query);
  const diseases = query.trim() ? searchDiseases(query) : [];
  const hasResults = drugs.length > 0 || diseases.length > 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const runDeepResearch = async (searchText: string) => {
    const text = searchText.trim() || query.trim();
    if (!text) return;
    setPanelOpen(true);
    setPanelTitle(text);
    setDeepError(null);
    setDeepLoading(true);
    setDeepData(null);
    setShowDropdown(false);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: text }],
        }),
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || "Deep research request failed.");
      }
      const json = (await res.json()) as DeepResearchResponse;
      setDeepData(json);
    } catch (err) {
      setDeepError(
        err instanceof Error ? err.message : "Unexpected error running deep research."
      );
    } finally {
      setDeepLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runDeepResearch(query);
    }
  };

  return (
    <>
      <div ref={wrapperRef} className="relative flex items-center gap-2">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => hasResults && setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search drugs, diseases…"
            className="w-56 rounded-lg border border-slate-700 bg-slate-900/80 py-1.5 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
            aria-label="Search drugs and diseases"
          />
        </div>
        <button
          type="button"
          onClick={() => runDeepResearch(query)}
          className="rounded-lg border border-teal-500/60 bg-teal-950/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-200 ring-1 ring-teal-500/30 transition-colors hover:bg-teal-900/40"
        >
          Deep research
        </button>

        {showDropdown && (drugs.length > 0 || diseases.length > 0) && (
          <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-slate-800 bg-slate-950/95 py-2 shadow-xl backdrop-blur">
            <div className="max-h-64 overflow-y-auto">
              {drugs.length > 0 && (
                <div className="px-2 py-1">
                  <p className="mb-1 px-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                    Drugs
                  </p>
                  {drugs.slice(0, 5).map((d) => (
                    <Link
                      key={d.id}
                      href={`/drug/${d.id}`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/80"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Beaker className="h-4 w-4 text-teal-400/80" />
                      {d.name}
                    </Link>
                  ))}
                </div>
              )}
              {diseases.length > 0 && (
                <div className="px-2 py-1">
                  <p className="mb-1 px-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                    Diseases
                  </p>
                  {diseases.slice(0, 5).map((d) => (
                    <Link
                      key={d.id}
                      href={`/disease-portal/${d.id}`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/80"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Activity className="h-4 w-4 text-cyan-400/80" />
                      {d.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-slate-800 px-3 py-2">
              <button
                type="button"
                onClick={() => runDeepResearch(query)}
                className="w-full rounded-lg bg-teal-950/60 py-2 text-xs font-medium text-teal-200 ring-1 ring-teal-500/30 hover:bg-teal-900/50"
              >
                Send &quot;{query || "this"}&quot; to Deep Research
              </button>
            </div>
          </div>
        )}
      </div>

      <DeepResearchPanel
        open={panelOpen}
        onClose={() => {
          setPanelOpen(false);
          setDeepError(null);
          setDeepData(null);
        }}
        title={panelTitle ? `Query: ${panelTitle}` : "Deep Research"}
        loading={deepLoading}
        error={deepError}
        data={deepData}
      />
    </>
  );
}
