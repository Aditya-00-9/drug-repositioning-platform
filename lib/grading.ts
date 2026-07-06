import type { EvidenceGrade } from "./types";

export const GRADE_LABELS: Record<EvidenceGrade, string> = {
  approved: "Approved",
  strong_repurposing_signal: "Strong Repurposing Signal",
  moderate_evidence: "Moderate Evidence",
  weak_evidence: "Weak Evidence",
  insufficient_evidence: "Insufficient Evidence",
};

export const GRADE_DESCRIPTIONS: Record<EvidenceGrade, string> = {
  approved:
    "Regulatory approval or guideline endorsement for this drug–disease pairing.",
  strong_repurposing_signal:
    "Multiple converging lines of evidence from trials, literature, and mechanistic data.",
  moderate_evidence:
    "Promising signals with some clinical or preclinical support; further validation needed.",
  weak_evidence:
    "Limited or inconsistent evidence; hypothesis-generating only.",
  insufficient_evidence:
    "Not enough data to support a repositioning claim at this time.",
};

export const GRADE_STYLES: Record<EvidenceGrade, string> = {
  approved: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/40",
  strong_repurposing_signal: "bg-teal-500/20 text-teal-300 ring-teal-500/40",
  moderate_evidence: "bg-amber-500/20 text-amber-300 ring-amber-500/40",
  weak_evidence: "bg-orange-500/20 text-orange-300 ring-orange-500/40",
  insufficient_evidence: "bg-slate-500/20 text-slate-400 ring-slate-500/40",
};

export function formatGrade(grade: EvidenceGrade): string {
  return GRADE_LABELS[grade];
}

export function confidenceLabel(score: number): string {
  if (score >= 85) return "High";
  if (score >= 65) return "Moderate";
  if (score >= 40) return "Low";
  return "Very Low";
}
