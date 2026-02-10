"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Activity,
  Brain,
  Clock,
  Info,
  AlertTriangle,
} from "lucide-react";
import { getDiseaseById } from "../../data/pipeline";
import type { DiseaseProfile, EvidenceRecord, EvidenceTier } from "../../data/types";
import { use, useState, useEffect } from "react";

type DeepResearchResponse = {
  snapshot: {
    drugClass: string | null;
    primaryApprovedIndications: string[];
    mechanismsOfAction: string[];
    keyPathways: string[];
    overallConfidence: "Low" | "Medium" | "High";
  };
  mechanisticRationale: string;
  evidence: {
    approved: { indication: string; studyType: string; summary: string; clinicalRelevance: string }[];
    supportive: { strength: string; summary: string; limitations: string }[];
    investigational: { status: string; summary: string; translationalPotential: string }[];
  };
  evidenceTimeline: (string | { year?: number; finding?: string })[];
  evidenceSummary: { solid: string; promising: string; speculative: string };
  confidenceAndCaveats: {
    evidenceGaps: string;
    confounders: string;
    safetyRisks: string;
    regulatoryLimitations: string;
    interpretationWarnings: string;
  };
  dataSources: string[];
};

function formatTimelineStep(step: unknown): string {
  if (typeof step === "string") return step;
  if (step && typeof step === "object") {
    const s = step as Record<string, unknown>;
    const year = s.year ?? s.date ?? s.timepoint;
    const desc = s.finding ?? s.event ?? s.description ?? s.summary ?? s.note;
    if (year && desc) return `${year}: ${desc}`;
    if (desc) return String(desc);
    if (year) return String(year);
    try {
      return JSON.stringify(step);
    } catch {
      return String(step);
    }
  }
  return String(step);
}

function getEvidenceStrength(tier: EvidenceTier, quality?: string): "High" | "Medium" | "Low" {
  if (tier === "Approved") return "High";
  if (tier === "Supportive" && quality === "RCT") return "High";
  if (tier === "Supportive") return "Medium";
  return "Low";
}

function EvidenceSection({
  id,
  title,
  evidence,
  icon: Icon,
  iconColor,
  borderColor,
  bgColor,
  isExpanded,
  onToggle,
}: {
  id: string;
  title: string;
  evidence: EvidenceRecord[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  borderColor: string;
  bgColor: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <section
      id={id}
      className={`rounded-2xl border ${borderColor} ${bgColor} shadow-[0_26px_90px_rgba(15,23,42,0.9)] overflow-hidden`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-slate-900/20"
      >
        <div className="flex items-center gap-3">
          <Icon className={iconColor} size={20} />
          <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
          <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">
            {evidence.length} {evidence.length === 1 ? "record" : "records"}
          </span>
        </div>
        {isExpanded ? <ChevronUp className="text-slate-400" size={20} /> : <ChevronDown className="text-slate-400" size={20} />}
      </button>

      {isExpanded && (
        <div className="border-t border-slate-800/50 bg-slate-900/20 p-6">
          <div className="space-y-4">
            {evidence.map((e, idx) => {
              const strength = getEvidenceStrength(e.tier, e.quality);
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 transition-all hover:border-slate-700/80 hover:bg-slate-900/60"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] ${
                        e.tier === "Approved"
                          ? "bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-800/50"
                          : e.tier === "Supportive"
                          ? "bg-cyan-950/40 text-cyan-300 ring-1 ring-cyan-800/50"
                          : "bg-amber-950/40 text-amber-300 ring-1 ring-amber-800/50"
                      }`}
                    >
                      {e.tier}
                    </span>
                    {e.quality && (
                      <span className="inline-flex items-center rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                        {e.quality}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                      {e.source}
                    </span>
                    <span className="text-xs text-slate-500">{e.year}</span>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="flex h-1.5 w-16 items-center gap-0.5 rounded-full bg-slate-800/80 p-0.5">
                        <div
                          className={`h-full rounded-full ${
                            strength === "High"
                              ? "w-full bg-emerald-500"
                              : strength === "Medium"
                              ? "w-2/3 bg-amber-500"
                              : "w-1/3 bg-slate-600"
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-slate-500">{strength}</span>
                    </div>
                  </div>
                  <h3 className="mb-2 text-base font-medium leading-snug text-slate-100">{e.title}</h3>
                  {e.notes && <p className="mb-4 text-sm leading-relaxed text-slate-400">{e.notes}</p>}
                  <a
                    href={e.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-300 transition-colors hover:text-teal-200"
                  >
                    View source <ExternalLink size={14} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function DiseaseProfilePageClient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const disease: DiseaseProfile | undefined = getDiseaseById(resolvedParams.id);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["approved", "supportive", "investigational"])
  );
  const [deepLoading, setDeepLoading] = useState(false);
  const [deepError, setDeepError] = useState<string | null>(null);
  const [deepData, setDeepData] = useState<DeepResearchResponse | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    if (!disease) return;
    const prompt = [
      `Disease-centric deep research on repurposing opportunities for ${disease.name} (id: ${disease.id}).`,
      `Pathway clusters: ${disease.pathwayClusters.join(", ") || "none listed"}.`,
      `Candidate drugs: ${disease.candidateDrugs.map((d) => d.drugName).join(", ") || "none listed"}.`,
      "Synthesize disease biology, unmet need, evidence tiers, and conservative repurposing options. Output the same JSON schema as for drugs (snapshot, evidence, timeline, summary, caveats, dataSources).",
    ].join(" ");
    setDeepLoading(true);
    setDeepError(null);
    setDeepData(null);
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }], context: "disease" }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((b) => Promise.reject(new Error(b.error || "Failed to build profile.")));
        return res.json();
      })
      .then((json: DeepResearchResponse) => setDeepData(json))
      .catch((err) => setDeepError(err instanceof Error ? err.message : "Failed to build profile."))
      .finally(() => setDeepLoading(false));
  }, [disease, retryTrigger]);

  if (!disease) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-navy-900 via-black to-black">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-8 text-center">
            <p className="text-lg font-medium text-red-400">Disease not found</p>
            <p className="mt-2 text-sm text-slate-400">ID: {resolvedParams.id}</p>
            <Link
              href="/disease-portal"
              className="mt-6 inline-flex items-center gap-2 text-sm text-teal-300 hover:text-teal-200"
            >
              <ArrowLeft size={16} /> Back to disease list
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (deepLoading && !deepData && !deepError) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-navy-900 via-black to-black">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="text-slate-400">Building evidence profile…</p>
          <p className="mt-2 text-sm text-slate-500">Synthesizing disease intelligence for {disease.name}.</p>
          <div className="mt-6 h-2 w-48 mx-auto animate-pulse rounded-full bg-teal-500/30" />
        </div>
      </main>
    );
  }

  const byTier = (tier: EvidenceTier): EvidenceRecord[] =>
    disease.evidence.filter((e) => e.tier === tier);
  const approvedCount = deepData ? (deepData.evidence?.approved?.length ?? 0) : byTier("Approved").length;
  const supportiveCount = deepData ? (deepData.evidence?.supportive?.length ?? 0) : byTier("Supportive").length;
  const investigationalCount = deepData ? (deepData.evidence?.investigational?.length ?? 0) : byTier("Investigational").length;
  const totalEvidence = deepData ? approvedCount + supportiveCount + investigationalCount : disease.evidence.length;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 via-black to-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.26),_transparent_55%)] opacity-60" />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-8">
        <Link
          href="/disease-portal"
          className="mb-10 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500 transition-colors hover:text-teal-300"
        >
          <ArrowLeft size={14} /> Back to disease list
        </Link>

        {deepError && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/30 p-4 flex items-center justify-between gap-4">
            <p className="text-sm text-red-200">{deepError}</p>
            <button
              onClick={() => { setDeepError(null); setRetryTrigger((t) => t + 1); }}
              className="rounded-lg border border-red-500/50 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-900/40"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/80 text-teal-300 ring-1 ring-slate-700/80">
                <Activity size={22} />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
                  {disease.name}
                </h1>
                <p className="mt-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
                  Disease-centric evidence profile
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Snapshot — AI when deepData, else curated */}
        <section className="mb-12 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
          <div className="mb-6 flex items-center gap-3">
            <Activity className="text-teal-400" size={20} />
            <h2 className="text-lg font-semibold text-slate-50">Disease Snapshot</h2>
          </div>

          {deepData?.snapshot ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Disease class</p>
                  <p className="text-base font-medium text-slate-200">{deepData.snapshot.drugClass ?? "Not specified"}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Key phenotypes / indications</p>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {deepData.snapshot.primaryApprovedIndications?.length
                      ? deepData.snapshot.primaryApprovedIndications.join(", ")
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Key pathways</p>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {deepData.snapshot.keyPathways?.length
                      ? deepData.snapshot.keyPathways.join(", ")
                      : disease.pathwayClusters.join(", ") || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Overall confidence</p>
                  <span className="text-sm font-medium text-slate-200">{deepData.snapshot.overallConfidence}</span>
                </div>
                <div>
                  <p className="mb-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Total evidence records</p>
                  <p className="text-2xl font-semibold text-teal-300">{totalEvidence}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Pathway clusters</p>
                  <div className="flex flex-wrap gap-2">
                    {disease.pathwayClusters.map((p, i) => (
                      <span key={i} className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-700/80">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Total evidence records</p>
                  <p className="text-2xl font-semibold text-teal-300">{totalEvidence}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Candidate drugs</p>
                  <p className="text-lg font-medium text-slate-200">{disease.candidateDrugs.length}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl border border-slate-800/50 bg-slate-900/40 p-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-emerald-400">{approvedCount}</p>
              <p className="mt-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-cyan-400">{supportiveCount}</p>
              <p className="mt-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">Supportive</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-amber-400">{investigationalCount}</p>
              <p className="mt-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">Investigational</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-slate-300">Candidate compounds</p>
            <div className="flex flex-wrap gap-2">
              {disease.candidateDrugs.map((c) => (
                <Link key={c.drugId} href={`/drug/${c.drugId}`} className="inline-flex items-center rounded-full bg-teal-950/40 px-3 py-1 text-xs font-medium text-teal-300 ring-1 ring-teal-800/50 hover:bg-teal-900/50">
                  {c.drugName} →
                </Link>
              ))}
            </div>
          </div>
        </section>

        {deepData && (
          <>
            <section className="mb-12 rounded-2xl border border-teal-800/50 bg-teal-950/20 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
              <div className="mb-3 flex items-center gap-2">
                <Brain className="text-teal-400" size={18} />
                <h3 className="text-sm font-semibold text-slate-200">AI-Generated Repurposing Rationale</h3>
              </div>
              <p className="leading-relaxed text-slate-300">{deepData.mechanisticRationale}</p>
            </section>

            <section className="mb-12 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="text-slate-400" size={18} />
                <h3 className="text-sm font-semibold text-slate-200">Evidence Timeline</h3>
              </div>
              {deepData.evidenceTimeline?.length ? (
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                  {deepData.evidenceTimeline.map((step, idx) => (
                    <li key={idx}>{formatTimelineStep(step)}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">No timeline narrative provided.</p>
              )}
            </section>

            {(approvedCount > 0 || supportiveCount > 0 || investigationalCount > 0) && (
              <div className="space-y-6">
                {deepData.evidence?.approved?.length > 0 && (
                  <section className="rounded-2xl border border-emerald-800/50 bg-emerald-950/20 overflow-hidden shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
                    <button onClick={() => toggleSection("approved")} className="flex w-full items-center justify-between p-6 text-left hover:bg-slate-900/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-400" size={20} />
                        <h2 className="text-lg font-semibold text-slate-50">Approved Evidence</h2>
                        <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">{deepData.evidence.approved.length} records</span>
                      </div>
                      {expandedSections.has("approved") ? <ChevronUp className="text-slate-400" size={20} /> : <ChevronDown className="text-slate-400" size={20} />}
                    </button>
                    {expandedSections.has("approved") && (
                      <div className="border-t border-slate-800/50 bg-slate-900/20 p-6 space-y-4">
                        {deepData.evidence.approved.map((e, idx) => (
                          <div key={idx} className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6">
                            <p className="font-medium text-emerald-200">{e.indication}</p>
                            <p className="mt-1 text-xs text-slate-400">{e.studyType} · {e.clinicalRelevance}</p>
                            <p className="mt-2 text-sm text-slate-300">{e.summary}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}
                {deepData.evidence?.supportive?.length > 0 && (
                  <section className="rounded-2xl border border-cyan-800/50 bg-cyan-950/20 overflow-hidden shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
                    <button onClick={() => toggleSection("supportive")} className="flex w-full items-center justify-between p-6 text-left hover:bg-slate-900/20">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="text-cyan-400" size={20} />
                        <h2 className="text-lg font-semibold text-slate-50">Supportive Evidence</h2>
                        <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">{deepData.evidence.supportive.length} records</span>
                      </div>
                      {expandedSections.has("supportive") ? <ChevronUp className="text-slate-400" size={20} /> : <ChevronDown className="text-slate-400" size={20} />}
                    </button>
                    {expandedSections.has("supportive") && (
                      <div className="border-t border-slate-800/50 bg-slate-900/20 p-6 space-y-4">
                        {deepData.evidence.supportive.map((e, idx) => (
                          <div key={idx} className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6">
                            <p className="font-medium text-cyan-200">{e.strength}</p>
                            <p className="mt-2 text-sm text-slate-300">{e.summary}</p>
                            <p className="mt-1 text-xs text-slate-400">Limitations: {e.limitations}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}
                {deepData.evidence?.investigational?.length > 0 && (
                  <section className="rounded-2xl border border-amber-800/50 bg-amber-950/20 overflow-hidden shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
                    <button onClick={() => toggleSection("investigational")} className="flex w-full items-center justify-between p-6 text-left hover:bg-slate-900/20">
                      <div className="flex items-center gap-3">
                        <FlaskConical className="text-amber-400" size={20} />
                        <h2 className="text-lg font-semibold text-slate-50">Investigational Evidence</h2>
                        <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">{deepData.evidence.investigational.length} records</span>
                      </div>
                      {expandedSections.has("investigational") ? <ChevronUp className="text-slate-400" size={20} /> : <ChevronDown className="text-slate-400" size={20} />}
                    </button>
                    {expandedSections.has("investigational") && (
                      <div className="border-t border-slate-800/50 bg-slate-900/20 p-6 space-y-4">
                        {deepData.evidence.investigational.map((e, idx) => (
                          <div key={idx} className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6">
                            <p className="font-medium text-amber-200">{e.status}</p>
                            <p className="mt-2 text-sm text-slate-300">{e.summary}</p>
                            <p className="mt-1 text-xs text-slate-400">Translational potential: {e.translationalPotential}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}
              </div>
            )}

            {deepData.confidenceAndCaveats && (
              <section className="mt-8 rounded-2xl border border-amber-800/50 bg-amber-950/20 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
                <div className="mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-amber-400" size={18} />
                  <h3 className="text-sm font-semibold text-slate-200">Confidence & Caveats</h3>
                </div>
                <div className="space-y-3 text-sm text-slate-300">
                  <p><strong className="text-slate-200">Evidence Gaps:</strong> {deepData.confidenceAndCaveats.evidenceGaps}</p>
                  <p><strong className="text-slate-200">Confounders:</strong> {deepData.confidenceAndCaveats.confounders}</p>
                  <p><strong className="text-slate-200">Safety & Risk:</strong> {deepData.confidenceAndCaveats.safetyRisks}</p>
                  <p><strong className="text-slate-200">Regulatory:</strong> {deepData.confidenceAndCaveats.regulatoryLimitations}</p>
                  <p><strong className="text-slate-200">Interpretation:</strong> {deepData.confidenceAndCaveats.interpretationWarnings}</p>
                </div>
              </section>
            )}
          </>
        )}

        {!deepData && (
          <div className="space-y-6">
            {approvedCount > 0 && (
              <EvidenceSection id="approved" title="Approved Evidence" evidence={byTier("Approved")} icon={CheckCircle2} iconColor="text-emerald-400" borderColor="border-emerald-800/50" bgColor="bg-emerald-950/20" isExpanded={expandedSections.has("approved")} onToggle={() => toggleSection("approved")} />
            )}
            {supportiveCount > 0 && (
              <EvidenceSection id="supportive" title="Supportive Evidence" evidence={byTier("Supportive")} icon={AlertCircle} iconColor="text-cyan-400" borderColor="border-cyan-800/50" bgColor="bg-cyan-950/20" isExpanded={expandedSections.has("supportive")} onToggle={() => toggleSection("supportive")} />
            )}
            {investigationalCount > 0 && (
              <EvidenceSection id="investigational" title="Investigational Evidence" evidence={byTier("Investigational")} icon={FlaskConical} iconColor="text-amber-400" borderColor="border-amber-800/50" bgColor="bg-amber-950/20" isExpanded={expandedSections.has("investigational")} onToggle={() => toggleSection("investigational")} />
            )}
          </div>
        )}

        {/* Summary */}
        <section className="mt-12 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="text-teal-400" size={20} />
            <h2 className="text-lg font-semibold text-slate-50">Evidence Summary</h2>
          </div>
          {deepData?.evidenceSummary ? (
            <div className="space-y-4 text-slate-300">
              <p><strong className="text-slate-200">Solid:</strong> {deepData.evidenceSummary.solid}</p>
              <p><strong className="text-slate-200">Promising:</strong> {deepData.evidenceSummary.promising}</p>
              <p><strong className="text-slate-200">Speculative:</strong> {deepData.evidenceSummary.speculative}</p>
            </div>
          ) : (
            <p className="leading-relaxed text-slate-300">{disease.summary}</p>
          )}
        </section>

        {/* Sources */}
        <section className="mt-8 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
          <div className="mb-4 flex items-center gap-2">
            <Info className="text-slate-400" size={18} />
            <h3 className="text-sm font-semibold text-slate-200">Data Sources</h3>
          </div>
          <div className="space-y-2 text-sm text-slate-400">
            {deepData?.dataSources?.length ? deepData.dataSources.map((src, idx) => <p key={idx}>• {src}</p>) : (<><p>• PubMed (National Library of Medicine)</p><p>• ClinicalTrials.gov (U.S. National Institutes of Health)</p><p>• Manually curated evidence records</p></>)}
            <p className="mt-4 text-xs text-slate-500">Last updated: <span className="font-mono">{disease.lastUpdated}</span></p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500"><strong className="text-slate-400">AI synthesis:</strong> This profile is generated by AI for research support only. Not clinical advice.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function DiseaseProfilePage({ params }: { params: Promise<{ id: string }> }) {
  return <DiseaseProfilePageClient params={params} />;
}
