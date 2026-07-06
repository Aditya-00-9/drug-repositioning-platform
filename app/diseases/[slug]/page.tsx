import Link from "next/link";
import { notFound } from "next/navigation";
import EmptyEvidenceState from "@/app/components/EmptyEvidenceState";
import EntityPageLayout from "@/app/components/EntityPageLayout";
import EvidenceDetailSections from "@/app/components/EvidenceDetailSections";
import EvidenceGradeBadge from "@/app/components/EvidenceGradeBadge";
import DownloadReportButton from "@/app/components/DownloadReportButton";
import { formatDate } from "@/lib/format";
import {
  getAllDiseases,
  getDiseaseBySlug,
  getDrugBySlug,
  getEvidenceForDisease,
} from "@/lib/data";

export function generateStaticParams() {
  return getAllDiseases().map((d) => ({ slug: d.slug }));
}

export default async function DiseaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const disease = getDiseaseBySlug(slug);
  if (!disease) notFound();

  const evidence = getEvidenceForDisease(disease.slug);
  const primaryEvidence = evidence[0];

  return (
    <EntityPageLayout
      backHref="/diseases"
      backLabel="All diseases"
      eyebrow="Disease workspace"
      title={disease.name}
      description={disease.description}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
            <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
              Unmet need
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{disease.unmetNeed}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {disease.pathwayClusters.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-teal-300"
                >
                  {p}
                </span>
              ))}
            </div>
          </section>

          {primaryEvidence ? (
            <EvidenceDetailSections evidence={primaryEvidence} />
          ) : (
            <EmptyEvidenceState entityType="disease" entityName={disease.name} />
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
              Identifiers
            </span>
            <dl className="mt-4 space-y-3 text-sm">
              {disease.icd10 && (
                <div>
                  <dt className="text-slate-500">ICD-10</dt>
                  <dd className="text-slate-200">{disease.icd10}</dd>
                </div>
              )}
              {disease.meshId && (
                <div>
                  <dt className="text-slate-500">MeSH</dt>
                  <dd className="text-slate-200">{disease.meshId}</dd>
                </div>
              )}
              {primaryEvidence && (
                <div>
                  <dt className="text-slate-500">Last verified</dt>
                  <dd className="text-teal-300">{formatDate(primaryEvidence.lastVerified)}</dd>
                </div>
              )}
            </dl>
            {primaryEvidence && (
              <div className="mt-5">
                <DownloadReportButton evidenceSlug={primaryEvidence.slug} />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
            <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
              Candidate drugs
            </h3>
            <ul className="mt-3 space-y-2">
              {disease.relatedDrugSlugs.map((slug) => {
                const drug = getDrugBySlug(slug);
                return drug ? (
                  <li key={slug}>
                    <Link
                      href={`/drugs/${slug}`}
                      className="text-sm text-teal-300 hover:text-teal-200"
                    >
                      {drug.name}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </div>

          {evidence.length > 0 && (
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
              <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                Evidence records
              </h3>
              <ul className="mt-3 space-y-3">
                {evidence.map((e) => (
                  <li key={e.slug}>
                    <Link href={`/evidence/${e.slug}`} className="flex flex-col gap-1">
                      <span className="text-sm text-slate-200">{e.slug}</span>
                      <EvidenceGradeBadge grade={e.grade} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </EntityPageLayout>
  );
}
