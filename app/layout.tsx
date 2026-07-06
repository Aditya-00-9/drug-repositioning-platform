import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Repositioning Intelligence",
  description:
    "Research intelligence platform for drug repurposing — evidence-backed drug, disease, and target analysis for qualified professionals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-navy-900 text-slate-50 antialiased">
        <header className="fixed top-0 z-50 w-full border-b border-slate-800/70 bg-navy-900/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-50 to-slate-300 text-navy-900 shadow-md shadow-slate-900/40">
                <span className="text-[10px] font-semibold tracking-[0.18em]">RI</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-100">
                  Repositioning Intelligence
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                  Research Intelligence · Not for Patient Care
                </span>
              </div>
            </Link>

            <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 md:flex">
              <Link href="/" className="transition-colors hover:text-teal-300/90">
                Home
              </Link>
              <Link href="/drugs" className="transition-colors hover:text-teal-300/90">
                Drugs
              </Link>
              <Link href="/diseases" className="transition-colors hover:text-teal-300/90">
                Diseases
              </Link>
              <Link href="/targets" className="transition-colors hover:text-teal-300/90">
                Targets
              </Link>
              <Link href="/evidence" className="transition-colors hover:text-teal-300/90">
                Evidence
              </Link>
              <Link href="/audiences" className="transition-colors hover:text-teal-300/90">
                Solutions
              </Link>
              <div className="flex items-center gap-3 border-l border-slate-800 pl-6 text-[10px] font-mono text-slate-500">
                <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-teal-300/90 ring-1 ring-teal-500/30">
                  v1.1.0
                </span>
              </div>
            </nav>
          </div>
        </header>

        <main className="pt-20">{children}</main>

        <footer className="border-t border-slate-800/70 bg-black py-10">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-xs leading-relaxed text-slate-500">
              Repositioning Intelligence is a research and decision-support platform for
              qualified professionals in pharma, biotech, academia, and translational
              research. It is not intended for patient care, diagnosis, or treatment
              decisions. All evidence records include citations from PubMed,
              ClinicalTrials.gov, and FDA labels where applicable.
            </p>
            <div className="mt-4 flex flex-wrap gap-6 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-600">
              <Link href="/audiences/pharma" className="hover:text-teal-300">
                Pharma
              </Link>
              <Link href="/audiences/biotech" className="hover:text-teal-300">
                Biotech
              </Link>
              <Link href="/audiences/academia" className="hover:text-teal-300">
                Academia
              </Link>
              <Link href="/audiences/investors" className="hover:text-teal-300">
                Investors
              </Link>
              <Link href="/audiences/researchers" className="hover:text-teal-300">
                Researchers
              </Link>
              <Link href="/login" className="hover:text-teal-300">
                Reviewer login
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
