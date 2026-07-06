import { formatDate } from "@/lib/format";

interface AITransparencyPanelProps {
  summary: string;
  generatedAt: string;
  sourcePapers: string[];
  lastVerified: string;
}

export default function AITransparencyPanel({
  summary,
  generatedAt,
  sourcePapers,
  lastVerified,
}: AITransparencyPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
          AI-generated summary
        </h2>
        <div className="flex flex-wrap gap-4 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
          <span>Generated {formatDate(generatedAt)}</span>
          <span className="text-teal-300/80">Last verified {formatDate(lastVerified)}</span>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">{summary}</p>
      {sourcePapers.length > 0 && (
        <div className="mt-5 border-t border-slate-800/80 pt-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
            Source papers
          </span>
          <ul className="mt-2 space-y-1">
            {sourcePapers.map((paper) => (
              <li key={paper} className="text-xs text-slate-400">
                {paper}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-4 text-[11px] text-slate-500">
        This summary is AI-assisted and human-reviewed. It does not constitute medical
        advice. Always consult authoritative sources and qualified professionals.
      </p>
    </section>
  );
}
