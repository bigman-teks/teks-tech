import { prisma } from "@/lib/prisma";
export type Founder = { name: string; title: string; bio: string; photoUrl: string | null };
export type Logo = { url: string | null };
export const DEFAULT_FOUNDER: Founder = {
  name: "Emmanuel Wonyinson Tekite", title: "Founder & CEO, Teks Tech",
  bio: "Emmanuel founded Teks Tech to bring practical, well-built technology to individuals, businesses and organizations — from websites and digital invitations to data dashboards and business automation.\n\nHe brings a background in structured leadership and operations to how Teks Tech works, having served as a leader within the Nigerian Air Force and held leadership roles including District and State Secretary within the Royal Rangers organization in Bayelsa State, where he also authored a leadership training handbook used to train other officers.\n\nThat same discipline — plan carefully, build properly, deliver what was promised — is what Teks Tech aims to bring to every project.",
  photoUrl: null,
};
// Reads from the database; falls back to defaults if not yet set or the DB is unreachable, so pages never break.
export async function getFounder(): Promise<Founder> {
  try { const r = await prisma.setting.findUnique({ where: { key: "founder" } }); if (r) return { ...DEFAULT_FOUNDER, ...(r.value as object) }; } catch {}
  return DEFAULT_FOUNDER;
}
export async function getLogo(): Promise<Logo> {
  try { const r = await prisma.setting.findUnique({ where: { key: "logo" } }); if (r) return r.value as Logo; } catch {}
  return { url: null };
}
