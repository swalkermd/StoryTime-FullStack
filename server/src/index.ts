import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

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
