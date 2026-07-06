import Link from "next/link";
import { notFound } from "next/navigation";
import EntityPageLayout from "@/app/components/EntityPageLayout";
import EvidenceDetailSections from "@/app/components/EvidenceDetailSections";
import EvidenceGradeBadge from "@/app/components/EvidenceGradeBadge";
import DownloadReportButton from "@/app/components/DownloadReportButton";
import ReviewStatusBadge from "@/app/components/ReviewStatusBadge";
import { formatDate } from "@/lib/format";
import {
  getAllEvidence,
  getEvidenceBySlug,
  getDrugBySlug,
  getDiseaseBySlug,
  getTargetBySlug,
} from "@/lib/data";

export function generateStaticParams() {
  return getAllEvidence().map((e) => ({ slug: e.slug }));
}

export default async function EvidenceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const evidence = getEvidenceBySlug(slug);
  if (!evidence || evidence.reviewStage !== "published") notFound();

  const drug = getDrugBySlug(evidence.drugSlug);
  const disease = getDiseaseBySlug(evidence.diseaseSlug);
  const target = getTargetBySlug(evidence.targetSlug);

  return (
    <EntityPageLayout
      backHref="/evidence"
      backLabel="All evidence"
      eyebrow="Evidence record"
      title={`${drug?.name ?? evidence.drugSlug} × ${disease?.name ?? evidence.diseaseSlug}`}
      description={evidence.mechanism}
    >
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <EvidenceGradeBadge grade={evidence.grade} />
        <ReviewStatusBadge stage={evidence.reviewStage} />
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
          Last updated {formatDate(evidence.lastUpdated)}
        </span>
        <DownloadReportButton evidenceSlug={evidence.slug} />
      </div>

      <div className="mb-8 flex flex-wrap gap-4 text-sm">
        {drug && (
          <Link href={`/drugs/${drug.slug}`} className="text-teal-300 hover:text-teal-200">
            Drug: {drug.name}
          </Link>
        )}
        {disease && (
          <Link href={`/diseases/${disease.slug}`} className="text-teal-300 hover:text-teal-200">
            Disease: {disease.name}
          </Link>
        )}
        {target && (
          <Link href={`/targets/${target.slug}`} className="text-teal-300 hover:text-teal-200">
            Target: {target.name}
          </Link>
        )}
      </div>

      {drug && (
        <section className="mb-8 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
            Why this drug?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{drug.whyThisDrug}</p>
        </section>
      )}

      {drug && (
        <section className="mb-8 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
            Known risks
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-300">
            {drug.knownRisks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </section>
      )}

      <EvidenceDetailSections evidence={evidence} />
    </EntityPageLayout>
  );
}
