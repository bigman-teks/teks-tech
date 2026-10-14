import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signSession, setSessionCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
const schema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1) });
export async function POST(req: NextRequest) {
  if (!rateLimit("login:" + (req.headers.get("x-forwarded-for") ?? "ip")))
    return NextResponse.json({ error: "Too many attempts. Please try again shortly." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  const bad = () => NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  if (!parsed.success) return bad();
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return bad();
  if (user.status === "SUSPENDED") return NextResponse.json({ error: "This account has been suspended." }, { status: 403 });
  const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
  setSessionCookie(res, await signSession({ sub: user.id, role: user.role }));
  return res;
}
