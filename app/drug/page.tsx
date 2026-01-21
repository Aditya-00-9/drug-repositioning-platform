"use client";

import Link from "next/link";
import { ArrowLeft, Beaker } from "lucide-react";

export default function DrugPortal() {
  const drugs = ["Metformin", "Sildenafil", "Rapamycin", "Thalidomide"];

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 via-black to-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.24),_transparent_55%)] opacity-60" />

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
              Drug-centric intelligence
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
              Prioritise compounds for repositioning with real-world signal.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
              Explore a structured view of approved, experimental, and shelved
              molecules. Each row can expand into indications, outcomes, and
              mechanistic rationale.
            </p>
          </div>

          <div className="flex gap-6 text-[11px] text-slate-400">
            <div className="flex flex-col border-l border-slate-800 pl-4">
              <span className="font-mono uppercase tracking-[0.22em] text-slate-500">
                Mode
              </span>
              <span className="mt-2 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-teal-300">
                Discovery · Repurposing
              </span>
            </div>
            <div className="hidden flex-col border-l border-slate-800 pl-4 md:flex">
              <span className="font-mono uppercase tracking-[0.22em] text-slate-500">
                View
              </span>
              <span className="mt-2 text-sm text-slate-200">
                Ranked by opportunity / risk
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
          <div className="grid grid-cols-[1.2fr,1fr,1fr,0.8fr] gap-4 border-b border-slate-800/80 bg-slate-900/80 px-6 py-3 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">
            <span>Compound</span>
            <span>Primary indication</span>
            <span>Repurposing signal</span>
            <span className="text-right">Profile</span>
          </div>

          <div className="divide-y divide-slate-900/80">
            {drugs.map((d, idx) => (
              <div
                key={d}
                className="grid grid-cols-[1.2fr,1fr,1fr,0.8fr] items-center gap-4 px-6 py-4 hover:bg-slate-900/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-teal-300 ring-1 ring-slate-700/80">
                    <Beaker size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-50">
                      {d}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                      Tier {idx + 1} · Shortlist
                    </span>
                  </div>
                </div>

                <div className="text-sm text-slate-300">
                  {idx === 0 && "Type 2 diabetes"}
                  {idx === 1 && "Pulmonary arterial hypertension"}
                  {idx === 2 && "Oncology (multiple)"}
                  {idx === 3 && "Multiple myeloma"}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="flex h-6 items-center gap-1 rounded-full bg-slate-900/80 px-2 text-[10px] font-mono uppercase tracking-[0.2em] text-teal-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                    High signal
                  </div>
                  <span className="hidden text-slate-500 md:inline">
                    Real-world outcomes + omics
                  </span>
                </div>

                <div className="flex justify-end">
                  <button className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-200 ring-1 ring-slate-700/80 hover:bg-slate-800 hover:text-teal-200">
                    Open profile →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
