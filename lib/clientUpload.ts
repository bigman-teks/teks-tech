"use client";
// Shared XHR uploader (gives progress events, unlike fetch) used by the Builder and the flyer uploader.
export function uploadFile(file: File, onProgress: (n: number) => void): Promise<string> {
  return new Promise((ok, no) => {
    const x = new XMLHttpRequest(), f = new FormData(); f.append("file", file);
    x.open("POST", "/api/upload");
    x.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    x.onload = () => { try { const j = JSON.parse(x.responseText); x.status < 300 ? ok(j.url) : no(new Error(j.error)); } catch { no(new Error("Upload failed. Please try again.")); } };
    x.onerror = () => no(new Error("Network error during upload."));
    x.send(f);
  });
}
