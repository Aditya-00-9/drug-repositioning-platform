interface MedicalDisclaimerProps {
  className?: string;
  variant?: "dark" | "light";
}

export default function MedicalDisclaimer({
  className = "",
  variant = "dark",
}: MedicalDisclaimerProps) {
  const styles =
    variant === "light"
      ? "border-slate-200 bg-white/80 text-slate-600"
      : "border-teal-400/20 bg-teal-400/10 text-slate-300";
  const labelStyles = variant === "light" ? "text-teal-700" : "text-teal-300";

  return (
    <aside
      className={`rounded-2xl border px-4 py-3 text-xs leading-relaxed ${styles} ${className}`}
    >
      <span className={`font-semibold ${labelStyles}`}>
        Medical disclaimer:{" "}
      </span>
      Results are for research and informational use only and are not medical
      advice, diagnosis, or treatment. Always reach out to qualified doctors and
      medical practitioners before making any healthcare or medication decisions.
    </aside>
  );
}
