import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
export const metadata = { title: "Register — Teks Tech" };
export default function Page() { return <Suspense><AuthForm mode="register" /></Suspense>; }
