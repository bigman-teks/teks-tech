import crypto from "crypto";
import { prisma } from "@/lib/prisma";
const BASE = "https://api.paystack.co";
const key = () => { const k = process.env.PAYSTACK_SECRET_KEY; if (!k) throw new Error("PAYSTACK_SECRET_KEY not set"); return k; };
export async function paystack(path: string, init?: RequestInit) {
  const r = await fetch(BASE + path, { ...init, headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" }, cache: "no-store" });
  const j = await r.json().catch(() => null);
  if (!r.ok || !j?.status) throw new Error(j?.message ?? "Paystack request failed");
  return j.data;
}
export function validSignature(raw: string, sig: string | null) {
  if (!sig) return false;
  const h = crypto.createHmac("sha512", key()).update(raw).digest("hex");
  return h.length === sig.length && crypto.timingSafeEqual(Buffer.from(h), Buffer.from(sig));
}
/** The ONLY place an order becomes PAID: we ask Paystack directly and compare amount + currency to our own order. */
export async function settleOrder(reference: string): Promise<"PAID" | "FAILED" | "PENDING" | "NOT_FOUND"> {
  const order = await prisma.order.findUnique({ where: { paymentReference: reference } });
  if (!order) return "NOT_FOUND";
  if (order.status === "PAID") return "PAID";
  const tx = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`);
  if (tx.status === "success") {
    if (tx.amount !== order.amountKobo || tx.currency !== "NGN") {
      await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
      return "FAILED";
    }
    await prisma.order.update({ where: { id: order.id }, data: { status: "PAID", paidAt: new Date() } });
    return "PAID";
  }
  if (["failed", "abandoned", "reversed"].includes(tx.status)) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    return "FAILED";
  }
  return "PENDING";
}
