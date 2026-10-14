"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
function Inner() {
  const ref = useSearchParams().get("reference") ?? useSearchParams().get("trxref");
  const [s, setS] = useState<"loading" | "PAID" | "FAILED" | "PENDING" | "error">("loading"), [inv, setInv] = useState<string | null>(null);
  useEffect(() => {
    if (!ref) { setS("error"); return; }
    let tries = 0;
    const run = async () => {
      try {
        const r = await fetch(`/api/payments/verify?reference=${encodeURIComponent(ref)}`); const j = await r.json();
        if (!r.ok) return setS("error");
        setInv(j.invitationId);
        if (j.status === "PENDING" && ++tries < 5) return setTimeout(run, 2500);
        setS(j.status);
      } catch { setS("error"); }
    };
    run();
  }, [ref]);
  const back = inv ? `/invitations/build?id=${inv}&step=8` : "/dashboard";
  return (
    <main className="grid min-h-screen place-items-center px-5"><div className="card max-w-sm text-center" role="status">
      {s === "loading" && <p>Verifying payment...</p>}
      {s === "PAID" && <><h1 className="text-xl font-bold text-green-400">Payment confirmed</h1><p className="mt-2 text-sm text-slate-300">You can now publish your invitation.</p><Link href={back} className="btn-primary mt-5">Continue to publish</Link></>}
      {(s === "FAILED" || s === "PENDING") && <><h1 className="text-xl font-bold text-red-400">{s === "FAILED" ? "Payment failed" : "Payment not confirmed yet"}</h1><p className="mt-2 text-sm text-slate-300">{s === "FAILED" ? "You have not been charged for this attempt." : "If you were charged, it will be confirmed automatically shortly."}</p><Link href={back} className="btn-primary mt-5">Try again</Link></>}
      {s === "error" && <><h1 className="text-xl font-bold">Something went wrong. Please try again.</h1><Link href="/dashboard/payments" className="btn-ghost mt-5">View payments</Link></>}
    </div></main>
  );
}
export default function Page() { return <Suspense><Inner /></Suspense>; }
