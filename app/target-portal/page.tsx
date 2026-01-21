"use client";

import Link from "next/link";
import { ArrowLeft, Target } from "lucide-react";

export default function TargetPortal() {
  const targets = ["TP53", "EGFR", "ACE2", "MTOR"];

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 via-black to-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.3),_transparent_55%)] opacity-60" />

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
              Target-centric intelligence
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
              Follow perturbation profiles from target to therapy concept.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
              Begin from a molecular target and traverse interacting ligands,
              pathways, and genetic associations to surface non-obvious therapeutic
              routes and repurposing candidates.
            </p>
          </div>

          <div className="flex gap-6 text-[11px] text-slate-400">
            <div className="flex flex-col border-l border-slate-800 pl-4">
              <span className="font-mono uppercase tracking-[0.22em] text-slate-500">
                Focus
              </span>
              <span className="mt-2 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-teal-300">
                Targets · Networks · Perturbations
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {targets.map((t, idx) => (
            <div
              key={t}
              className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-[0_22px_80px_rgba(15,23,42,0.9)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.4),_transparent_60%)] opacity-25" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-teal-300 ring-1 ring-slate-700/80">
                    <Target size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-semibold text-slate-50">
                      {t}
                    </span>
                    <span className="mt-1 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
                      Target program · Node {idx + 1}
                    </span>
                  </div>
                </div>

                <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-200">
                  Network view
                </span>
              </div>

              <div className="mt-5 grid gap-3 text-xs text-slate-300">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono uppercase tracking-[0.22em] text-slate-500">
                    Ligand space
                  </span>
                  <span className="text-slate-300">
                    {idx === 0 && "Small molecules · biologics"}
                    {idx === 1 && "Inhibitors · antibodies"}
                    {idx === 2 && "Host–virus interface"}
                    {idx === 3 && "mTOR axis modulators"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono uppercase tracking-[0.22em] text-slate-500">
                    Genetic associations
                  </span>
                  <span className="text-slate-300">
                    GWAS · rare variants · expression
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono uppercase tracking-[0.22em] text-slate-500">
                    Candidate directions
                  </span>
                  <span className="text-slate-300">
                    Repurposing · combination · de-risking
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono uppercase tracking-[0.22em]">
                  Open target workspace
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
