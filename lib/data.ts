import {
  auditLogs as seedAuditLogs,
  diseases as seedDiseases,
  drugs as seedDrugs,
  evidenceRecords as seedEvidence,
  reviewQueue as seedReviewQueue,
  targets as seedTargets,
} from "./seed-data";
import type {
  AuditLogEntry,
  Disease,
  Drug,
  EvidenceRecord,
  ReviewQueueItem,
  Target,
} from "./types";

export function getAllDrugs(): Drug[] {
  return seedDrugs;
}

export function getDrugBySlug(slug: string): Drug | undefined {
  return seedDrugs.find((d) => d.slug === slug);
}

export function getAllDiseases(): Disease[] {
  return seedDiseases;
}

export function getDiseaseBySlug(slug: string): Disease | undefined {
  return seedDiseases.find((d) => d.slug === slug);
}

export function getAllTargets(): Target[] {
  return seedTargets;
}

export function getTargetBySlug(slug: string): Target | undefined {
  return seedTargets.find((t) => t.slug === slug);
}

export function getAllEvidence(): EvidenceRecord[] {
  return seedEvidence.filter((e) => e.reviewStage === "published");
}

export function getEvidenceBySlug(slug: string): EvidenceRecord | undefined {
  return seedEvidence.find((e) => e.slug === slug);
}

export function getEvidenceForDrug(drugSlug: string): EvidenceRecord[] {
  return getAllEvidence().filter((e) => e.drugSlug === drugSlug);
}

export function getEvidenceForDisease(diseaseSlug: string): EvidenceRecord[] {
  return getAllEvidence().filter((e) => e.diseaseSlug === diseaseSlug);
}

export function getEvidenceForTarget(targetSlug: string): EvidenceRecord[] {
  return getAllEvidence().filter((e) => e.targetSlug === targetSlug);
}

export function getRelatedDrugs(drug: Drug): Drug[] {
  return drug.similarDrugSlugs
    .map((slug) => getDrugBySlug(slug))
    .filter((d): d is Drug => d !== undefined);
}

export function getRelatedDiseasesForDrug(drug: Drug): Disease[] {
  return drug.relatedDiseaseSlugs
    .map((slug) => getDiseaseBySlug(slug))
    .filter((d): d is Disease => d !== undefined);
}

export function getReviewQueue(): ReviewQueueItem[] {
  return seedReviewQueue;
}

export function getAuditLogs(): AuditLogEntry[] {
  return [...seedAuditLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getPlatformStats() {
  const published = getAllEvidence();
  return {
    drugCount: seedDrugs.length,
    diseaseCount: seedDiseases.length,
    targetCount: seedTargets.length,
    evidenceCount: published.length,
    avgConfidence: Math.round(
      published.reduce((sum, e) => sum + e.confidenceScore, 0) / published.length
    ),
  };
}
