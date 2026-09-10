import { handleUpload } from '@vercel/blob/client';

// ── CORS ──────────────────────────────────────────────────────
function corsHeaders() {
  const origin = process.env.ALLOWED_CONTROLLER_ORIGIN ?? '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// ── Auth ──────────────────────────────────────────────────────
function isAuthorized(req) {
  const secret = process.env.CONTROLLER_API_SECRET;
  if (!secret) return false;
  const auth = req.headers.authorization ?? req.headers['Authorization'] ?? '';
  return auth === `Bearer ${secret}`;
}

// ── Handler ───────────────────────────────────────────────────
// This endpoint acts as the Vercel Blob client-upload handler:
//   1. Browser calls POST /api/upload with { type: 'blob.generate-client-token', ... }
//   2. This server validates auth, generates a short-lived upload token
//   3. Browser uses the token to upload directly to Vercel Blob's CDN
//   4. Vercel Blob calls back to this endpoint with { type: 'blob.upload-completed' }
//   5. This server acknowledges; the browser receives the public Blob URL
//
// The browser never sends the file through this serverless function,
// avoiding the 4.5 MB body limit on Vercel.
export default async function handler(req, res) {
  const cors = corsHeaders();

  if (req.method === 'OPTIONS') {
    return res.status(204).set(cors).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).set(cors).json({ error: 'Method not allowed' });
  }

  // All POST requests to this route must be authorized
  if (!isAuthorized(req)) {
    return res.status(401).set(cors).json({ error: 'Unauthorized' });
  }

  try {
    const response = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Validate the requested file type
        const ext = pathname.split('.').pop()?.toLowerCase() ?? '';
        const allowedImages = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
        const allowedDocs = ['pdf'];
        const allowed = [...allowedImages, ...allowedDocs];

        if (!allowed.includes(ext)) {
          throw new Error(`File type .${ext} is not allowed. Allowed: ${allowed.join(', ')}`);
        }

        // Allow files up to 20 MB
        return {
          allowedContentTypes: [
            'image/png', 'image/jpeg', 'image/svg+xml', 'image/webp',
            'application/pdf',
          ],
          maximumSizeInBytes: 20 * 1024 * 1024, // 20 MB
          tokenPayload: JSON.stringify({ uploadedAt: new Date().toISOString() }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Upload confirmed — log for debugging. In a more complex system,
        // you might update a database of known asset URLs here.
        console.log('[upload completed]', blob.url);
      },
    });

    return res.status(200).set(cors).json(response);
  } catch (err) {
    console.error('[POST /api/upload]', err);
    return res.status(400).set(cors).json({ error: err.message ?? 'Upload failed' });
  }
}

export const config = {
  api: {
    bodyParser: false, // handleUpload reads the raw body itself
  },
};
