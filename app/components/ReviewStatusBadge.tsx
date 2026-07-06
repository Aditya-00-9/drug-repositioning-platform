import type { ReviewStage } from "@/lib/types";

const STAGE_LABELS: Record<ReviewStage, string> = {
  ai_draft: "AI Draft",
  scientific_review: "Scientific Review",
  medical_review: "Medical Review",
  published: "Published",
  rejected: "Rejected",
};

const STAGE_STYLES: Record<ReviewStage, string> = {
  ai_draft: "bg-slate-500/20 text-slate-300",
  scientific_review: "bg-blue-500/20 text-blue-300",
  medical_review: "bg-purple-500/20 text-purple-300",
  published: "bg-emerald-500/20 text-emerald-300",
  rejected: "bg-red-500/20 text-red-300",
};

interface ReviewStatusBadgeProps {
  stage: ReviewStage;
}

export default function ReviewStatusBadge({ stage }: ReviewStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] ${STAGE_STYLES[stage]}`}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}
