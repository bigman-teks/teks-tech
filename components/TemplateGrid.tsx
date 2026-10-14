"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import Reveal from "./Reveal";
import TemplatePreviewModal from "./TemplatePreviewModal";

type T = {
  id: string; name: string; category: string; style?: string | null; description?: string | null; preview?: string | null;
  configuration: any; tags: string[]; priceTier: string; isPremium: boolean; featured: boolean; isNew: boolean; uses: number; createdAt: string;
};
type Access = "all" | "free" | "premium";
type Sort = "featured" | "newest" | "popular";

const sel = "rounded-lg border border-white/15 bg-charcoal px-3 py-2 text-sm outline-none focus:border-bright";
const fontOf = (f?: string) => (f === "sans" ? "var(--font-inter)" : f === "display" ? "var(--font-grotesk)" : "Georgia, serif");

export default function TemplateGrid({ templates, favoriteIds, recentIds, loggedIn }: { templates: T[]; favoriteIds: string[]; recentIds: string[]; loggedIn: boolean }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [access, setAccess] = useState<Access>("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [onlyFav, setOnlyFav] = useState(false);
  const [favs, setFavs] = useState<Set<string>>(new Set(favoriteIds));
  const [favErr, setFavErr] = useState("");
  const [preview, setPreview] = useState<T | null>(null);

  const categories = useMemo(() => ["All", ...Array.from(new Set(templates.map((t) => t.category)))], [templates]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = templates.filter((t) => {
      if (category !== "All" && t.category !== category) return false;
      if (access === "free" && t.isPremium) return false;
      if (access === "premium" && !t.isPremium) return false;
      if (onlyFav && !favs.has(t.id)) return false;
      if (!s) return true;
      return [t.name, t.category, t.style ?? "", t.description ?? "", ...t.tags].some((x) => x.toLowerCase().includes(s));
    });
    const sorted = list.slice();
    if (sort === "popular") sorted.sort((a, b) => b.uses - a.uses || a.name.localeCompare(b.name));
    else if (sort === "newest") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt));
    return sorted;
  }, [templates, q, category, access, sort, onlyFav, favs]);

  const filtersActive = q.trim() !== "" || category !== "All" || access !== "all" || onlyFav;
  const recent = recentIds.map((id) => templates.find((t) => t.id === id)).filter((t): t is T => !!t).slice(0, 4);

  function clearFilters() { setQ(""); setCategory("All"); setAccess("all"); setOnlyFav(false); }

  async function toggleFav(id: string) {
    setFavErr("");
    const was = favs.has(id);
    const apply = (add: boolean) => setFavs((prev) => { const n = new Set(prev); if (add) n.add(id); else n.delete(id); return n; });
    apply(!was);
    try {
      const r = await fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ templateId: id }) });
      if (!r.ok) throw new Error("failed");
    } catch {
      apply(was);
      setFavErr("Could not update your favourites. Please try again.");
    }
  }

  return (<>
    <div className="mb-6 space-y-3">
      <div className="flex flex-wrap gap-3">
        <label className="min-w-[14rem] flex-1"><span className="sr-only">Search templates</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search templates (e.g. gold, wedding, minimal)" className={`${sel} w-full`} /></label>
        <label><span className="sr-only">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={sel}>{categories.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label><span className="sr-only">Free or premium</span>
          <select value={access} onChange={(e) => setAccess(e.target.value as Access)} className={sel}><option value="all">Free &amp; Premium</option><option value="free">Free only</option><option value="premium">Premium only</option></select></label>
        <label><span className="sr-only">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={sel}><option value="featured">Featured first</option><option value="newest">Newest</option><option value="popular">Most popular</option></select></label>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {loggedIn
          ? <button type="button" aria-pressed={onlyFav} onClick={() => setOnlyFav(!onlyFav)} className={`rounded-full border px-3 py-1.5 transition-colors ${onlyFav ? "border-bright bg-electric/20" : "border-white/15 hover:bg-white/5"}`}>♥ My Favourites ({favs.size})</button>
          : <Link href="/login?next=/invitations/templates" className="text-slate2 hover:text-white">Log in to save favourites</Link>}
        <span className="text-slate2">Showing {filtered.length} of {templates.length} templates</span>
        {filtersActive && <button type="button" onClick={clearFilters} className="text-bright">Clear filters</button>}
      </div>
      {favErr && <p role="alert" className="text-sm text-red-400">{favErr}</p>}
    </div>

    {!filtersActive && recent.length > 0 && (
      <section className="mb-8" aria-label="Recently used">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-bright">Recently Used</h2>
        <div className="flex flex-wrap gap-3">
          {recent.map((t) => (
            <Link key={t.id} href={`/invitations/build?mode=template&templateId=${t.id}`} className="card !p-3 text-sm">
              <span className="font-medium">{t.name}</span><span className="ml-2 text-xs text-slate2">{t.category}</span>
            </Link>
          ))}
        </div>
      </section>
    )}

    {!filtered.length ? (
      <div className="card text-center">
        <p>{onlyFav ? "You haven't saved any favourites that match yet." : "No templates match your search."}</p>
        <button type="button" onClick={clearFilters} className="btn-ghost mt-4">Clear filters</button>
      </div>
    ) : (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((t, i) => {
        const th = { primary: "#2563EB", secondary: "#F8FAFC", background: "#0F172A", ...(t.configuration?.theme ?? {}) };
        const isFav = favs.has(t.id);
        return (
          <Reveal key={t.id} delay={Math.min(i, 8) * 60}>
            <article className="card group overflow-hidden !p-0">
              <div className="relative">
                <button type="button" onClick={() => setPreview(t)} aria-label={`Preview ${t.name}`} className="block h-40 w-full overflow-hidden"
                  style={{ background: t.preview ? `url(${t.preview}) center/cover` : `linear-gradient(160deg,${th.primary},${th.background} 70%)` }}>
                  {!t.preview && (
                    <div className="flex h-full flex-col items-center justify-center gap-1 bg-black/10 p-3 text-center transition-transform duration-500 group-hover:scale-110" style={{ color: th.secondary, fontFamily: fontOf(t.configuration?.theme?.font) }}>
                      <p className="text-xs uppercase tracking-[0.25em] opacity-80">You&apos;re Invited</p>
                      <p className="text-lg font-bold">{t.category}</p>
                      <div className="my-1 h-px w-10" style={{ background: th.secondary, opacity: 0.5 }} />
                      <p className="text-xs opacity-70">Tap to preview</p>
                    </div>
                  )}
                </button>
                <div className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1">
                  {t.featured && <span className="rounded-full bg-electric px-2 py-0.5 text-[10px] font-semibold uppercase">Featured</span>}
                  {t.isNew && <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold uppercase text-black">New</span>}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${t.isPremium ? "bg-amber-400 text-black" : "bg-white/80 text-black"}`}>{t.isPremium ? "Premium" : "Free"}</span>
                </div>
                {loggedIn
                  ? <button type="button" onClick={() => toggleFav(t.id)} aria-pressed={isFav} aria-label={isFav ? `Remove ${t.name} from favourites` : `Add ${t.name} to favourites`}
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-base transition-transform hover:scale-110">{isFav ? "♥" : "♡"}</button>
                  : <Link href="/login?next=/invitations/templates" aria-label="Log in to save favourites" className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-base">♡</Link>}
              </div>
              <div className="p-5">
                <h2 className="font-semibold">{t.name}</h2>
                <p className="text-xs text-slate2">{t.category}{t.style ? ` • ${t.style}` : ""}</p>
                {t.description && <p className="mt-2 text-sm text-slate-300">{t.description}</p>}
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => setPreview(t)} className="btn-ghost flex-1 !py-2 transition-transform hover:scale-[1.03]">Preview</button>
                  <Link href={`/invitations/build?mode=template&templateId=${t.id}`} className="btn-primary flex-1 !py-2 transition-transform hover:scale-[1.03]">Use Template</Link>
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}</div>
    )}
    {preview && <TemplatePreviewModal template={preview} onClose={() => setPreview(null)} />}
  </>);
}
