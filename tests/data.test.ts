import { describe, it, expect } from "vitest";
import {
  getAllDrugs,
  getDrugBySlug,
  getAllEvidence,
  getEvidenceBySlug,
  getPlatformStats,
} from "@/lib/data";
import { formatGrade, confidenceLabel, GRADE_LABELS } from "@/lib/grading";

describe("data layer", () => {
  it("returns 10 curated drugs", () => {
    expect(getAllDrugs()).toHaveLength(10);
  });

  it("resolves levothyroxine (Synthroid) by slug", () => {
    const drug = getDrugBySlug("levothyroxine");
    expect(drug).toBeDefined();
    expect(drug?.brandNames).toContain("Synthroid");
  });

  it("returns 10 published evidence records", () => {
    expect(getAllEvidence()).toHaveLength(10);
  });

  it("includes hypothyroidism evidence for levothyroxine", () => {
    const evidence = getEvidenceBySlug("levothyroxine-hypothyroidism");
    expect(evidence).toBeDefined();
    expect(evidence?.grade).toBe("approved");
    expect(evidence?.confidenceScore).toBeGreaterThan(90);
  });

  it("computes platform stats from real data", () => {
    const stats = getPlatformStats();
    expect(stats.evidenceCount).toBe(10);
    expect(stats.avgConfidence).toBeGreaterThan(0);
  });
});

describe("evidence grading", () => {
  it("maps all grade keys to labels", () => {
    expect(formatGrade("approved")).toBe(GRADE_LABELS.approved);
    expect(formatGrade("insufficient_evidence")).toBe(GRADE_LABELS.insufficient_evidence);
  });

  it("labels confidence scores correctly", () => {
    expect(confidenceLabel(90)).toBe("High");
    expect(confidenceLabel(50)).toBe("Low");
    expect(confidenceLabel(12)).toBe("Very Low");
  });
});

describe("evidence citations", () => {
  it("every published record has at least one citation", () => {
    for (const record of getAllEvidence()) {
      expect(record.citations.length).toBeGreaterThan(0);
      expect(record.pubmedIds.length + record.clinicalTrialIds.length).toBeGreaterThan(0);
    }
  });

  it("insufficient evidence record has low confidence", () => {
    const hcq = getEvidenceBySlug("hydroxychloroquine-covid-19");
    expect(hcq?.grade).toBe("insufficient_evidence");
    expect(hcq?.confidenceScore).toBeLessThan(20);
  });
});
