import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Repositioning Intelligence",
  description: "Computational research platform for drug repurposing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-navy-900 text-slate-50 antialiased">
        {/* Global chrome */}
        <header className="fixed top-0 z-50 w-full border-b border-slate-800/70 bg-navy-900/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-50 to-slate-300 text-navy-900 shadow-md shadow-slate-900/40">
                <span className="text-[10px] font-semibold tracking-[0.18em]">
                  RI
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-100">
                  Repositioning Intelligence
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                  Drug Repurposing Research Platform
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-10 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
              <Link
                href="/"
                className="transition-colors hover:text-teal-300/90"
              >
                Home
              </Link>
              <Link
                href="/drug"
                className="transition-colors hover:text-teal-300/90"
              >
                Drugs
              </Link>
              <Link
                href="/disease-portal"
                className="transition-colors hover:text-teal-300/90"
              >
                Diseases
              </Link>
              <Link
                href="/target-portal"
                className="transition-colors hover:text-teal-300/90"
              >
                Targets
              </Link>

              <div className="hidden items-center gap-3 border-l border-slate-800 pl-6 text-[10px] font-mono text-slate-500 md:flex">
                <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-teal-300/90 ring-1 ring-teal-500/30">
                  Research build · 2026
                </span>
                <span>v1.0.4</span>
              </div>
            </nav>
          </div>
        </header>

        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
