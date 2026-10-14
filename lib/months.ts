export const mkey = (d: Date) => d.toISOString().slice(0, 7);
export function byMonth<T>(rows: T[], date: (r: T) => Date, val: (r: T) => number = () => 1, n = 6) {
  const out: { name: string; value: number }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) { const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)); out.push({ name: d.toLocaleString("en", { month: "short", timeZone: "UTC" }), value: 0, ...{ k: mkey(d) } as any }); }
  for (const r of rows) { const b = out.find((o: any) => o.k === mkey(date(r))); if (b) b.value += val(r); }
  return out.map(({ name, value }) => ({ name, value }));
}
