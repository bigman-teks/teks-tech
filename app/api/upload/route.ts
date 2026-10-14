import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireUser } from "@/lib/guard";
import { rateLimit } from "@/lib/rateLimit";
const IMG = ["image/jpeg", "image/png", "image/webp"], AUD = ["audio/mpeg", "audio/mp4", "audio/wav"];
export async function POST(req: NextRequest) {
  const g = await requireUser(); if ("error" in g) return g.error;
  if (!rateLimit("up:" + g.session.sub, 30)) return NextResponse.json({ error: "Too many uploads. Please wait a moment." }, { status: 429 });
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET)
    return NextResponse.json({ error: "Image storage is not configured." }, { status: 503 });
  cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
  const file = (await req.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });
  const isImg = IMG.includes(file.type), isAud = AUD.includes(file.type);
  if (!isImg && !isAud) return NextResponse.json({ error: "Unsupported file type. Use JPG, PNG, WebP or MP3." }, { status: 415 });
  if (file.size > (isImg ? 5 : 10) * 1024 * 1024) return NextResponse.json({ error: `File too large (max ${isImg ? 5 : 10}MB).` }, { status: 413 });
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const r: any = await new Promise((ok, no) => cloudinary.uploader.upload_stream(
      { folder: `teks-invite/${g.session.sub}`, resource_type: isImg ? "image" : "video" }, (e, x) => (e ? no(e) : ok(x))).end(buf));
    return NextResponse.json({ url: r.secure_url });
  } catch { return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 }); }
}
