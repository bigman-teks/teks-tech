"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <main className="grid min-h-screen place-items-center px-5 text-center" role="alert"><div><h1 className="text-2xl font-bold">Something went wrong. Please try again.</h1><button onClick={reset} className="btn-primary mt-6">Try again</button></div></main>;
}
