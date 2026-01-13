# Kulabour Admin Dashboard

The web-based administration panel for the Kulabour platform.

## Features
- **Dashboard Overview**: Revenue analytics, Active Workers, Booking stats.
- **Real-time Data**: Fetches data from the NestJS Backend (`/admin/stats`).

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`

## Tech Stack
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Backend Connection
Configured in `src/utils/api.ts`. Default: `http://localhost:3000`.
