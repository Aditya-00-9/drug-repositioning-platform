import { DRUGS } from "./store";
import { DISEASES } from "./store/diseases";
import { TARGETS } from "./store/targets";
import type { DrugProfile, DiseaseProfile, TargetProfile } from "./types";

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

export function getDiseaseById(id?: string): DiseaseProfile | undefined {
  if (!id) return undefined;
  const normalizedId = id.toLowerCase().trim().replace(/\s+/g, "-");
  return DISEASES.find((d) => d.id === normalizedId);
}

export function getDiseases(): DiseaseProfile[] {
  return DISEASES;
}

export function searchDiseases(query: string): DiseaseProfile[] {
  const q = query.toLowerCase().trim();
  return DISEASES.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      d.pathwayClusters.some((p) => p.toLowerCase().includes(q))
  );
}

export function getTargetById(id?: string): TargetProfile | undefined {
  if (!id) return undefined;
  const normalizedId = id.toLowerCase().trim();
  return TARGETS.find((t) => t.id === normalizedId);
}

export function getTargets(): TargetProfile[] {
  return TARGETS;
}

export function searchTargets(query: string): TargetProfile[] {
  const q = query.toLowerCase().trim();
  return TARGETS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.pathway.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)
  );
}
