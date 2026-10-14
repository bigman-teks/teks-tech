"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { uploadFile } from "@/lib/clientUpload";

export default function FlyerUploader() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [pct, setPct] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function pick(f: File | undefined) {
    if (!f) return;
    setErr(""); setUrl(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) { setErr("Please upload a JPG, PNG or WebP image. PDF support is coming soon."); return; }
    if (f.size > 5 * 1024 * 1024) { setErr("That file is too large — please keep it under 5MB."); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function doUpload() {
    if (!file) return;
    setBusy(true); setErr(""); setPct(0);
    try { setUrl(await uploadFile(file, setPct)); }
    catch (e: any) { setErr(e.message ?? "Your flyer could not be uploaded. Please check the file type and size."); }
    finally { setBusy(false); setPct(null); }
  }

  function remove() { setFile(null); setPreview(null); setUrl(null); setErr(""); setConfirmed(false); }

  function go() {
    if (!url || !confirmed) return;
    router.push(`/invitations/build?mode=flyer&flyerUrl=${encodeURIComponent(url)}`);
  }

  return (
    <div className="card mx-auto max-w-lg">
      {!preview ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }}
          className="rounded-xl border border-dashed border-white/25 p-10 text-center"
        >
          <p className="font-semibold">Already have a flyer?</p>
          <p className="mt-1 text-sm text-slate-300">Upload your flyer and turn it into an interactive digital invitation.</p>
          <label className="btn-primary mt-5 inline-flex cursor-pointer">Choose File<input type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={(e) => pick(e.target.files?.[0])} /></label>
          <p className="mt-4 text-xs text-slate2">or drag and drop here — JPG, PNG or WebP, up to 5MB</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-4">
            <img src={preview} alt="Your flyer" className="h-24 w-24 rounded-lg object-cover" />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-medium">{file?.name}</p>
              <p className="text-slate2">{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : ""}</p>
              {!url && !busy && <div className="mt-2 flex gap-3"><button onClick={remove} className="text-xs text-red-400">Remove</button><label className="cursor-pointer text-xs text-bright">Replace<input type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={(e) => pick(e.target.files?.[0])} /></label></div>}
            </div>
          </div>

          {pct !== null && <div className="mt-4 h-2 overflow-hidden rounded bg-white/10"><div className="h-full bg-bright transition-all" style={{ width: `${pct}%` }} /></div>}

          {!url && !busy && (
            <button onClick={doUpload} className="btn-primary mt-5 w-full">Upload Flyer</button>
          )}

          {url && (
            <div className="mt-5 space-y-4">
              <label className="flex items-start gap-3 text-sm text-slate-300">
                <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                I confirm that I have the right to use this flyer/design and its contents.
              </label>
              <button disabled={!confirmed} onClick={go} className="btn-primary w-full disabled:opacity-60">Continue to Builder</button>
            </div>
          )}
        </div>
      )}
      {err && <p role="alert" className="mt-4 text-sm text-red-400">{err}</p>}
    </div>
  );
}
