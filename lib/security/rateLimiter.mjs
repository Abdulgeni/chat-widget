const buckets = new Map(); // sessionId -> { count, windowStart }
const WINDOW_MS = 60000;
const MAX_PER_WINDOW = 10;

export function checkRateLimit(sessionId) {
  const now = Date.now();
  let bucket = buckets.get(sessionId);
  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    bucket = { count: 0, windowStart: now };
    buckets.set(sessionId, bucket);
  }
  bucket.count += 1;
  return bucket.count <= MAX_PER_WINDOW;
}