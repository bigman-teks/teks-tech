// In-memory limiter: fine for one server. Swap for Redis/Upstash when scaling to multiple instances.
const hits = new Map<string, number[]>();
export function rateLimit(key: string, max = 8, windowMs = 60_000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now); hits.set(key, recent);
  return recent.length <= max;
}
