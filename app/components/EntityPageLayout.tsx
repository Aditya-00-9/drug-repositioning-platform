import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MedicalDisclaimer from "@/app/components/MedicalDisclaimer";

interface EntityPageLayoutProps {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function EntityPageLayout({
  backHref,
  backLabel,
  eyebrow,
  title,
  description,
  children,
}: EntityPageLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 via-black to-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.24),_transparent_55%)] opacity-60" />
      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <Link
          href={backHref}
          className="mb-10 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500 transition-colors hover:text-teal-300"
        >
          <ArrowLeft size={14} /> {backLabel}
        </Link>
        <div className="mb-10">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
            {description}
          </p>
          <MedicalDisclaimer className="mt-6 max-w-2xl" />
        </div>
        {children}
      </div>
    </main>
  );
}
