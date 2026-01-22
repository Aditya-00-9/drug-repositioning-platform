export type EvidenceTier = "Approved" | "Supportive" | "Investigational";
export type Drug = DrugProfile;

export type EvidenceRecord = {
  title: string;
  source: "PubMed" | "ClinicalTrials.gov";
  year: number;
  link: string;
  tier: EvidenceTier;
  notes?: string;
};

export type DrugProfile = {
  id: string;
  name: string;
  approvedUses: string[];
  evidence: EvidenceRecord[];
  summary: string;
  lastUpdated: string;
};
