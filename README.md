# Story Time (Full Stack)

A secure, full-stack audio story application built with React (Vite) and Node.js (Express).

## Project Structure

- **client/**: The React frontend. Contains the UI for the library and audio player.
- **server/**: The Node.js backend. Handles API requests securely and serves the frontend static files.

## Local Development

1.  **Install Dependencies:**
    ```bash
    npm run install-all
    ```

2.  **Start Backend (Port 3000):**
    ```bash
    cd server
    npm run dev
    ```

3.  **Start Frontend (Port 5173):**
    ```bash
    cd client
    npm run dev
    ```
    *Note: The frontend proxies `/api` requests to `localhost:3000`.*

## Deployment (Render/Heroku)

This project is configured for easy deployment.

**Build Command:**
```bash
npm run build
```
*This installs dependencies, builds the React app to `client/dist`, and compiles the TypeScript server.*

**Start Command:**
```bash
npm start
```
*This starts the Express server, which serves the `client/dist` files as a static site.*

## Environment Variables

Create a `.env` file in the `server/` directory (or set in Render Dashboard):

```env
PORT=3000
OPENAI_API_KEY=sk-... (or GEMINI_API_KEY)
```
