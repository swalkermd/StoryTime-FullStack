import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

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

// Example Secure Endpoint (Placeholder for AI logic)
app.post('/api/generate-story', async (req, res) => {
  // TODO: Implement OpenAI/Gemini logic here using process.env.API_KEY
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing API key configuration' });
  }

  // Mock response for now
  res.json({ 
    success: true, 
    message: "This represents a secure backend response.",
    content: "Once upon a time..." 
  });
});

// Serve Static Frontend (Production)
// We will build the client to ../client/dist
const CLIENT_BUILD_PATH = path.join(__dirname, '../../client/dist');
app.use(express.static(CLIENT_BUILD_PATH));

// Handle SPA routing: serve index.html for any unknown path
app.get('*', (req, res) => {
  res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
