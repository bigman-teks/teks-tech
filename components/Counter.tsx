"use client";
import { useEffect, useRef, useState } from "react";
// Animates from 0 up to `value` once visible. Value must be a real number from the database — never invented.
export default function Counter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const start = performance.now(), dur = 900;
      const tick = (t: number) => { const p = Math.min(1, (t - start) / dur), eased = 1 - Math.pow(1 - p, 3); setN(Math.round(value * eased)); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <div ref={ref} className="text-center"><p className="font-mono text-4xl font-bold text-bright">{n}{suffix}</p><p className="mt-1 text-sm text-slate-300">{label}</p></div>;
}
