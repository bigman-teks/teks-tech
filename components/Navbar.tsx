"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/content";
export default function Navbar({ logoUrl }: { logoUrl?: string | null } = {}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-white/10 bg-charcoal/90 shadow-lg shadow-black/20 backdrop-blur" : "border-transparent bg-charcoal/60 backdrop-blur-sm"}`}>
      <nav className={`container-x flex items-center justify-between transition-all duration-300 ${scrolled ? "h-14" : "h-16"}`} aria-label="Main">
        <Link href="/" className="flex items-center gap-2 font-display font-bold tracking-tight transition-transform hover:scale-[1.04]">
          {logoUrl
            ? <img src={logoUrl} alt="Teks Tech" className={`w-auto drop-shadow-[0_2px_10px_rgba(37,99,235,0.45)] transition-all duration-300 ${scrolled ? "h-10" : "h-12"}`} />
            : <span className="text-2xl">TEKS <span className="text-bright drop-shadow-[0_0_14px_rgba(37,99,235,0.6)]">TECH</span></span>}
        </Link>
        <ul className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
          {NAV.slice(1).map(([l, h]) => <li key={l}><Link className="relative py-1 transition-colors hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-bright after:transition-all after:duration-300 hover:after:w-full" href={h}>{l}</Link></li>)}
        </ul>
        <div className="flex items-center gap-2">
          <Link href="/register" className="btn-primary hidden !py-2 transition-transform hover:scale-105 sm:inline-flex">Get Started</Link>
          <button className="rounded-lg border border-white/15 p-2 transition-colors hover:bg-white/5 lg:hidden" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300" style={{ transform: open ? "rotate(90deg)" : "none" }}>{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
        </div>
      </nav>
      <ul className={`container-x space-y-1 overflow-hidden transition-all duration-300 lg:hidden ${open ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"}`}>
        {NAV.map(([l, h]) => <li key={l}><Link onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-slate-200 transition-colors hover:bg-white/5" href={h}>{l}</Link></li>)}
        <li><Link onClick={() => setOpen(false)} className="btn-primary mt-2 w-full" href="/register">Get Started</Link></li>
      </ul>
    </header>
  );
}
