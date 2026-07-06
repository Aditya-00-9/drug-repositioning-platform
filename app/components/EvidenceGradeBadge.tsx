"use client";

import type { EvidenceGrade } from "@/lib/types";
import { GRADE_LABELS, GRADE_STYLES } from "@/lib/grading";

interface EvidenceGradeBadgeProps {
  grade: EvidenceGrade;
  showDescription?: boolean;
}

export default function EvidenceGradeBadge({
  grade,
  showDescription = false,
}: EvidenceGradeBadgeProps) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] ring-1 ${GRADE_STYLES[grade]}`}
      >
        {GRADE_LABELS[grade]}
      </span>
      {showDescription && (
        <span className="text-xs text-slate-400">
          {grade.replace(/_/g, " ")}
        </span>
      )}
    </div>
  );
}
