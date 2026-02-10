"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Beaker, Activity } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { searchDiseases } from "../data/pipeline";
import { slugify } from "../utils/slug";
import type { DiseaseProfile, DrugProfile } from "../data/types";

function filterDrugs(drugs: DrugProfile[], q: string): DrugProfile[] {
  if (!q.trim()) return [];
  const lower = q.toLowerCase().trim();
  return drugs.filter(
    (d) => d.name.toLowerCase().includes(lower) || d.id.toLowerCase().includes(lower)
  );
}

export default function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [drugsFromSheet, setDrugsFromSheet] = useState<DrugProfile[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
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

  // Enter: drug → approved list only; disease → list match or any-disease AI profile
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const qLower = q.toLowerCase();
    const exactDrug =
      drugsFromSheet.find((d) => d.id.toLowerCase() === qLower) ||
      drugsFromSheet.find((d) => d.name.toLowerCase() === qLower);
    if (exactDrug) {
      setShowDropdown(false);
      router.push(`/drug/${exactDrug.id}`);
      return;
    }
    const exactDisease =
      searchDiseases(q).find((d) => d.id.toLowerCase() === qLower) ||
      searchDiseases(q).find((d) => d.name.toLowerCase() === qLower);
    if (exactDisease) {
      setShowDropdown(false);
      router.push(`/disease-portal/${exactDisease.id}`);
      return;
    }
    setShowDropdown(false);
    router.push(`/disease-portal/${slugify(q)}`);
  };

  return (
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
          placeholder="Search approved drugs or any disease…"
          className="w-56 rounded-lg border border-slate-700 bg-slate-900/80 py-1.5 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
          aria-label="Search drugs and diseases"
        />
      </div>

      {showDropdown && (drugs.length > 0 || diseases.length > 0 || query.trim()) && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-slate-800 bg-slate-950/95 py-2 shadow-xl backdrop-blur">
          <div className="max-h-64 overflow-y-auto">
            {drugs.length > 0 && (
              <div className="px-2 py-1">
                <p className="mb-1 px-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                  Approved drugs
                </p>
                {drugs.slice(0, 8).map((d) => (
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
                  Diseases (curated)
                </p>
                {diseases.slice(0, 8).map((d) => (
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
            {query.trim() && (
              <div className="border-t border-slate-800 px-2 py-2">
                <p className="mb-1 px-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                  Any disease (AI profile)
                </p>
                <Link
                  href={`/disease-portal/${slugify(query.trim())}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-teal-200 hover:bg-slate-800/80"
                  onClick={() => setShowDropdown(false)}
                >
                  <Activity className="h-4 w-4 text-teal-400/80" />
                  View AI profile for &quot;{query.trim()}&quot;
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
