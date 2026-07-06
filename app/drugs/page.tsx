import Link from "next/link";
import { Beaker } from "lucide-react";
import EntityPageLayout from "@/app/components/EntityPageLayout";
import EvidenceGradeBadge from "@/app/components/EvidenceGradeBadge";
import MedicalDisclaimer from "@/app/components/MedicalDisclaimer";
import { getAllDrugs, getEvidenceForDrug } from "@/lib/data";

export default function DrugsPage() {
  const drugs = getAllDrugs();

  return (
    <EntityPageLayout
      backHref="/"
      backLabel="Back to overview"
      eyebrow="Drug-centric intelligence"
      title="Explore compounds with evidence-backed repositioning profiles."
      description="Each drug profile links to verified drug–disease evidence records with PubMed citations, confidence scores, and review status."
    >
      <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
        <div className="grid grid-cols-[1.2fr,1fr,1fr,0.8fr] gap-4 border-b border-slate-800/80 bg-slate-900/80 px-6 py-3 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">
          <span>Compound</span>
          <span>Primary indication</span>
          <span>Evidence records</span>
          <span className="text-right">Profile</span>
        </div>
        <div className="divide-y divide-slate-900/80">
          {drugs.map((drug) => {
            const evidence = getEvidenceForDrug(drug.slug);
            const topGrade = evidence[0]?.grade;
            return (
              <div
                key={drug.slug}
                className="grid grid-cols-[1.2fr,1fr,1fr,0.8fr] items-center gap-4 px-6 py-4 hover:bg-slate-900/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-teal-300 ring-1 ring-slate-700/80">
                    <Beaker size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-50">{drug.name}</span>
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                      {drug.approvalStatus}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-slate-300">{drug.primaryIndication}</div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-300">
                    {evidence.length > 0
                      ? `${evidence.length} published record${evidence.length > 1 ? "s" : ""}`
                      : "No evidence yet"}
                  </span>
                  {topGrade && <EvidenceGradeBadge grade={topGrade} />}
                </div>
                <div className="flex justify-end">
                  <Link
                    href={`/drugs/${drug.slug}`}
                    className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-200 ring-1 ring-slate-700/80 hover:bg-slate-800 hover:text-teal-200"
                  >
                    Open profile →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-slate-800/80 p-6">
          <MedicalDisclaimer />
        </div>
      </div>
    </EntityPageLayout>
  );
}
