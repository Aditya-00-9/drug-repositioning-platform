interface EmptyEvidenceStateProps {
  entityType: "drug" | "disease" | "target";
  entityName: string;
}

export default function EmptyEvidenceState({
  entityType,
  entityName,
}: EmptyEvidenceStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-10 text-center">
      <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-slate-500">
        No evidence loaded yet
      </p>
      <h3 className="mt-3 text-lg font-semibold text-slate-200">
        Evidence pipeline pending for {entityName}
      </h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
        We do not display empty dashboards. This {entityType} profile exists in our
        index, but no verified drug–disease evidence records have been published
        yet. Our review workflow requires scientific and medical sign-off before
        any repositioning claims appear here.
      </p>
      <p className="mt-4 text-xs text-slate-500">
        Expected sources: PubMed, ClinicalTrials.gov, FDA labels, and peer-reviewed
        literature.
      </p>
    </div>
  );
}
