import { z } from "zod";
const url = z.string().url().max(500);
export const draftSchema = z.object({
  templateId: z.string().min(1).nullable().optional(),
  sourceType: z.enum(["TEMPLATE", "UPLOADED_FLYER", "SCRATCH"]).optional(),
  originalFlyerUrl: url.nullable().optional(),
  packageId: z.string().nullable().optional(),
  eventType: z.string().trim().min(1).max(40),
  eventTitle: z.string().trim().min(1).max(120),
  hostName: z.string().trim().min(1).max(120),
  date: z.string().datetime().nullable().optional(),
  startTime: z.string().max(10).nullable().optional(),
  endTime: z.string().max(10).nullable().optional(),
  venue: z.string().max(160).nullable().optional(),
  address: z.string().max(300).nullable().optional(),
  mapUrl: z.string().max(500).nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
  personalMessage: z.object({ heading: z.string().max(120).optional(), message: z.string().max(1000).optional(), signature: z.string().max(120).optional() }).nullable().optional(),
  dressCode: z.object({ title: z.string().max(120).optional(), description: z.string().max(500).optional(), colors: z.array(z.string().max(30)).max(10).optional() }).nullable().optional(),
  hashtag: z.string().max(60).nullable().optional(),
  photos: z.object({ main: url.optional(), person: url.optional(), background: url.optional(), gallery: z.array(url).max(12).optional() }).optional(),
  theme: z.object({ primary: z.string().regex(/^#[0-9a-fA-F]{6}$/), secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/), background: z.string().regex(/^#[0-9a-fA-F]{6}$/), font: z.enum(["serif", "sans", "display", "mono"]) }).optional(),
  music: url.nullable().optional(),
  rsvpEnabled: z.boolean().optional(),
});
export const publishRequired = z.object({ date: z.string().datetime(), venue: z.string().min(1), eventTitle: z.string().min(1), hostName: z.string().min(1) });

export const programmeItemSchema = z.object({ time: z.string().max(20).optional(), title: z.string().trim().min(1).max(120), description: z.string().max(300).optional(), sortOrder: z.number().int().optional() });
export const contactSchema = z.object({ role: z.string().trim().min(1).max(60), name: z.string().trim().min(1).max(120), phone: z.string().max(20).optional(), whatsapp: z.string().max(20).optional(), sortOrder: z.number().int().optional() });
export const faqSchema = z.object({ question: z.string().trim().min(1).max(200), answer: z.string().trim().min(1).max(1000), sortOrder: z.number().int().optional() });
