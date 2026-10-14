import { NextRequest, NextResponse } from "next/server";
import { settleOrder, validSignature } from "@/lib/paystack";
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!validSignature(raw, req.headers.get("x-paystack-signature"))) return new NextResponse("invalid signature", { status: 401 });
  try {
    const e = JSON.parse(raw);
    if (e.event === "charge.success" && typeof e.data?.reference === "string") await settleOrder(e.data.reference); // re-verifies with Paystack, never trusts the payload
  } catch { return new NextResponse("error", { status: 500 }); }
  return new NextResponse("ok");
}
