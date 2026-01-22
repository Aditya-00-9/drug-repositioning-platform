import { Drug } from "./types";
import { fetchPubMedRepurposing } from "./sources/pubmed";
import { fetchDrugBankTargets } from "./sources/drugbank";

export function normalizeDrugData(): Drug[] {
  const pubmed = fetchPubMedRepurposing();
  const targets = fetchDrugBankTargets();

  return [
    {
      id: "metformin",
      name: "Metformin",
      originalIndication: "Type 2 Diabetes Mellitus",
      mechanism:
        "Activation of AMPK leading to reduced hepatic gluconeogenesis",
      repurposedIndications: pubmed.map((p) => ({
        disease: p.disease,
        rationale: p.rationale,
        evidenceLevel: "Preclinical + Observational",
        sources: [
          {
            name: "PubMed",
            year: p.year,
          },
        ],
      })),
      targets: targets["Metformin"],
      lastUpdated: "2024-11",
    },
  ];
}
