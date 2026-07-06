import Link from "next/link";
import EntityPageLayout from "@/app/components/EntityPageLayout";
import MedicalDisclaimer from "@/app/components/MedicalDisclaimer";

const AUDIENCES = [
  {
    slug: "pharma",
    title: "Pharma",
    headline: "Portfolio intelligence for established pharmaceutical organizations.",
    description:
      "Prioritize repurposing candidates across your marketed portfolio, identify lifecycle extension opportunities, and triage external assets with evidence-graded confidence scores.",
    features: [
      "Portfolio-wide drug–disease mapping",
      "Regulatory-grade citation trails",
      "Competitive landscape signals",
      "Downloadable evidence reports for governance",
    ],
  },
  {
    slug: "biotech",
    title: "Biotech",
    headline: "De-risk indication expansion for clinical-stage biotech.",
    description:
      "Validate repositioning hypotheses before committing scarce clinical resources. Our evidence grading separates strong signals from speculative claims.",
    features: [
      "Mechanism-aligned target mapping",
      "Clinical trial landscape analysis",
      "Phase-appropriate evidence tiers",
      "Scientific review workflow integration",
    ],
  },
  {
    slug: "academia",
    title: "Academia",
    headline: "Hypothesis generation for translational researchers.",
    description:
      "Access curated drug–disease evidence with full PubMed and ClinicalTrials.gov citations for grant proposals, systematic reviews, and collaborative discovery.",
    features: [
      "Full citation export",
      "Transparent AI summaries with source papers",
      "Open evidence grading methodology",
      "Free research-tier access (contact us)",
    ],
  },
  {
    slug: "investors",
    title: "Investors",
    headline: "Due diligence intelligence for life sciences investors.",
    description:
      "Evaluate repurposing narratives with graded evidence rather than press releases. Confidence scores and negative results (e.g., hydroxychloroquine–COVID-19) build trust.",
    features: [
      "Evidence confidence scoring",
      "Published vs. pipeline distinction",
      "Audit trail for data provenance",
      "Regulatory positioning clarity",
    ],
  },
  {
    slug: "researchers",
    title: "Researchers",
    headline: "Decision support for bench-to-bedside investigators.",
    description:
      "Explore drug, disease, and target relationships with authoritative sources. This platform is research intelligence—not a diagnostic or treatment tool.",
    features: [
      "Drug / disease / target / evidence entity pages",
      "Why this drug? mechanistic rationale",
      "Known risks and contraindications",
      "Last verified timestamps on every record",
    ],
  },
];

export default function AudiencesIndexPage() {
  return (
    <EntityPageLayout
      backHref="/"
      backLabel="Back to overview"
      eyebrow="Commercial positioning"
      title="Built for research intelligence, not patient care."
      description="Repositioning Intelligence is intended for qualified professionals in pharma, biotech, academia, investment, and translational research. It provides decision support and hypothesis generation—it is not a diagnostic or treatment tool."
    >
      <MedicalDisclaimer className="mb-10" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {AUDIENCES.map((a) => (
          <Link
            key={a.slug}
            href={`/audiences/${a.slug}`}
            className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 transition-colors hover:border-teal-500/30"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300">
              {a.title}
            </span>
            <h2 className="mt-3 text-lg font-semibold text-slate-50">{a.headline}</h2>
            <p className="mt-2 text-sm text-slate-400">{a.description}</p>
          </Link>
        ))}
      </div>
    </EntityPageLayout>
  );
}
