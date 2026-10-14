import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import InvitationView from "@/components/InvitationView";
import GuestActions, { Countdown } from "@/components/GuestActions";
const load = (slug: string) => prisma.invitation.findFirst({
  where: { slug, status: "PUBLISHED" },
  include: { programme: { orderBy: { sortOrder: "asc" } }, contacts: { orderBy: { sortOrder: "asc" } }, faqs: { orderBy: { sortOrder: "asc" } } },
});
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const i = await load(params.slug); if (!i) return { title: "Invitation not found", robots: { index: false } };
  const d = i.date?.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
  const desc = [i.eventTitle, d, i.venue].filter(Boolean).join(" • ");
  const img = (i.photos as any)?.main ?? (i.photos as any)?.background;
  return { title: `${i.hostName} — ${i.eventTitle}`, description: desc, robots: { index: false }, openGraph: { title: `You're invited: ${i.hostName}`, description: desc, images: img ? [img] : [] } };
}
export default async function Page({ params }: { params: { slug: string } }) {
  const i = await load(params.slug);
  if (!i) return <main className="grid min-h-screen place-items-center p-6 text-center"><p>This invitation could not be found or is no longer available.</p></main>;
  const theme = (i.theme ?? {}) as any;
  return (
    <InvitationView
      inv={{ ...i, date: i.date?.toISOString(), photos: i.photos as any, theme, personalMessage: i.personalMessage as any, dressCode: i.dressCode as any }}
      countdown={i.date ? <Countdown to={i.date.toISOString()} /> : null}
      programme={i.programme}
      contacts={i.contacts}
      faqs={i.faqs}
      actions={<GuestActions slug={i.slug!} title={`${i.hostName} — ${i.eventTitle}`} venue={i.venue} address={i.address} mapUrl={i.mapUrl} start={i.date?.toISOString()} rsvp={i.rsvpEnabled} music={i.music} color={theme.primary ?? "#2563EB"} />}
    />
  );
}
