export type EvidenceGrade =
  | "approved"
  | "strong_repurposing_signal"
  | "moderate_evidence"
  | "weak_evidence"
  | "insufficient_evidence";

export type EvidenceType =
  | "clinical_trial"
  | "observational"
  | "meta_analysis"
  | "preclinical"
  | "fda_label"
  | "real_world_data";

export type ReviewStage =
  | "ai_draft"
  | "scientific_review"
  | "medical_review"
  | "published"
  | "rejected";

export type CitationSource = "pubmed" | "clinicaltrials" | "fda" | "ema" | "other";

export interface Citation {
  id: string;
  source: CitationSource;
  externalId: string;
  title: string;
  authors?: string;
  year?: number;
  url: string;
}

export interface Drug {
  slug: string;
  name: string;
  genericName: string;
  brandNames: string[];
  mechanism: string;
  primaryIndication: string;
  approvalStatus: string;
  atcCode?: string;
  whyThisDrug: string;
  knownRisks: string[];
  targetSlugs: string[];
  relatedDiseaseSlugs: string[];
  similarDrugSlugs: string[];
}

export interface Disease {
  slug: string;
  name: string;
  icd10?: string;
  meshId?: string;
  description: string;
  pathwayClusters: string[];
  unmetNeed: string;
  relatedDrugSlugs: string[];
}

export interface Target {
  slug: string;
  name: string;
  geneSymbol: string;
  uniprotId?: string;
  description: string;
  pathway: string;
  druggability: string;
  relatedDrugSlugs: string[];
  relatedDiseaseSlugs: string[];
}

export interface EvidenceRecord {
  slug: string;
  drugSlug: string;
  diseaseSlug: string;
  targetSlug: string;
  mechanism: string;
  grade: EvidenceGrade;
  evidenceTypes: EvidenceType[];
  clinicalTrialIds: string[];
  pubmedIds: string[];
  phase?: string;
  outcomes: string;
  confidenceScore: number;
  evidenceLevel: string;
  aiSummary: string;
  aiGeneratedAt: string;
  lastVerified: string;
  lastUpdated: string;
  reviewStage: ReviewStage;
  citations: Citation[];
  sourcePapers: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  resource: string;
  details?: string;
}

export interface ReviewQueueItem {
  evidenceSlug: string;
  stage: ReviewStage;
  assignedTo?: string;
  notes?: string;
  updatedAt: string;
}
