// app/data/normalize.ts

import { NormalizedDrug } from "./types";
import { fetchPubMedRepurposing } from "./sources/pubmed";
import { fetchDrugBankTargets } from "./sources/drugbank";


export function normalizeDrugData(): NormalizedDrug[] {
  const pubmed = fetchPubMedRepurposing();
  const targets = fetchDrugBankTargets();

  return [
    {
      id: "metformin",
      name: "Metformin",
      originalIndication: "Type 2 Diabetes Mellitus",
      mechanism:
        "Activation of AMPK leading to reduced hepatic gluconeogenesis",
      repurposedIndications: pubmed.map((p) => p.disease),
    },
  ];
}
