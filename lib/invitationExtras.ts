import { z } from "zod";
import { programmeItemSchema, contactSchema, faqSchema } from "./invitationSchema";
export const extrasSchema = z.object({
  programme: z.array(programmeItemSchema).max(30).optional(),
  contacts: z.array(contactSchema).max(10).optional(),
  faqs: z.array(faqSchema).max(30).optional(),
});
export type Extras = z.infer<typeof extrasSchema>;

// Replaces an invitation's programme/contacts/faqs with the given lists (only for keys actually present),
// assigning sortOrder from array position. Called inside the same transaction as the invitation write.
export async function syncExtras(tx: any, invitationId: string, extras: Extras) {
  if (extras.programme) {
    await tx.programmeItem.deleteMany({ where: { invitationId } });
    if (extras.programme.length) await tx.programmeItem.createMany({ data: extras.programme.map((p: any, i: number) => ({ ...p, sortOrder: i, invitationId })) });
  }
  if (extras.contacts) {
    await tx.invitationContact.deleteMany({ where: { invitationId } });
    if (extras.contacts.length) await tx.invitationContact.createMany({ data: extras.contacts.map((c: any, i: number) => ({ ...c, sortOrder: i, invitationId })) });
  }
  if (extras.faqs) {
    await tx.faq.deleteMany({ where: { invitationId } });
    if (extras.faqs.length) await tx.faq.createMany({ data: extras.faqs.map((f: any, i: number) => ({ ...f, sortOrder: i, invitationId })) });
  }
}
