"use client";

import PortalCard from "./components/PortalCard";

export default function HomePage() {
  return (
    <>
      {/* HERO (LIGHT) */}
      <section className="relative overflow-hidden bg-slate-50 text-slate-900">
        {/* editorial grid + vignette */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.14),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(15,23,42,0.08),_transparent_35%,_rgba(15,23,42,0.16))]" />
          <div className="mask-grid absolute inset-0 opacity-[0.35]" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 pb-28 pt-8 md:flex-row md:items-center md:pb-32 md:pt-10">
          {/* Left column: purpose */}
          <div className="max-w-xl">
            <p className="mb-6 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.24em] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_0_4px_rgba(45,212,191,0.35)]" />
              Computational Drug Repurposing Stack
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-[3.4rem] md:leading-[1.04]">
              Repositioning intelligence for{" "}
              <span className="underline decoration-teal-500/70 decoration-[6px] underline-offset-[10px]">
                translational discovery
              </span>
              .
            </h1>

            <p className="mt-7 text-base leading-relaxed text-slate-600 sm:text-lg">
              A premium research environment for systematically exploring drug,
              disease, and target spaces—designed for hypothesis generation,
              portfolio triage, and mechanistic insight at scale.
            </p>

            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-900 to-navy-900 text-teal-300 shadow-lg shadow-slate-700/40" />
                <div className="flex flex-col">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
                    Built for investigators
                  </span>
                  <span className="text-sm text-slate-800">
                    Bench-to-portfolio decision support in one interface.
                  </span>
                </div>
              </div>

              <div className="flex gap-6 text-xs text-slate-500">
                <div className="flex flex-col border-l border-slate-200 pl-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Cohorts
                  </span>
                  <span className="mt-1 text-sm font-semibold text-slate-900">
                    2.4M+ patients
                  </span>
                </div>
                <div className="flex flex-col border-l border-slate-200 pl-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Compounds
                  </span>
                  <span className="mt-1 text-sm font-semibold text-slate-900">
                    18K+ entities
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-10 text-[11px] font-mono uppercase tracking-[0.24em] text-slate-500">
              Platform Build · v1.0.4 · Research Mode
            </p>
          </div>

          {/* Right column: premium analytics vignette */}
          <div className="relative flex-1">
            <div className="relative ml-auto max-w-md rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_22px_90px_rgba(15,23,42,0.35)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                    Live analytical sketch
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    Drug × Disease × Target surface
                  </p>
                </div>
                <div className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-teal-300">
                  In silico
                </div>
              </div>

              <div className="relative mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.16),_transparent_60%)]" />
                <div className="relative grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-xl border border-slate-200/80 bg-white/70 shadow-[0_14px_40px_rgba(15,23,42,0.15)]"
                    >
                      <div className="flex h-full flex-col justify-between p-2">
                        <div className="h-1.5 w-8 rounded-full bg-slate-200" />
                        <div className="flex items-end gap-0.5">
                          <div className="h-4 flex-1 rounded-full bg-slate-200" />
                          <div className="h-6 flex-1 rounded-full bg-teal-400/80" />
                          <div className="h-3 flex-1 rounded-full bg-slate-200" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono uppercase tracking-[0.22em]">
                  Ranked repositioning candidates
                </span>
                <span>Top decile · Signal-to-noise filtered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULES (DARK) */}
      <section className="relative border-t border-slate-800/70 bg-gradient-to-b from-navy-900 via-[#050814] to-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.11),_transparent_55%)] opacity-80" />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/80">
                Core analytical portals
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                Three lenses on the same therapeutic landscape.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
                Move fluidly between compound-, indication-, and target-centric
                perspectives. Each portal is tuned for exploratory analysis,
                signal triage, and hypothesis handoff.
              </p>
            </div>

            <div className="flex gap-6 text-[11px] text-slate-400">
              <div className="flex flex-col">
                <span className="font-mono uppercase tracking-[0.22em] text-slate-500">
                  Session context
                </span>
                <span className="mt-2 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-teal-300">
                  Single workspace · Linked evidence
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <PortalCard
              title="Drug-Based Analysis"
              subtitle="Systematic evaluation of approved and experimental compounds to uncover alternative indications and off-pathway opportunity."
              href="/drug"
              icon="database"
            />

            <PortalCard
              title="Disease-Based Analysis"
              subtitle="Phenotype- and pathway-driven exploration of disease signatures to surface repurposable agents with mechanistic plausibility."
              href="/disease-portal"
              icon="activity"
            />

            <PortalCard
              title="Target-Based Analysis"
              subtitle="Deep investigation of molecular targets, perturbation profiles, and genetic associations to reveal non-obvious therapeutic routes."
              href="/target-portal"
              icon="target"
            />
          </div>
        </div>
      </section>
    </>
  );
}
