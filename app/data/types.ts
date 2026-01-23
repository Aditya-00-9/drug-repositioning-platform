// app/data/types.ts

export type EvidenceTier = "Approved" | "Supportive" | "Investigational";

export type SourceQuality = "RCT" | "Meta-analysis" | "Observational" | "Systematic Review" | "Case Study";

export type EvidenceRecord = {
  title: string;
  source: "PubMed" | "ClinicalTrials.gov";
  year: number;
  link: string;
  tier: EvidenceTier;
  notes?: string;
  quality?: SourceQuality; // Tier 2 - Source Quality Tags
};

/**
 * Final UI / API model
 * This is what pages and components consume
 */
export type DrugProfile = {
  id: string;
  name: string;
  approvedUses: string[];
  evidence: EvidenceRecord[];
  summary: string;
  lastUpdated: string;
};

/**
 * Internal pipeline model
 * This is what data normalization produces
 */
export type NormalizedDrug = {
  id: string;
  name: string;
  originalIndication: string;
  mechanism: string;
  repurposedIndications: string[];
};
