# CrowdSolve

CrowdSolve is a full-stack smart city platform that helps citizens report civic issues, lets communities upvote local problems, and helps authorities prioritize action using an AI-inspired urgency score.

# Overview

CrowdSolve connects citizens and local authorities through one digital platform. Users can report issues such as damaged roads, garbage collection problems, water leaks, streetlight failures, and public safety concerns. The system ranks issues using an urgency score based on category, votes, and time.

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
│
├── client/                     
│   ├── src/
│   │   ├── components/         
│   │   ├── hooks/            
│   │   ├── pages/              
│   │   ├── utils/              
│   │   ├── App.jsx             
│   │   └── main.jsx            
│   ├── .env.example           
│   ├── package.json
│   └── vite.config.js
│
├── server/                     
│   ├── config/                
│   ├── controllers/           
│   ├── middleware/             
│   ├── models/                 
│   ├── routes/                 
│   ├── services/              
│   ├── uploads/               
│   ├── .env.example            
│   ├── server.js              
│   └── package.json
│
├── package.json                
├── package-lock.json
└── README.md

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

:
## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT
- Maps: Google Maps JavaScript API ready integration

## Impact

CrowdSolve helps make civic issue reporting more transparent, organized, and community-driven. Citizens can make their voices heard, while authorities receive data-driven priorities instead of unstructured complaints. This can improve response time, encourage public participation, and support smarter urban governance.

## Future Improvements

- Real-time notifications
- Google Maps issue visualization
- Image storage using Cloudinary or AWS S3
- Role-based authority management
- Analytics and reporting dashboard
- Mobile application
- AI-based image classification for issue categories
