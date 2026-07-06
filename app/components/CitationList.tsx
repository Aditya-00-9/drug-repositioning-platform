import type { Citation } from "@/lib/types";
import { ExternalLink } from "lucide-react";

const SOURCE_LABELS: Record<Citation["source"], string> = {
  pubmed: "PubMed",
  clinicaltrials: "ClinicalTrials.gov",
  fda: "FDA",
  ema: "EMA",
  other: "Source",
};

interface CitationListProps {
  citations: Citation[];
}

export default function CitationList({ citations }: CitationListProps) {
  if (citations.length === 0) {
    return (
      <p className="text-sm text-slate-400">No citations available for this record.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {citations.map((c) => (
        <li
          key={c.id}
          className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-teal-300">
                {SOURCE_LABELS[c.source]} · {c.externalId}
              </span>
              <p className="mt-1 text-sm font-medium text-slate-100">{c.title}</p>
              {(c.authors || c.year) && (
                <p className="mt-1 text-xs text-slate-400">
                  {c.authors}
                  {c.authors && c.year ? ` (${c.year})` : c.year ? `(${c.year})` : ""}
                </p>
              )}
            </div>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1 text-[11px] font-mono uppercase tracking-[0.18em] text-teal-300 hover:text-teal-200"
            >
              View <ExternalLink size={12} />
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
