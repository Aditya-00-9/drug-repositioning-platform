"use client";

import Link from "next/link";
import { ArrowLeft, Activity } from "lucide-react";
import { useState } from "react";
import { searchDiseases } from "../data/pipeline";
import type { DiseaseProfile } from "../data/types";

export default function DiseasePortal() {
  const [query, setQuery] = useState("");

  const diseases: DiseaseProfile[] = searchDiseases(query);

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 via-black to-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.26),_transparent_55%)] opacity-60" />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-8">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500 transition-colors hover:text-teal-300"
        >
          <ArrowLeft size={14} /> Back to overview
        </Link>

        <div className="mb-10 flex flex-col gap-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
            Disease-centric evidence
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
            Navigate disease signatures, pathways, and unmet need
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-400">
            Start from a phenotype or indication, then traverse associated
            pathways, targets, and candidate compounds.
          </p>
          <p className="max-w-xl text-xs text-slate-500">
            Prototype view. Disease list and evidence are manually curated and
            incomplete.
          </p>
        </div>

        <div className="mb-8 max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search disease (e.g. Cancer, Alzheimer's)"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
          <div className="grid grid-cols-[1.2fr,1fr,1fr,0.8fr] gap-4 border-b border-slate-800/80 bg-slate-900/80 px-6 py-3 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">
            <span>Disease</span>
            <span>Pathway clusters</span>
            <span>Evidence signal</span>
            <span className="text-right">Profile</span>
          </div>

          <div className="divide-y divide-slate-900/80">
            {diseases.map((disease) => (
              <div
                key={disease.id}
                className="grid grid-cols-[1.2fr,1fr,1fr,0.8fr] items-center gap-4 px-6 py-4 hover:bg-slate-900/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-teal-300 ring-1 ring-slate-700/80">
                    <Activity size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-50">
                      {disease.name}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                      {disease.candidateDrugs.length} candidate{" "}
                      {disease.candidateDrugs.length === 1 ? "drug" : "drugs"}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-slate-300">
                  {disease.pathwayClusters.slice(0, 2).join(" · ")}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="flex h-6 items-center gap-1 rounded-full bg-slate-900/80 px-2 text-[10px] font-mono uppercase tracking-[0.2em] text-teal-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                    {disease.evidence.length}{" "}
                    {disease.evidence.length === 1 ? "record" : "records"}
                  </div>
                  <span className="hidden text-slate-500 md:inline">
                    {disease.evidence.some((e) => e.tier === "Approved") &&
                      "Approved · "}
                    {disease.evidence.some((e) => e.tier === "Supportive") &&
                      "Supportive · "}
                    {disease.evidence.some((e) => e.tier === "Investigational") &&
                      "Investigational"}
                  </span>
                </div>

                <div className="flex justify-end">
                  <Link
                    href={`/disease-portal/${disease.id}`}
                    className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-200 ring-1 ring-slate-700/80 hover:bg-slate-800 hover:text-teal-200"
                  >
                    Open profile →
                  </Link>
                </div>
              </div>
            ))}

            {diseases.length === 0 && (
              <div className="px-6 py-10 text-sm text-slate-500">
                No diseases match your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
