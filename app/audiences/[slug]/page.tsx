import { notFound } from "next/navigation";
import EntityPageLayout from "@/app/components/EntityPageLayout";
import MedicalDisclaimer from "@/app/components/MedicalDisclaimer";

const AUDIENCE_DATA: Record<
  string,
  { title: string; headline: string; description: string; features: string[] }
> = {
  pharma: {
    title: "Pharma",
    headline: "Portfolio intelligence for established pharmaceutical organizations.",
    description:
      "Prioritize repurposing candidates across your marketed portfolio, identify lifecycle extension opportunities, and triage external assets with evidence-graded confidence scores.",
    features: [
      "Portfolio-wide drug–disease mapping",
      "Regulatory-grade citation trails (PubMed, FDA labels)",
      "Competitive landscape signals",
      "Downloadable evidence reports for governance committees",
      "Audit logs for compliance review",
    ],
  },
  biotech: {
    title: "Biotech",
    headline: "De-risk indication expansion for clinical-stage biotech.",
    description:
      "Validate repositioning hypotheses before committing scarce clinical resources. Our five-tier evidence grading separates approved indications from speculative claims.",
    features: [
      "Mechanism-aligned target mapping",
      "ClinicalTrials.gov integration",
      "Phase-appropriate evidence tiers",
      "Scientific → medical review workflow",
      "Insufficient evidence flagging",
    ],
  },
  academia: {
    title: "Academia",
    headline: "Hypothesis generation for translational researchers.",
    description:
      "Access curated drug–disease evidence with full PubMed and ClinicalTrials.gov citations for grant proposals, systematic reviews, and collaborative discovery programs.",
    features: [
      "Full citation export with PMIDs",
      "Transparent AI summaries with generation dates",
      "Open evidence grading methodology",
      "Negative result documentation",
      "Research-only disclaimer on every page",
    ],
  },
  investors: {
    title: "Investors",
    headline: "Due diligence intelligence for life sciences investors.",
    description:
      "Evaluate repurposing narratives with graded evidence rather than press releases. We publish insufficient-evidence records alongside strong signals to maintain credibility.",
    features: [
      "Evidence confidence scoring (0–100)",
      "Approved vs. repurposing signal distinction",
      "Audit trail for data provenance",
      "Last verified timestamps",
      "No diagnostic or treatment claims",
    ],
  },
  researchers: {
    title: "Researchers",
    headline: "Decision support for bench-to-bedside investigators.",
    description:
      "Explore drug, disease, and target relationships with authoritative sources. Use our platform for hypothesis generation and portfolio triage—not clinical decision-making.",
    features: [
      "Entity pages: /drugs, /diseases, /targets, /evidence",
      "Why this drug? mechanistic rationale sections",
      "Known risks and contraindications",
      "Related diseases and similar drugs",
      "Downloadable evidence reports",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(AUDIENCE_DATA).map((slug) => ({ slug }));
}

export default async function AudiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const audience = AUDIENCE_DATA[slug];
  if (!audience) notFound();

  return (
    <EntityPageLayout
      backHref="/audiences"
      backLabel="All audiences"
      eyebrow={`For ${audience.title}`}
      title={audience.headline}
      description={audience.description}
    >
      <MedicalDisclaimer className="mb-8" />
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8">
        <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
          Platform capabilities
        </h2>
        <ul className="mt-6 space-y-4">
          {audience.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-8 text-sm text-slate-500">
        Repositioning Intelligence is a research and decision-support tool for qualified
        professionals. It does not provide medical advice, diagnosis, or treatment
        recommendations. Contact your organization&apos;s medical affairs team for
        clinical decisions.
      </p>
    </EntityPageLayout>
  );
}
