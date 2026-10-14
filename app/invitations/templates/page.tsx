import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import TemplateGrid from "@/components/TemplateGrid";
import { prisma } from "@/lib/prisma";
import { getLogo } from "@/lib/siteSettings";
import { getSession } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const metadata = { title: "Digital Invitation Templates — Teks Tech", description: "Browse original digital invitation templates for weddings, birthdays, ceremonies and more." };
export default async function Page() {
  const session = await getSession();
  const [rows, logo, favs, mine] = await Promise.all([
    prisma.template.findMany({ where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" }, include: { _count: { select: { invitations: true } } } }).catch(() => []),
    getLogo(),
    session ? prisma.favorite.findMany({ where: { userId: session.sub }, select: { templateId: true } }).catch(() => []) : Promise.resolve([]),
    session ? prisma.invitation.findMany({ where: { userId: session.sub, templateId: { not: null } }, orderBy: { createdAt: "desc" }, select: { templateId: true }, take: 20 }).catch(() => []) : Promise.resolve([]),
  ]);
  const cutoff = Date.now() - 30 * 864e5;
  const templates = rows.map((t) => ({
    id: t.id, name: t.name, category: t.category, style: t.style, description: t.description, preview: t.preview,
    configuration: t.configuration,
    tags: Array.isArray(t.tags) ? (t.tags as unknown[]).filter((x): x is string => typeof x === "string") : [],
    priceTier: t.priceTier, isPremium: t.isPremium || t.priceTier === "PREMIUM", featured: t.featured,
    isNew: t.createdAt.getTime() > cutoff, uses: t._count.invitations, createdAt: t.createdAt.toISOString(),
  }));
  const recentIds = Array.from(new Set(mine.map((m) => m.templateId).filter((id): id is string => id !== null)));
  return (<><Navbar logoUrl={logo.url} /><main className="container-x py-16">
    <Reveal className="mb-8"><h1 className="text-3xl font-bold">Digital Invitation Templates</h1><p className="mt-2 text-slate-300">Original Teks Tech designs. Preview any template as a real invitation before you use it.</p></Reveal>
    {!templates.length ? <p className="text-slate-300">No templates are available yet. Please check back soon.</p>
      : <TemplateGrid templates={templates} favoriteIds={favs.map((f) => f.templateId)} recentIds={recentIds} loggedIn={!!session} />}
  </main><Footer logoUrl={logo.url} /></>);
}
