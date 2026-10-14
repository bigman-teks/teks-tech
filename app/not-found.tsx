import Link from "next/link";
export default function NotFound() {
  return <main className="grid min-h-screen place-items-center px-5 text-center"><div><p className="font-mono text-5xl text-bright">404</p><h1 className="mt-3 text-2xl font-bold">Page not found</h1><p className="mt-2 text-slate-300">The page you are looking for does not exist.</p><Link href="/" className="btn-primary mt-6">Back to home</Link></div></main>;
}
