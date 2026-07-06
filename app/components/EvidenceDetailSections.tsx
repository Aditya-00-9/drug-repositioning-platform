import type { EvidenceRecord } from "@/lib/types";
import AITransparencyPanel from "./AITransparencyPanel";
import CitationList from "./CitationList";
import ConfidenceScore from "./ConfidenceScore";
import EvidenceGradeBadge from "./EvidenceGradeBadge";

interface EvidenceDetailSectionsProps {
  evidence: EvidenceRecord;
}

export default function EvidenceDetailSections({ evidence }: EvidenceDetailSectionsProps) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
          Evidence behind this
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <ConfidenceScore
            score={evidence.confidenceScore}
            evidenceLevel={evidence.evidenceLevel}
          />
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
              Evidence grade
            </span>
            <div className="mt-3">
              <EvidenceGradeBadge grade={evidence.grade} />
            </div>
            <p className="mt-4 text-sm text-slate-300">{evidence.outcomes}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
          Mechanism
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{evidence.mechanism}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {evidence.evidenceTypes.map((t) => (
            <span
              key={t}
              className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-300"
            >
              {t.replace(/_/g, " ")}
            </span>
          ))}
          {evidence.phase && (
            <span className="rounded-full bg-teal-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-teal-300">
              {evidence.phase}
            </span>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
          Authoritative sources
        </h2>
        <div className="mt-4">
          <CitationList citations={evidence.citations} />
        </div>
      </section>

      <AITransparencyPanel
        summary={evidence.aiSummary}
        generatedAt={evidence.aiGeneratedAt}
        sourcePapers={evidence.sourcePapers}
        lastVerified={evidence.lastVerified}
      />
    </div>
  );
}
