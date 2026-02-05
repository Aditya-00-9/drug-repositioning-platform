"use client";

export type DeepResearchSnapshot = {
  drugClass: string | null;
  primaryApprovedIndications: string[];
  mechanismsOfAction: string[];
  keyPathways: string[];
  overallConfidence: "Low" | "Medium" | "High";
};

export type DeepResearchEvidenceItemApproved = {
  indication: string;
  studyType: string;
  summary: string;
  clinicalRelevance: string;
};

export type DeepResearchEvidenceItemSupportive = {
  strength: string;
  summary: string;
  limitations: string;
};

export type DeepResearchEvidenceItemInvestigational = {
  status: string;
  summary: string;
  translationalPotential: string;
};

export type DeepResearchResponse = {
  snapshot: DeepResearchSnapshot;
  mechanisticRationale: string;
  evidence: {
    approved: DeepResearchEvidenceItemApproved[];
    supportive: DeepResearchEvidenceItemSupportive[];
    investigational: DeepResearchEvidenceItemInvestigational[];
  };
  evidenceTimeline: string[];
  evidenceSummary: {
    solid: string;
    promising: string;
    speculative: string;
  };
  confidenceAndCaveats: {
    evidenceGaps: string;
    confounders: string;
    safetyRisks: string;
    regulatoryLimitations: string;
    interpretationWarnings: string;
  };
  dataSources: string[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  loading: boolean;
  error: string | null;
  data: DeepResearchResponse | null;
};

export default function DeepResearchPanel({
  open,
  onClose,
  title,
  loading,
  error,
  data,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <aside className="flex h-full w-full max-w-xl flex-col border-l border-slate-800 bg-slate-950/95 px-6 pb-6 pt-5 shadow-[0_0_60px_rgba(15,23,42,0.95)]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
              Deep Research Mode
            </p>
            <h2 className="mt-1 text-sm font-semibold text-slate-50">{title}</h2>
            <p className="mt-1 text-xs text-slate-400">
              Research-grade, non-clinical synthesis. Conservative interpretation only.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-slate-400 hover:border-slate-500 hover:text-slate-100"
          >
            Close
          </button>
        </div>

        {loading && (
          <div className="mt-4 space-y-3 text-xs text-slate-400">
            <p className="font-mono uppercase tracking-[0.18em] text-teal-300">
              Running systematic query…
            </p>
            <div className="h-2 w-32 animate-pulse rounded-full bg-teal-500/40" />
            <div className="space-y-2">
              <div className="h-3 rounded-md bg-slate-800/80" />
              <div className="h-3 rounded-md bg-slate-800/60" />
              <div className="h-3 rounded-md bg-slate-800/40" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-200">
              {error}
            </div>
            {error.includes("OPENAI_API_KEY") && (
              <div className="rounded-lg border border-slate-600 bg-slate-900/60 p-3 text-xs text-slate-300 space-y-2">
                <p className="font-medium text-slate-200">To enable Deep Research Mode:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">OpenAI</a>.</li>
                  <li>Create a file <code className="rounded bg-slate-800 px-1 py-0.5 font-mono">.env.local</code> in the project root.</li>
                  <li>Add <code className="rounded bg-slate-800 px-1 py-0.5 font-mono">OPENAI_API_KEY=sk-your-key</code>.</li>
                  <li>Restart the dev server (<code className="rounded bg-slate-800 px-1 py-0.5 font-mono">npm run dev</code>).</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {!loading && data && (
          <div className="mt-4 flex-1 space-y-5 overflow-y-auto pb-4 text-sm text-slate-200">
            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">Snapshot</p>
              <div className="space-y-1 text-xs text-slate-300">
                <p><span className="font-semibold text-slate-100">Drug class:</span> {data.snapshot.drugClass ?? "Not specified"}</p>
                <p><span className="font-semibold text-slate-100">Approved indications:</span> {data.snapshot.primaryApprovedIndications?.join(", ") || "Not specified"}</p>
                <p><span className="font-semibold text-slate-100">Mechanisms:</span> {data.snapshot.mechanismsOfAction?.join(", ") || "Not specified"}</p>
                <p><span className="font-semibold text-slate-100">Key pathways:</span> {data.snapshot.keyPathways?.join(", ") || "Not specified"}</p>
                <p><span className="font-semibold text-slate-100">Overall confidence:</span> {data.snapshot.overallConfidence}</p>
              </div>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">Mechanistic rationale</p>
              <p className="text-xs leading-relaxed text-slate-200">{data.mechanisticRationale}</p>
            </section>

            <section className="space-y-4">
              <div>
                <p className="mb-1 text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-300">Approved evidence</p>
                {!data.evidence?.approved?.length ? (
                  <p className="text-xs text-slate-500">No approved evidence identified.</p>
                ) : (
                  <div className="space-y-3">
                    {data.evidence.approved.map((e, idx) => (
                      <div key={idx} className="rounded-lg border border-emerald-700/60 bg-emerald-950/20 p-3 text-xs">
                        <p className="font-semibold text-emerald-200">{e.indication}</p>
                        <p className="mt-1 text-[11px] text-emerald-300/90">{e.studyType} · {e.clinicalRelevance}</p>
                        <p className="mt-2 text-slate-100">{e.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="mb-1 text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-300">Supportive evidence</p>
                {!data.evidence?.supportive?.length ? (
                  <p className="text-xs text-slate-500">No supportive evidence identified.</p>
                ) : (
                  <div className="space-y-3">
                    {data.evidence.supportive.map((e, idx) => (
                      <div key={idx} className="rounded-lg border border-cyan-700/60 bg-cyan-950/20 p-3 text-xs">
                        <p className="font-semibold text-cyan-200">{e.strength}</p>
                        <p className="mt-2 text-slate-100">{e.summary}</p>
                        <p className="mt-1 text-[11px] text-slate-400">Limitations: {e.limitations}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="mb-1 text-[11px] font-mono uppercase tracking-[0.2em] text-amber-300">Investigational evidence</p>
                {!data.evidence?.investigational?.length ? (
                  <p className="text-xs text-slate-500">No investigational evidence identified.</p>
                ) : (
                  <div className="space-y-3">
                    {data.evidence.investigational.map((e, idx) => (
                      <div key={idx} className="rounded-lg border border-amber-700/60 bg-amber-950/20 p-3 text-xs">
                        <p className="font-semibold text-amber-200">{e.status}</p>
                        <p className="mt-2 text-slate-100">{e.summary}</p>
                        <p className="mt-1 text-[11px] text-slate-300">Translational potential: {e.translationalPotential}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {data.evidenceTimeline?.length > 0 && (
              <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">Evidence timeline</p>
                <ul className="list-disc space-y-1 pl-4 text-xs text-slate-200">
                  {data.evidenceTimeline.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </section>
            )}

            {data.evidenceSummary && (
              <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">Evidence synthesis</p>
                <div className="space-y-2 text-xs">
                  <p><span className="font-semibold text-slate-100">Solid:</span> {data.evidenceSummary.solid}</p>
                  <p><span className="font-semibold text-slate-100">Promising:</span> {data.evidenceSummary.promising}</p>
                  <p><span className="font-semibold text-slate-100">Speculative:</span> {data.evidenceSummary.speculative}</p>
                </div>
              </section>
            )}

            {data.confidenceAndCaveats && (
              <section className="rounded-xl border border-amber-800/70 bg-amber-950/15 p-4">
                <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.2em] text-amber-300">Confidence & caveats</p>
                <div className="space-y-1 text-xs text-amber-100">
                  <p><span className="font-semibold">Evidence gaps:</span> {data.confidenceAndCaveats.evidenceGaps}</p>
                  <p><span className="font-semibold">Confounders:</span> {data.confidenceAndCaveats.confounders}</p>
                  <p><span className="font-semibold">Safety & risk:</span> {data.confidenceAndCaveats.safetyRisks}</p>
                  <p><span className="font-semibold">Regulatory limits:</span> {data.confidenceAndCaveats.regulatoryLimitations}</p>
                  <p><span className="font-semibold">Interpretation warnings:</span> {data.confidenceAndCaveats.interpretationWarnings}</p>
                </div>
                <p className="mt-3 text-[10px] text-amber-200/80">Research-only intelligence. Not treatment guidance.</p>
              </section>
            )}

            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">Data sources</p>
              <p className="text-[11px] text-slate-300">
                {!data.dataSources?.length ? "Sources not explicitly listed." : data.dataSources.join(" · ")}
              </p>
            </section>
          </div>
        )}
      </aside>
    </div>
  );
}
