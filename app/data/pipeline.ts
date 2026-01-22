import { DRUGS } from "./store";
import type { DrugProfile } from "./types";

export function getDrugById(id?: string): DrugProfile | undefined {
  if (!id) return undefined;

  const normalizedId = id.toLowerCase().trim();
  return DRUGS.find((d) => d.id === normalizedId);
}

export function getDrugs(): DrugProfile[] {
  return DRUGS;
}

export function searchDrugs(query: string): DrugProfile[] {
  const q = query.toLowerCase().trim();
  return DRUGS.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q)
  );
}
