# CrowdSolve

CrowdSolve is a full-stack smart city platform that helps citizens report civic issues, lets communities upvote local problems, and helps authorities prioritize action using an AI-inspired urgency score.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT
- Maps: Google Maps JavaScript API ready integration

## Features

- Citizen and authority signup/login
- Home-zone based localized civic feed
- Issue reporting with media URL or file upload support
- Upvotes, comments, status tracking, and threshold-based authority flagging
- AI urgency score using votes, category weight, and time elapsed
- Authority dashboard with heatmap-ready location data and ranked issue queue
- Smart City design system using teal, navy, and accent orange

## Project Structure

```text
CrowdSolve/
  client/   # React frontend
  server/   # Express API
```

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the env templates:

   ```bash
   copy server\\.env.example server\\.env
   copy client\\.env.example client\\.env
   ```

3. Start both apps:

   ```bash
   npm run dev
   ```

4. Open:

- Frontend: `http://localhost:5173`
- API: `http://localhost:5000/api`

## Environment Variables

### Server

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `UPLOADS_BASE_URL`
- `AUTHORITY_THRESHOLD_VOTES`

### Client

- `VITE_API_URL`
- `VITE_GOOGLE_MAPS_API_KEY`

## AI Urgency Scoring

CrowdSolve computes a score using:

```text
Score = (Votes * 0.4) + (CategoryWeight * 0.4) + (TimeElapsed * 0.2)
```

The backend normalizes time into a capped age score so unresolved, high-impact issues naturally rise in priority.
