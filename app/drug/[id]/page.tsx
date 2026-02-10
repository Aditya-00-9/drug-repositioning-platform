"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Activity,
  Brain,
  Clock,
  Star,
  GitCompare,
  Info,
  AlertTriangle,
} from "lucide-react";
import type { DrugProfile, EvidenceRecord, EvidenceTier } from "../../data/types";
import { use, useState, useEffect, useRef } from "react";

type DeepResearchSnapshot = {
  drugClass: string | null;
  primaryApprovedIndications: string[];
  mechanismsOfAction: string[];
  keyPathways: string[];
  overallConfidence: "Low" | "Medium" | "High";
};

type DeepResearchEvidenceItemApproved = {
  indication: string;
  studyType: string;
  summary: string;
  clinicalRelevance: string;
};

type DeepResearchEvidenceItemSupportive = {
  strength: string;
  summary: string;
  limitations: string;
};

type DeepResearchEvidenceItemInvestigational = {
  status: string;
  summary: string;
  translationalPotential: string;
};

type DeepResearchResponse = {
  snapshot: DeepResearchSnapshot;
  mechanisticRationale: string;
  evidence: {
    approved: DeepResearchEvidenceItemApproved[];
    supportive: DeepResearchEvidenceItemSupportive[];
    investigational: DeepResearchEvidenceItemInvestigational[];
  };
  evidenceTimeline: string[];
  evidenceSummary: {
    solid: string;
    promising: string;
    speculative: string;
  };
  confidenceAndCaveats: {
    evidenceGaps: string;
    confounders: string;
    safetyRisks: string;
    regulatoryLimitations: string;
    interpretationWarnings: string;
  };
  dataSources: string[];
};

// Fake data generators for prototype features
function getDrugClass(drugName: string): string {
  const classes: Record<string, string> = {
    metformin: "Biguanide",
    sildenafil: "PDE5 Inhibitor",
    rapamycin: "mTOR Inhibitor",
    semaglutide: "GLP-1 Receptor Agonist",
    lidocaine: "Sodium Channel Blocker",
    aspirin: "NSAID / Antiplatelet",
    propranolol: "Beta-blocker",
  };
  return classes[drugName.toLowerCase()] || "Small Molecule";
}

function getMOA(drugName: string): string {
  const moas: Record<string, string> = {
    metformin: "AMPK activation, mitochondrial complex I inhibition",
    sildenafil: "Phosphodiesterase type 5 (PDE5) inhibition",
    rapamycin: "mTOR pathway inhibition, immunosuppression",
    semaglutide: "GLP-1 receptor agonism, incretin mimetic",
    lidocaine: "Voltage-gated sodium channel blockade",
    aspirin: "Cyclooxygenase (COX) inhibition, platelet aggregation inhibition",
    propranolol: "Non-selective beta-adrenergic receptor blockade",
  };
  return moas[drugName.toLowerCase()] || "Mechanism under investigation";
}

function getConfidenceLevel(drug: DrugProfile): "High" | "Medium" | "Low" {
  const approvedCount = drug.evidence.filter((e) => e.tier === "Approved").length;
  const supportiveCount = drug.evidence.filter((e) => e.tier === "Supportive").length;
  if (approvedCount >= 2) return "High";
  if (approvedCount >= 1 || supportiveCount >= 2) return "Medium";
  return "Low";
}

function getEvidenceStrength(tier: EvidenceTier, quality?: string): "High" | "Medium" | "Low" {
  if (tier === "Approved") return "High";
  if (tier === "Supportive" && quality === "RCT") return "High";
  if (tier === "Supportive") return "Medium";
  return "Low";
}

function getAIInsight(drug: DrugProfile): string {
  const insights: Record<string, string> = {
    metformin:
      "Strong mechanistic rationale via AMPK pathway suggests broad metabolic and cellular effects beyond glucose control. Preclinical and observational data support investigation in neurodegeneration and oncology, though clinical validation remains limited.",
    sildenafil:
      "Vasodilatory mechanism via PDE5 inhibition extends beyond approved indications. Evidence for heart failure is mixed but suggests potential in select cardiovascular phenotypes. Altitude applications show promise but require validation.",
    rapamycin:
      "mTOR pathway's central role in aging and cellular metabolism provides strong repurposing rationale. Everolimus (analog) approvals in oncology validate pathway relevance. Aging research is highly active but early-stage.",
  };
  return insights[drug.id] || "Emerging evidence suggests repurposing potential, though clinical validation is ongoing.";
}

// Helper to present timeline steps in a readable format whether they are
// simple strings or structured objects (e.g. { year, finding }).
function formatTimelineStep(step: unknown): string {
  if (typeof step === "string") return step;
  if (step && typeof step === "object") {
    const anyStep = step as any;
    const year = anyStep.year ?? anyStep.date ?? anyStep.timepoint;
    const desc =
      anyStep.finding ??
      anyStep.event ??
      anyStep.description ??
      anyStep.summary ??
      anyStep.note;

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

function DrugProfilePageClient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [drug, setDrug] = useState<DrugProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["approved", "supportive", "investigational"]));
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [deepLoading, setDeepLoading] = useState(false);
  const [deepError, setDeepError] = useState<string | null>(null);
  const [deepData, setDeepData] = useState<DeepResearchResponse | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    setLoading(true);
    fetch(`/api/drugs/${encodeURIComponent(resolvedParams.id)}`)
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data: DrugProfile | null) => setDrug(data ?? null))
      .catch(() => setDrug(null))
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  // Auto-run AI synthesis when drug loads (or on retry).
  useEffect(() => {
    if (!drug) return;
    const prompt = [
      `Drug-centric deep research on repurposing opportunities for ${drug.name} (id: ${drug.id}).`,
      `Primary approved indications: ${drug.approvedUses.join(", ") || "none listed"}.`,
      "Focus on repurposing across drugs × diseases × molecular targets, using the specified evidence tiers and conservative interpretation. Be exhaustive and structured.",
    ].join(" ");
    setDeepLoading(true);
    setDeepError(null);
    setDeepData(null);
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }], context: "drug" }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((b) => Promise.reject(new Error(b.error || "Failed to build profile.")));
        return res.json();
      })
      .then((json: DeepResearchResponse) => setDeepData(json))
      .catch((err) => setDeepError(err instanceof Error ? err.message : "Failed to build profile."))
      .finally(() => setDeepLoading(false));
  }, [drug, retryTrigger]);

  useEffect(() => {
    if (!drug) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66% 0px" }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [drug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-navy-900 via-black to-black">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center text-slate-400">
          Loading drug from sheet…
        </div>
      </main>
    );
  }

  if (!drug) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-navy-900 via-black to-black">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-8 text-center">
            <p className="text-lg font-medium text-red-400">Drug not found</p>
            <p className="mt-2 text-sm text-slate-400">ID: {resolvedParams.id}</p>
            <Link
              href="/drug"
              className="mt-6 inline-flex items-center gap-2 text-sm text-teal-300 hover:text-teal-200"
            >
              <ArrowLeft size={16} /> Back to drug list
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
          <p className="text-slate-400">Running deep research…</p>
          <p className="mt-2 text-sm text-slate-500">GPT is building the evidence profile for {drug.name}.</p>
          <div className="mt-6 h-2 w-48 mx-auto animate-pulse rounded-full bg-teal-500/30" />
        </div>
      </main>
    );
  }

  const byTier = (tier: EvidenceTier): EvidenceRecord[] =>
    drug.evidence.filter((e) => e.tier === tier);

  const approvedCount = deepData ? (deepData.evidence?.approved?.length ?? 0) : byTier("Approved").length;
  const supportiveCount = deepData ? (deepData.evidence?.supportive?.length ?? 0) : byTier("Supportive").length;
  const investigationalCount = deepData ? (deepData.evidence?.investigational?.length ?? 0) : byTier("Investigational").length;
  const totalEvidence = deepData ? approvedCount + supportiveCount + investigationalCount : drug.evidence.length;
  const confidence = deepData?.snapshot?.overallConfidence ?? getConfidenceLevel(drug);
  const drugClass = deepData?.snapshot?.drugClass ?? getDrugClass(drug.name);
  const moa = deepData?.snapshot?.mechanismsOfAction?.join(", ") ?? getMOA(drug.name);
  const aiInsight = deepData?.mechanisticRationale ?? getAIInsight(drug);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleExportPDF = () => {
    import("jspdf")
      .then((module) => {
        const jsPDF = module.default || (module as any).jsPDF;
        if (!jsPDF) {
          throw new Error("jsPDF not found in module");
        }
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPos = margin;

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(drug.name, margin, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Approved Indications", margin, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        drug.approvedUses.forEach((use) => {
          doc.text(`• ${use}`, margin + 5, yPos);
          yPos += 6;
        });
        yPos += 5;

        const sections = [
          { tier: "Approved" as EvidenceTier, title: "Approved Evidence" },
          { tier: "Supportive" as EvidenceTier, title: "Supportive Evidence" },
          { tier: "Investigational" as EvidenceTier, title: "Investigational Evidence" },
        ];

        sections.forEach((section) => {
          const evidence = byTier(section.tier);
          if (evidence.length > 0) {
            if (yPos > 250) {
              doc.addPage();
              yPos = margin;
            }
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(section.title, margin, yPos);
            yPos += 7;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            evidence.forEach((e) => {
              if (yPos > 270) {
                doc.addPage();
                yPos = margin;
              }
              doc.text(e.title, margin + 5, yPos, { maxWidth: pageWidth - margin * 2 - 10 });
              yPos += 6;
              doc.setFontSize(9);
              doc.text(`${e.source} · ${e.year}`, margin + 5, yPos);
              yPos += 5;
              if (e.notes) {
                doc.text(e.notes, margin + 5, yPos, { maxWidth: pageWidth - margin * 2 - 10 });
                yPos += 6;
              }
              yPos += 4;
              doc.setFontSize(10);
            });
            yPos += 5;
          }
        });

        if (yPos > 250) {
          doc.addPage();
          yPos = margin;
        }
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Evidence Summary", margin, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const summaryLines = doc.splitTextToSize(drug.summary, pageWidth - margin * 2);
        summaryLines.forEach((line: string) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(line, margin, yPos);
          yPos += 6;
        });

        yPos += 5;
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Last updated: ${drug.lastUpdated}`, margin, yPos);
        yPos += 4;
        doc.text("Prototype data. Not clinical advice. For research purposes only.", margin, yPos);

        doc.save(`${drug.name.replace(/\s+/g, "_")}_Evidence_Report.pdf`);
      })
      .catch((err) => {
        console.error("PDF export failed:", err);
        alert(
          "PDF export requires jspdf. Please install it:\n\nnpm install jspdf\n\nThen refresh the page."
        );
      });
  };

  const sections = [
    { id: "snapshot", label: "Snapshot", icon: Activity },
    { id: "approved", label: "Approved", count: approvedCount, icon: CheckCircle2 },
    { id: "supportive", label: "Supportive", count: supportiveCount, icon: AlertCircle },
    { id: "investigational", label: "Investigational", count: investigationalCount, icon: FlaskConical },
    { id: "summary", label: "Summary", icon: BookOpen },
    { id: "sources", label: "Sources", icon: Info },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 via-black to-black">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.24),_transparent_55%)] opacity-60" />

      <div className="relative mx-auto max-w-6xl px-6 py-24">
        {/* Back link */}
        <Link
          href="/drug"
          className="mb-10 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500 transition-colors hover:text-teal-300"
        >
          <ArrowLeft size={14} /> Back to drug list
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

        {/* Header with actions */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/80 text-teal-300 ring-1 ring-slate-700/80">
                <FlaskConical size={22} />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
                  {drug.name}
                </h1>
                <p className="mt-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
                  Evidence intelligence profile
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex h-11 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-all ${
                isBookmarked
                  ? "border-teal-500/50 bg-teal-950/30 text-teal-200 ring-1 ring-teal-500/30"
                  : "border-slate-700/80 bg-slate-900/80 text-slate-200 ring-1 ring-slate-700/50 hover:border-slate-600/80 hover:bg-slate-800/80"
              }`}
            >
              <Star size={16} className={isBookmarked ? "fill-current" : ""} />
              {isBookmarked ? "Saved" : "Save"}
            </button>
            <button
              disabled
              className="flex h-11 items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/40 px-4 text-sm font-medium text-slate-500 opacity-50 cursor-not-allowed"
            >
              <GitCompare size={16} />
              Compare
            </button>
            <button
              onClick={handleExportPDF}
              className="flex h-11 items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/80 px-4 text-sm font-medium text-slate-200 ring-1 ring-slate-700/50 transition-all hover:border-teal-500/50 hover:bg-slate-800/80 hover:text-teal-200 hover:ring-teal-500/30"
            >
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Sticky Navigation - Tier 1 */}
        <nav className="sticky top-20 z-40 mb-8 -mx-6 px-6">
          <div className="flex gap-2 overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/80 p-2 backdrop-blur-sm">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id || (section.id === "snapshot" && !activeSection);
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-teal-950/40 text-teal-200 ring-1 ring-teal-500/30"
                      : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                  }`}
                >
                  <Icon size={14} />
                  {section.label}
                  {section.count !== undefined && (
                    <span className="ml-1 rounded-full bg-slate-800/80 px-1.5 py-0.5 text-[10px]">
                      {section.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Drug Snapshot Card - Tier 1 (Fake) */}
        <section
          id="snapshot"
          ref={(el) => {
              sectionRefs.current.snapshot = el;
            }}
          className="mb-12 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8 shadow-[0_26px_90px_rgba(15,23,42,0.9)]"
        >
          <div className="mb-6 flex items-center gap-3">
            <Activity className="text-teal-400" size={20} />
            <h2 className="text-lg font-semibold text-slate-50">Drug Snapshot</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Drug Class</p>
                <p className="text-base font-medium text-slate-200">{drugClass}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Mechanism of Action</p>
                <p className="text-sm leading-relaxed text-slate-300">{moa}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Confidence Level</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 flex-1 rounded-full ${
                      confidence === "High"
                        ? "bg-emerald-500"
                        : confidence === "Medium"
                        ? "bg-amber-500"
                        : "bg-slate-600"
                    }`}
                  />
                  <span className="text-sm font-medium text-slate-200">{confidence}</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Total Evidence Records</p>
                <p className="text-2xl font-semibold text-teal-300">{totalEvidence}</p>
              </div>
            </div>
          </div>

          {/* Evidence Count Summary - Tier 1 (Build) */}
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

          {/* Approved Indications */}
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400" size={16} />
              <p className="text-sm font-medium text-slate-300">Approved Indications</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(deepData?.snapshot?.primaryApprovedIndications?.length ? deepData.snapshot.primaryApprovedIndications : drug.approvedUses).map((use: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-800/50"
                >
                  {use}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* AI / Mechanistic Rationale (from GPT when available) */}
        <section className="mb-12 rounded-2xl border border-teal-800/50 bg-teal-950/20 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
          <div className="mb-3 flex items-center gap-2">
            <Brain className="text-teal-400" size={18} />
            <h3 className="text-sm font-semibold text-slate-200">AI-Generated Repurposing Rationale</h3>
          </div>
          <p className="leading-relaxed text-slate-300">{aiInsight}</p>
        </section>

        {/* Evidence Timeline (from GPT when available) */}
        <section className="mb-12 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="text-slate-400" size={18} />
            <h3 className="text-sm font-semibold text-slate-200">Evidence Timeline</h3>
          </div>
          {deepData?.evidenceTimeline?.length ? (
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
              {deepData.evidenceTimeline.map((step, idx) => (
                <li key={idx}>{formatTimelineStep(step)}</li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {drug.evidence
                .sort((a, b) => a.year - b.year)
                .map((e, idx) => (
                  <div key={idx} className="flex min-w-[120px] flex-col items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        e.tier === "Approved"
                          ? "bg-emerald-500"
                          : e.tier === "Supportive"
                          ? "bg-cyan-500"
                          : "bg-amber-500"
                      }`}
                    />
                    <p className="text-xs font-mono text-slate-400">{e.year}</p>
                    <p className="text-[10px] text-slate-500">{e.tier}</p>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* Evidence Sections: GPT format when deepData, else sheet */}
        <div className="space-y-6">
          {deepData ? (
            <>
              {approvedCount > 0 && deepData.evidence?.approved?.length > 0 && (
                <section
                  id="approved"
                  ref={(el) => { sectionRefs.current.approved = el; }}
                  className="rounded-2xl border border-emerald-800/50 bg-emerald-950/20 overflow-hidden shadow-[0_26px_90px_rgba(15,23,42,0.9)]"
                >
                  <button
                    onClick={() => toggleSection("approved")}
                    className="flex w-full items-center justify-between p-6 text-left hover:bg-slate-900/20"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-emerald-400" size={20} />
                      <h2 className="text-lg font-semibold text-slate-50">Approved Evidence</h2>
                      <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">
                        {deepData.evidence.approved.length} records
                      </span>
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
              {supportiveCount > 0 && deepData.evidence?.supportive?.length > 0 && (
                <section
                  id="supportive"
                  ref={(el) => { sectionRefs.current.supportive = el; }}
                  className="rounded-2xl border border-cyan-800/50 bg-cyan-950/20 overflow-hidden shadow-[0_26px_90px_rgba(15,23,42,0.9)]"
                >
                  <button
                    onClick={() => toggleSection("supportive")}
                    className="flex w-full items-center justify-between p-6 text-left hover:bg-slate-900/20"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="text-cyan-400" size={20} />
                      <h2 className="text-lg font-semibold text-slate-50">Supportive Evidence</h2>
                      <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">
                        {deepData.evidence.supportive.length} records
                      </span>
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
              {investigationalCount > 0 && deepData.evidence?.investigational?.length > 0 && (
                <section
                  id="investigational"
                  ref={(el) => { sectionRefs.current.investigational = el; }}
                  className="rounded-2xl border border-amber-800/50 bg-amber-950/20 overflow-hidden shadow-[0_26px_90px_rgba(15,23,42,0.9)]"
                >
                  <button
                    onClick={() => toggleSection("investigational")}
                    className="flex w-full items-center justify-between p-6 text-left hover:bg-slate-900/20"
                  >
                    <div className="flex items-center gap-3">
                      <FlaskConical className="text-amber-400" size={20} />
                      <h2 className="text-lg font-semibold text-slate-50">Investigational Evidence</h2>
                      <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">
                        {deepData.evidence.investigational.length} records
                      </span>
                    </div>
                    {expandedSections.has("investigational") ? <ChevronUp className="text-slate-400" size={20} /> : <ChevronDown className="text-slate-400" size={20} />}
                  </button>
                  {expandedSections.has("investigational") && (
                    <div className="border-t border-slate-800/50 bg-slate-900/20 p-6 space-y-4">
                      {deepData.evidence.investigational.map((e, idx) => (
                        <div key={idx} className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6">
                          <p className="font-medium text-amber-200">{e.status}</p>
                          <p className="mt-2 text-sm text-slate-300">{e.summary}</p>
                          <p className="mt-1 text-xs text-slate-300">Translational potential: {e.translationalPotential}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </>
          ) : (
            <>
          {approvedCount > 0 && (
            <EvidenceSection
              id="approved"
              title="Approved Evidence"
              evidence={byTier("Approved")}
              icon={CheckCircle2}
              iconColor="text-emerald-400"
              borderColor="border-emerald-800/50"
              bgColor="bg-emerald-950/20"
              isExpanded={expandedSections.has("approved")}
              onToggle={() => toggleSection("approved")}
              sectionRef={(el) => {
                sectionRefs.current.approved = el;
              }}
            />
          )}

          {supportiveCount > 0 && (
            <EvidenceSection
              id="supportive"
              title="Supportive Evidence"
              evidence={byTier("Supportive")}
              icon={AlertCircle}
              iconColor="text-cyan-400"
              borderColor="border-cyan-800/50"
              bgColor="bg-cyan-950/20"
              isExpanded={expandedSections.has("supportive")}
              onToggle={() => toggleSection("supportive")}
              sectionRef={(el) => {
                sectionRefs.current.supportive = el;
              }}
            />
          )}

          {investigationalCount > 0 && (
            <EvidenceSection
              id="investigational"
              title="Investigational Evidence"
              evidence={byTier("Investigational")}
              icon={FlaskConical}
              iconColor="text-amber-400"
              borderColor="border-amber-800/50"
              bgColor="bg-amber-950/20"
              isExpanded={expandedSections.has("investigational")}
              onToggle={() => toggleSection("investigational")}
              sectionRef={(el) => {
                sectionRefs.current.investigational = el;
              }}
            />
          )}
            </>
          )}
        </div>

        {/* Evidence Summary (from GPT when available) */}
        <section
          id="summary"
          ref={(el) => {
            sectionRefs.current.summary = el;
          }}
          className="mt-12 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8 shadow-[0_26px_90px_rgba(15,23,42,0.9)]"
        >
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
            <p className="leading-relaxed text-slate-300">{drug.summary}</p>
          )}
        </section>

        {/* Confidence & Caveats (from GPT when available) */}
        <section className="mt-8 rounded-2xl border border-amber-800/50 bg-amber-950/20 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-400" size={18} />
            <h3 className="text-sm font-semibold text-slate-200">Confidence & Caveats</h3>
          </div>
          {deepData?.confidenceAndCaveats ? (
            <div className="space-y-3 text-sm text-slate-300">
              <p><strong className="text-slate-200">Evidence Gaps:</strong> {deepData.confidenceAndCaveats.evidenceGaps}</p>
              <p><strong className="text-slate-200">Confounders:</strong> {deepData.confidenceAndCaveats.confounders}</p>
              <p><strong className="text-slate-200">Safety & Risk:</strong> {deepData.confidenceAndCaveats.safetyRisks}</p>
              <p><strong className="text-slate-200">Regulatory:</strong> {deepData.confidenceAndCaveats.regulatoryLimitations}</p>
              <p><strong className="text-slate-200">Interpretation:</strong> {deepData.confidenceAndCaveats.interpretationWarnings}</p>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-slate-300">
              <p><strong className="text-slate-200">Evidence Gaps:</strong> Limited randomized controlled trials for repurposing indications. Most evidence is observational or preclinical.</p>
              <p><strong className="text-slate-200">Confounders:</strong> Approved indication effects may influence repurposing signal interpretation.</p>
              <p><strong className="text-slate-200">Risk Considerations:</strong> Off-label use requires comprehensive risk-benefit assessment.</p>
            </div>
          )}
        </section>

        {/* Data Sources (from GPT when available) */}
        <section
          id="sources"
          ref={(el) => {
            sectionRefs.current.sources = el;
          }}
          className="mt-8 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.9)]"
        >
          <div className="mb-4 flex items-center gap-2">
            <Info className="text-slate-400" size={18} />
            <h3 className="text-sm font-semibold text-slate-200">Data Sources</h3>
          </div>
          <div className="space-y-2 text-sm text-slate-400">
            {deepData?.dataSources?.length ? (
              deepData.dataSources.map((src, idx) => <p key={idx}>• {src}</p>)
            ) : (
              <>
                <p>• PubMed (National Library of Medicine)</p>
                <p>• ClinicalTrials.gov (U.S. National Institutes of Health)</p>
                <p>• Manually curated evidence records</p>
              </>
            )}
            <p className="mt-4 text-xs text-slate-500">
              Last updated: <span className="font-mono">{drug.lastUpdated}</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              <strong className="text-slate-400">Deep Research:</strong> This profile is generated by AI (GPT) for research support only. Not clinical advice.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function DrugProfilePage({ params }: { params: Promise<{ id: string }> }) {
  return <DrugProfilePageClient params={params} />;
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
  sectionRef,
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
  sectionRef: (el: HTMLElement | null) => void;
}) {
  return (
    <section
      id={id}
      ref={sectionRef}
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
                    {/* Evidence Badges - Tier 1 (Build) */}
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

                    {/* Source Quality Tags - Tier 2 (Build) */}
                    {e.quality && (
                      <span className="inline-flex items-center rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                        {e.quality}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                      {e.source}
                    </span>
                    <span className="text-xs text-slate-500">{e.year}</span>

                    {/* Evidence Strength Bar - Tier 2 (Fake) */}
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
