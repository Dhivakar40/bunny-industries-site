import { Redis } from '@upstash/redis';

// ── Storage ───────────────────────────────────────────────────
// Upstash Redis (Vercel Marketplace → Upstash).
// Env vars injected automatically by the Vercel integration:
//   KV_REST_API_URL  (or UPSTASH_REDIS_REST_URL)
//   KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_TOKEN)
const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CONTENT_KEY = 'bunny-cms-content';

// ── CORS ──────────────────────────────────────────────────────
// ALLOWED_CONTROLLER_ORIGIN must be set in imsweb's Vercel env vars.
// e.g. "https://imscontroller.vercel.app"
// Set to "*" during initial setup, then lock it down to the real domain.
function corsHeaders(req) {
  const origin = process.env.ALLOWED_CONTROLLER_ORIGIN ?? '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// ── Auth ──────────────────────────────────────────────────────
function isAuthorized(req) {
  const secret = process.env.CONTROLLER_API_SECRET;
  if (!secret) return false; // no secret configured → deny
  const auth = req.headers.authorization ?? req.headers['Authorization'] ?? '';
  return auth === `Bearer ${secret}`;
}

// ── Shallow merge helper (mirrors ContentContext logic) ────────
function mergeContent(base, patch) {
  const merged = { ...base };
  Object.keys(patch).forEach((key) => {
    if (patch[key] !== undefined && merged[key] !== undefined) {
      merged[key] = { ...merged[key], ...patch[key] };
    }
  });
  return merged;
}

function setCorsHeaders(res, cors) {
  Object.entries(cors).forEach(([key, val]) => res.setHeader(key, val));
}

// ── Handler ───────────────────────────────────────────────────
export default async function handler(req, res) {
  const cors = corsHeaders(req);

  // Pre-flight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res, cors);
    return res.status(204).end();
  }

  // ── GET /api/content ─────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const stored = await redis.get(CONTENT_KEY);
      if (!stored) {
        // First request ever — return empty object; seed script will populate.
        setCorsHeaders(res, cors);
        return res.status(200).json({});
      }
      const content = typeof stored === 'string' ? JSON.parse(stored) : stored;
      setCorsHeaders(res, cors);
      return res.status(200).json(content);
    } catch (err) {
      console.error('[GET /api/content]', err);
      setCorsHeaders(res, cors);
      return res.status(500).json({ error: 'Failed to read content' });
    }
  }

  // ── PATCH /api/content ───────────────────────────────────────
  if (req.method === 'PATCH') {
    if (!isAuthorized(req)) {
      setCorsHeaders(res, cors);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const patch = req.body;
      if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
        setCorsHeaders(res, cors);
        return res.status(400).json({ error: 'Body must be a JSON object' });
      }

      // Read current, merge, write back
      const current = await redis.get(CONTENT_KEY);
      const base = current
        ? (typeof current === 'string' ? JSON.parse(current) : current)
        : {};

      const merged = mergeContent(base, patch);
      await redis.set(CONTENT_KEY, JSON.stringify(merged));

      setCorsHeaders(res, cors);
      return res.status(200).json(merged);
    } catch (err) {
      console.error('[PATCH /api/content]', err);
      setCorsHeaders(res, cors);
      return res.status(500).json({ error: 'Failed to save content' });
    }
  }

  setCorsHeaders(res, cors);
  return res.status(405).json({ error: 'Method not allowed' });
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '2mb' },
  },
};
