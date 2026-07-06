import { confidenceLabel } from "@/lib/grading";

interface ConfidenceScoreProps {
  score: number;
  evidenceLevel?: string;
}

export default function ConfidenceScore({ score, evidenceLevel }: ConfidenceScoreProps) {
  const label = confidenceLabel(score);
  const barColor =
    score >= 85
      ? "bg-emerald-400"
      : score >= 65
        ? "bg-teal-400"
        : score >= 40
          ? "bg-amber-400"
          : "bg-slate-500";

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
          Confidence score
        </span>
        <span className="text-2xl font-semibold text-slate-50">{score}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>Signal strength: {label}</span>
        {evidenceLevel && <span>{evidenceLevel}</span>}
      </div>
    </div>
  );
}
