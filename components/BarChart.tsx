"use client";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export default function Chart({ data }: { data: { name: string; value: number }[] }) {
  return <div className="h-56 w-full"><ResponsiveContainer><BarChart data={data}><XAxis dataKey="name" stroke="#64748B" fontSize={12} /><YAxis allowDecimals={false} stroke="#64748B" fontSize={12} /><Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155" }} /><Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>;
}
