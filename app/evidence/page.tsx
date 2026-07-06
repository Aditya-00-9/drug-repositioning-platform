import Link from "next/link";
import EntityPageLayout from "@/app/components/EntityPageLayout";
import EvidenceGradeBadge from "@/app/components/EvidenceGradeBadge";
import ConfidenceScore from "@/app/components/ConfidenceScore";
import MedicalDisclaimer from "@/app/components/MedicalDisclaimer";
import { formatDate } from "@/lib/format";
import {
  getAllEvidence,
  getDrugBySlug,
  getDiseaseBySlug,
} from "@/lib/data";

export default function EvidencePage() {
  const records = getAllEvidence();

  return (
    <EntityPageLayout
      backHref="/"
      backLabel="Back to overview"
      eyebrow="Evidence registry"
      title="Published drug–disease evidence records."
      description="Each record includes graded evidence, PubMed and ClinicalTrials.gov citations, confidence scores, and human-reviewed AI summaries."
    >
      <div className="space-y-4">
        {records.map((record) => {
          const drug = getDrugBySlug(record.drugSlug);
          const disease = getDiseaseBySlug(record.diseaseSlug);
          return (
            <Link
              key={record.slug}
              href={`/evidence/${record.slug}`}
              className="block rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 transition-colors hover:border-teal-500/30 hover:bg-slate-900/60"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-lg font-semibold text-slate-50">
                      {drug?.name} × {disease?.name}
                    </span>
                    <EvidenceGradeBadge grade={record.grade} />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{record.mechanism}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
                    <span>{record.pubmedIds.length} PubMed</span>
                    <span>{record.clinicalTrialIds.length} trials</span>
                    <span>Verified {formatDate(record.lastVerified)}</span>
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <ConfidenceScore
                    score={record.confidenceScore}
                    evidenceLevel={record.evidenceLevel}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <MedicalDisclaimer className="mt-8" />
    </EntityPageLayout>
  );
}
