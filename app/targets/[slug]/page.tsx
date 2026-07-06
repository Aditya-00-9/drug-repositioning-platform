import Link from "next/link";
import { notFound } from "next/navigation";
import EmptyEvidenceState from "@/app/components/EmptyEvidenceState";
import EntityPageLayout from "@/app/components/EntityPageLayout";
import EvidenceDetailSections from "@/app/components/EvidenceDetailSections";
import EvidenceGradeBadge from "@/app/components/EvidenceGradeBadge";
import DownloadReportButton from "@/app/components/DownloadReportButton";
import { formatDate } from "@/lib/format";
import {
  getAllTargets,
  getTargetBySlug,
  getDrugBySlug,
  getDiseaseBySlug,
  getEvidenceForTarget,
} from "@/lib/data";

export function generateStaticParams() {
  return getAllTargets().map((t) => ({ slug: t.slug }));
}

export default async function TargetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const target = getTargetBySlug(slug);
  if (!target) notFound();

  const evidence = getEvidenceForTarget(target.slug);
  const primaryEvidence = evidence[0];

  return (
    <EntityPageLayout
      backHref="/targets"
      backLabel="All targets"
      eyebrow="Target workspace"
      title={target.name}
      description={target.description}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
            <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
              Pathway & druggability
            </h2>
            <p className="mt-3 text-sm text-slate-300">{target.pathway}</p>
            <p className="mt-2 text-sm text-slate-400">Druggability: {target.druggability}</p>
          </section>

          {primaryEvidence ? (
            <EvidenceDetailSections evidence={primaryEvidence} />
          ) : (
            <EmptyEvidenceState entityType="target" entityName={target.name} />
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
              Identifiers
            </span>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Gene</dt>
                <dd className="font-mono text-slate-200">{target.geneSymbol}</dd>
              </div>
              {target.uniprotId && (
                <div>
                  <dt className="text-slate-500">UniProt</dt>
                  <dd className="text-slate-200">{target.uniprotId}</dd>
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
              Modulating drugs
            </h3>
            <ul className="mt-3 space-y-2">
              {target.relatedDrugSlugs.map((slug) => {
                const drug = getDrugBySlug(slug);
                return drug ? (
                  <li key={slug}>
                    <Link href={`/drugs/${slug}`} className="text-sm text-teal-300 hover:text-teal-200">
                      {drug.name}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
            <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
              Associated diseases
            </h3>
            <ul className="mt-3 space-y-2">
              {target.relatedDiseaseSlugs.map((slug) => {
                const disease = getDiseaseBySlug(slug);
                return disease ? (
                  <li key={slug}>
                    <Link href={`/diseases/${slug}`} className="text-sm text-teal-300 hover:text-teal-200">
                      {disease.name}
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
