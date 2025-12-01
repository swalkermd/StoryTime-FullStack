import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Audio proxy to avoid client-side CORS issues with the storage bucket.
app.get('/api/audio', async (req, res) => {
  const raw = req.query.key as string | undefined;
  if (!raw) {
    return res.status(400).json({ error: 'Missing key parameter' });
  }

  const key = decodeURIComponent(raw);
  if (!key.startsWith('Storytime-audio-files/')) {
    return res.status(400).json({ error: 'Invalid key parameter' });
  }

  const upstream = `https://storage.googleapis.com/${key}`;
  try {
    const upstreamRes = await fetch(upstream, {
      headers: req.headers.range ? { Range: req.headers.range as string } : undefined,
    });

    // Forward status and relevant headers for range streaming.
    res.status(upstreamRes.status);
    const forwardHeaders = [
      'content-type',
      'content-length',
      'accept-ranges',
      'content-range',
      'cache-control',
      'etag',
      'last-modified',
    ];
    forwardHeaders.forEach((h) => {
      const value = upstreamRes.headers.get(h);
      if (value) res.setHeader(h, value);
    });

    if (!upstreamRes.body) {
      return res.end();
    }
    // Convert web ReadableStream to Node stream
    Readable.fromWeb(upstreamRes.body as any).pipe(res);
  } catch (err) {
    console.error('Audio proxy error', err);
    res.status(502).json({ error: 'Failed to fetch audio' });
  }
});

// Serve Static Frontend (Production)
// Resolve client build whether running from src (dev) or dist (prod)
const clientBuildCandidates = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../../../client/dist'),
];
const clientBuildPath = clientBuildCandidates.find((candidate) => fs.existsSync(candidate));

if (clientBuildPath) {
  app.use(express.static(clientBuildPath));

  // SPA fallback: use app.use to avoid path-to-regexp wildcard issues in Express 5
  app.use((req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  console.warn('Client build not found; static file serving is disabled.');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
