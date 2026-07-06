import Link from "next/link";
import MedicalDisclaimer from "./components/MedicalDisclaimer";
import PortalCard from "./components/PortalCard";
import EvidenceGradeBadge from "./components/EvidenceGradeBadge";
import { getAllEvidence, getPlatformStats } from "@/lib/data";

export default function HomePage() {
  const stats = getPlatformStats();
  const featuredEvidence = getAllEvidence().slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-slate-50 text-slate-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.14),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(15,23,42,0.08),_transparent_35%,_rgba(15,23,42,0.16))]" />
          <div className="mask-grid absolute inset-0 opacity-[0.35]" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 py-28 md:flex-row md:items-center md:py-32">
          <div className="max-w-xl">
            <p className="mb-6 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.24em] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_0_4px_rgba(45,212,191,0.35)]" />
              Evidence-Backed Repurposing Intelligence
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-[3.4rem] md:leading-[1.04]">
              Research intelligence for{" "}
              <span className="underline decoration-teal-500/70 decoration-[6px] underline-offset-[10px]">
                translational discovery
              </span>
              .
            </h1>

            <p className="mt-7 text-base leading-relaxed text-slate-600 sm:text-lg">
              {stats.evidenceCount} curated drug–disease evidence records with PubMed
              citations, confidence scores, and human-reviewed AI summaries—for
              hypothesis generation and portfolio triage, not patient care.
            </p>

            <MedicalDisclaimer className="mt-6 max-w-lg" variant="light" />

            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
              <div className="flex gap-6 text-xs text-slate-500">
                <div className="flex flex-col border-l border-slate-200 pl-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Drugs
                  </span>
                  <span className="mt-1 text-sm font-semibold text-slate-900">
                    {stats.drugCount} curated
                  </span>
                </div>
                <div className="flex flex-col border-l border-slate-200 pl-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Evidence records
                  </span>
                  <span className="mt-1 text-sm font-semibold text-slate-900">
                    {stats.evidenceCount} published
                  </span>
                </div>
                <div className="flex flex-col border-l border-slate-200 pl-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Avg confidence
                  </span>
                  <span className="mt-1 text-sm font-semibold text-slate-900">
                    {stats.avgConfidence}%
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-10 text-[11px] font-mono uppercase tracking-[0.24em] text-slate-500">
              Platform Build · v1.1.0 · Research Mode
            </p>
          </div>

          <div className="relative flex-1">
            <div className="relative ml-auto max-w-md rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_22px_90px_rgba(15,23,42,0.35)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                    Featured evidence
                  </p>
                  <p className="mt-1 text-sm text-slate-800">Verified drug–disease pairs</p>
                </div>
                <Link
                  href="/evidence"
                  className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-teal-300"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-3">
                {featuredEvidence.map((e) => (
                  <Link
                    key={e.slug}
                    href={`/evidence/${e.slug}`}
                    className="block rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 transition-colors hover:border-teal-500/30"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-800">{e.slug}</span>
                      <span className="text-xs font-semibold text-teal-700">
                        {e.confidenceScore}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <EvidenceGradeBadge grade={e.grade} />
                    </div>
                  </Link>
                ))}
              </div>

              <MedicalDisclaimer className="mt-4" variant="light" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-slate-800/70 bg-gradient-to-b from-navy-900 via-[#050814] to-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.11),_transparent_55%)] opacity-80" />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/80">
                Core analytical portals
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                Four entities. One evidence layer.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
                Drugs, diseases, targets, and evidence records—each with graded
                citations, confidence scores, and downloadable reports.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <PortalCard
              title="Drugs"
              subtitle="Compound profiles with why-this-drug rationale, known risks, and linked evidence."
              href="/drugs"
              icon="database"
            />
            <PortalCard
              title="Diseases"
              subtitle="Indication workspaces with pathway clusters, unmet need, and candidate agents."
              href="/diseases"
              icon="activity"
            />
            <PortalCard
              title="Targets"
              subtitle="Molecular targets with druggability, modulating compounds, and disease links."
              href="/targets"
              icon="target"
            />
            <PortalCard
              title="Evidence"
              subtitle="Drug–disease evidence records with PubMed, trials, FDA labels, and AI transparency."
              href="/evidence"
              icon="database"
            />
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/audiences"
              className="inline-flex rounded-full bg-teal-500/10 px-6 py-3 text-[11px] font-mono uppercase tracking-[0.2em] text-teal-300 ring-1 ring-teal-500/30 hover:bg-teal-500/20"
            >
              Solutions for Pharma · Biotech · Academia · Investors · Researchers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
