import Link from "next/link";
import { notFound } from "next/navigation";
import DownloadReportButton from "@/app/components/DownloadReportButton";
import EmptyEvidenceState from "@/app/components/EmptyEvidenceState";
import EntityPageLayout from "@/app/components/EntityPageLayout";
import EvidenceDetailSections from "@/app/components/EvidenceDetailSections";
import EvidenceGradeBadge from "@/app/components/EvidenceGradeBadge";
import { formatDate } from "@/lib/format";
import {
  getAllDrugs,
  getDrugBySlug,
  getEvidenceForDrug,
  getRelatedDiseasesForDrug,
  getRelatedDrugs,
} from "@/lib/data";

export function generateStaticParams() {
  return getAllDrugs().map((d) => ({ slug: d.slug }));
}

export default async function DrugDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const drug = getDrugBySlug(slug);
  if (!drug) notFound();

  const evidence = getEvidenceForDrug(drug.slug);
  const relatedDiseases = getRelatedDiseasesForDrug(drug);
  const similarDrugs = getRelatedDrugs(drug);
  const primaryEvidence = evidence[0];

  return (
    <EntityPageLayout
      backHref="/drugs"
      backLabel="All drugs"
      eyebrow="Drug profile"
      title={drug.name}
      description={drug.mechanism}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
            <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
              Why this drug?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{drug.whyThisDrug}</p>
          </section>

          <section className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
            <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
              Known risks
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-300">
              {drug.knownRisks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </section>

          {primaryEvidence ? (
            <EvidenceDetailSections evidence={primaryEvidence} />
          ) : (
            <EmptyEvidenceState entityType="drug" entityName={drug.name} />
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
              Drug details
            </span>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Generic</dt>
                <dd className="text-slate-200">{drug.genericName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Brand names</dt>
                <dd className="text-slate-200">{drug.brandNames.join(", ")}</dd>
              </div>
              {drug.atcCode && (
                <div>
                  <dt className="text-slate-500">ATC</dt>
                  <dd className="text-slate-200">{drug.atcCode}</dd>
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
              Related diseases
            </h3>
            <ul className="mt-3 space-y-2">
              {relatedDiseases.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/diseases/${d.slug}`}
                    className="text-sm text-teal-300 hover:text-teal-200"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {similarDrugs.length > 0 && (
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
              <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                Similar drugs
              </h3>
              <ul className="mt-3 space-y-2">
                {similarDrugs.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/drugs/${d.slug}`}
                      className="text-sm text-teal-300 hover:text-teal-200"
                    >
                      {d.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {evidence.length > 0 && (
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
              <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                Evidence records
              </h3>
              <ul className="mt-3 space-y-3">
                {evidence.map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={`/evidence/${e.slug}`}
                      className="flex flex-col gap-1 hover:opacity-80"
                    >
                      <span className="text-sm text-slate-200">{e.slug}</span>
                      <EvidenceGradeBadge grade={e.grade} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
            <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
              Targets
            </h3>
            <ul className="mt-3 space-y-2">
              {drug.targetSlugs.map((t) => (
                <li key={t}>
                  <Link
                    href={`/targets/${t}`}
                    className="text-sm text-teal-300 hover:text-teal-200"
                  >
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </EntityPageLayout>
  );
}
