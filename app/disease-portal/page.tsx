"use client";

import Link from "next/link";
import { ArrowLeft, Activity } from "lucide-react";

export default function DiseasePortal() {
  const diseases = ["Cancer", "Alzheimer’s", "Parkinson’s", "Diabetes"];

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 via-black to-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.26),_transparent_55%)] opacity-60" />

      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500 transition-colors hover:text-teal-300"
        >
          <ArrowLeft size={14} /> Back to overview
        </Link>

        <div className="mb-10 flex flex-col justify-between gap-8 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
              Disease-centric intelligence
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
              Navigate disease signatures, pathways, and unmet need.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
              Start from a phenotype or indication, then traverse associated
              pathways, targets, and candidate compounds to build a repositioning
              rationale that can be handed off to clinical or translational teams.
            </p>
          </div>

          <div className="flex gap-6 text-[11px] text-slate-400">
            <div className="flex flex-col border-l border-slate-800 pl-4">
              <span className="font-mono uppercase tracking-[0.22em] text-slate-500">
                View
              </span>
              <span className="mt-2 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-teal-300">
                Indication → Mechanism → Agent
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {diseases.map((d, idx) => (
            <div
              key={d}
              className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-[0_22px_80px_rgba(15,23,42,0.9)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.36),_transparent_60%)] opacity-20" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-teal-300 ring-1 ring-slate-700/80">
                    <Activity size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-50">
                      {d}
                    </span>
                    <span className="mt-1 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
                      Disease program · Track {idx + 1}
                    </span>
                  </div>
                </div>

                <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-200">
                  Cohort explorer
                </span>
              </div>

              <div className="mt-5 grid gap-3 text-xs text-slate-300">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono uppercase tracking-[0.22em] text-slate-500">
                    Pathway clusters
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-teal-300">
                    {idx === 0 && "Immune · Proliferation"}
                    {idx === 1 && "Neurodegeneration"}
                    {idx === 2 && "Dopaminergic circuits"}
                    {idx === 3 && "Metabolic · Inflammatory"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono uppercase tracking-[0.22em] text-slate-500">
                    Candidate agents
                  </span>
                  <span className="text-slate-300">
                    {idx === 0 && "29 shortlisted (6 high-confidence)"}
                    {idx === 1 && "17 shortlisted (3 high-confidence)"}
                    {idx === 2 && "12 shortlisted (2 high-confidence)"}
                    {idx === 3 && "21 shortlisted (5 high-confidence)"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono uppercase tracking-[0.22em] text-slate-500">
                    Evidence mix
                  </span>
                  <span className="text-slate-300">
                    RWD · trial registry · omics · literature
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono uppercase tracking-[0.22em]">
                  Open disease workspace
                </span>
                <span>Launch →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
