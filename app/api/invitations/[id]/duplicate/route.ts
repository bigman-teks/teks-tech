import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guard";
import { jsonOrNull } from "@/lib/prismaJson";
import type { Prisma } from "@prisma/client";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const g = await requireUser(); if ("error" in g) return g.error;
  const s = await prisma.invitation.findFirst({
    where: { id: params.id, userId: g.session.sub },
    include: { programme: true, contacts: true, faqs: true },
  });
  if (!s) return NextResponse.json({ error: "Not found." }, { status: 404 });
  // The copy starts as a fresh draft: no slug, no views, not published, and it needs its own payment.
  const copy = await prisma.$transaction(async (tx) => {
    const inv = await tx.invitation.create({
      data: {
        userId: s.userId, templateId: s.templateId, sourceType: s.sourceType, originalFlyerUrl: s.originalFlyerUrl,
        eventType: s.eventType, eventTitle: `${s.eventTitle} (copy)`, hostName: s.hostName,
        date: s.date, startTime: s.startTime, endTime: s.endTime, venue: s.venue, address: s.address, mapUrl: s.mapUrl,
        description: s.description, hashtag: s.hashtag, music: s.music, rsvpEnabled: s.rsvpEnabled, packageId: s.packageId,
        personalMessage: jsonOrNull(s.personalMessage), dressCode: jsonOrNull(s.dressCode),
        photos: (s.photos ?? {}) as Prisma.InputJsonValue, theme: (s.theme ?? {}) as Prisma.InputJsonValue,
        status: "DRAFT",
      },
    });
    if (s.programme.length) await tx.programmeItem.createMany({ data: s.programme.map((p) => ({ invitationId: inv.id, time: p.time, title: p.title, description: p.description, sortOrder: p.sortOrder })) });
    if (s.contacts.length) await tx.invitationContact.createMany({ data: s.contacts.map((c) => ({ invitationId: inv.id, role: c.role, name: c.name, phone: c.phone, whatsapp: c.whatsapp, sortOrder: c.sortOrder })) });
    if (s.faqs.length) await tx.faq.createMany({ data: s.faqs.map((f) => ({ invitationId: inv.id, question: f.question, answer: f.answer, sortOrder: f.sortOrder })) });
    return inv;
  });
  return NextResponse.json(copy, { status: 201 });
}
