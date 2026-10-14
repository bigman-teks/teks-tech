import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Builder from "@/components/Builder";
export const metadata = { title: "Invitation Builder — Teks Tech" };
export default async function Page({ searchParams }: { searchParams: { id?: string; step?: string; mode?: string; templateId?: string; flyerUrl?: string } }) {
  const s = await getSession(); if (!s) redirect(`/login?next=/invitations/build${searchParams.mode ? `?mode=${searchParams.mode}` : ""}`);
  const [templates, packages] = await Promise.all([
    prisma.template.findMany({ where: { status: "ACTIVE" }, orderBy: { createdAt: "asc" } }),
    prisma.package.findMany({ where: { status: "ACTIVE" }, orderBy: { id: "asc" } }),
  ]);
  let draft = null;
  if (searchParams.id) {
    draft = await prisma.invitation.findFirst({
      where: { id: searchParams.id, userId: s.sub },
      include: { programme: { orderBy: { sortOrder: "asc" } }, contacts: { orderBy: { sortOrder: "asc" } }, faqs: { orderBy: { sortOrder: "asc" } } },
    });
    if (!draft) notFound();
  }
  const mode = (searchParams.mode === "scratch" ? "scratch" : searchParams.mode === "flyer" ? "flyer" : "template") as "scratch" | "template" | "flyer";
  if (mode === "flyer" && !draft && !searchParams.flyerUrl) redirect("/invitations/upload");
  return (
    <Builder
      templates={JSON.parse(JSON.stringify(templates))}
      packages={JSON.parse(JSON.stringify(packages))}
      initialStep={Number(searchParams.step) || 0}
      draft={draft ? JSON.parse(JSON.stringify(draft)) : null}
      mode={mode}
      initialTemplateId={searchParams.templateId}
      initialFlyerUrl={searchParams.flyerUrl}
    />
  );
}
