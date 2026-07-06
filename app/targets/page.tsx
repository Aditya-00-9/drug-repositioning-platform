import Link from "next/link";
import { Target } from "lucide-react";
import EntityPageLayout from "@/app/components/EntityPageLayout";
import EvidenceGradeBadge from "@/app/components/EvidenceGradeBadge";
import MedicalDisclaimer from "@/app/components/MedicalDisclaimer";
import { getAllTargets, getEvidenceForTarget } from "@/lib/data";

export default function TargetsPage() {
  const targets = getAllTargets();

  return (
    <EntityPageLayout
      backHref="/"
      backLabel="Back to overview"
      eyebrow="Target-centric intelligence"
      title="Follow perturbation profiles from target to therapy concept."
      description="Each target profile links to modulating compounds and disease associations with graded evidence."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {targets.map((target) => {
          const evidence = getEvidenceForTarget(target.slug);
          const topGrade = evidence[0]?.grade;
          return (
            <div
              key={target.slug}
              className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-[0_22px_80px_rgba(15,23,42,0.9)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-teal-300 ring-1 ring-slate-700/80">
                    <Target size={16} />
                  </div>
                  <div>
                    <span className="font-mono text-sm font-semibold text-slate-50">
                      {target.geneSymbol}
                    </span>
                    <span className="mt-1 block text-xs text-slate-400">{target.name}</span>
                  </div>
                </div>
                {topGrade && <EvidenceGradeBadge grade={topGrade} />}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-400">{target.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>{target.pathway}</span>
                <span>{evidence.length} evidence records</span>
              </div>
              <MedicalDisclaimer className="mt-5" />
              <Link
                href={`/targets/${target.slug}`}
                className="mt-6 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.22em] text-teal-300 hover:text-teal-200"
              >
                <span>Open target workspace</span>
                <span>Launch →</span>
              </Link>
            </div>
          );
        })}
      </div>
    </EntityPageLayout>
  );
}
