import Link from "next/link";
import { Activity } from "lucide-react";
import EntityPageLayout from "@/app/components/EntityPageLayout";
import EvidenceGradeBadge from "@/app/components/EvidenceGradeBadge";
import MedicalDisclaimer from "@/app/components/MedicalDisclaimer";
import { getAllDiseases, getEvidenceForDisease } from "@/lib/data";

export default function DiseasesPage() {
  const diseases = getAllDiseases();

  return (
    <EntityPageLayout
      backHref="/"
      backLabel="Back to overview"
      eyebrow="Disease-centric intelligence"
      title="Navigate disease signatures with verified repositioning evidence."
      description="Each disease workspace links to candidate drugs with graded evidence from PubMed, clinical trials, and regulatory sources."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {diseases.map((disease) => {
          const evidence = getEvidenceForDisease(disease.slug);
          const topGrade = evidence[0]?.grade;
          return (
            <div
              key={disease.slug}
              className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-[0_22px_80px_rgba(15,23,42,0.9)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-teal-300 ring-1 ring-slate-700/80">
                    <Activity size={16} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-50">{disease.name}</span>
                    {disease.icd10 && (
                      <span className="mt-1 block text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                        ICD-10 {disease.icd10}
                      </span>
                    )}
                  </div>
                </div>
                {topGrade ? (
                  <EvidenceGradeBadge grade={topGrade} />
                ) : (
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
                    No evidence
                  </span>
                )}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-400">{disease.description}</p>
              <div className="mt-4 text-xs text-slate-400">
                {evidence.length > 0
                  ? `${evidence.length} evidence record${evidence.length > 1 ? "s" : ""}`
                  : "Evidence pipeline pending"}
              </div>
              <MedicalDisclaimer className="mt-5" />
              <Link
                href={`/diseases/${disease.slug}`}
                className="mt-6 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.22em] text-teal-300 hover:text-teal-200"
              >
                <span>Open disease workspace</span>
                <span>Launch →</span>
              </Link>
            </div>
          );
        })}
      </div>
    </EntityPageLayout>
  );
}
