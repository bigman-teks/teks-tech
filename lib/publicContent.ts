import { prisma } from "@/lib/prisma";
import { SERVICES, PORTFOLIO } from "@/lib/content";
// Admin-managed content from the database; falls back to defaults in lib/content.ts when the DB is empty or unreachable.
export async function getServices() {
  try {
    const rows = await prisma.service.findMany({ where: { status: "ACTIVE" }, orderBy: { sortOrder: "asc" } });
    if (rows.length) return rows.map((s) => ({ name: s.name, desc: s.description, features: s.features as string[], cta: s.ctaLabel, href: s.ctaHref }));
  } catch {}
  return SERVICES;
}
export async function getPortfolio() {
  try {
    const rows = await prisma.portfolioItem.findMany({ where: { published: true }, orderBy: { createdAt: "asc" } });
    if (rows.length) return rows.map((p) => ({ name: p.name, cat: p.category, desc: p.description, imageUrl: p.imageUrl, href: p.projectUrl }));
  } catch {}
  return PORTFOLIO.map((p) => ({ ...p, imageUrl: null as string | null, href: null as string | null }));
}
