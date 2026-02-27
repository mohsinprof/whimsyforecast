# Whimsy Forecast

A modern weather dashboard built with React, TypeScript, Vite, and Tailwind.  
It shows current weather, hourly/forecast details, city search, and favourite cities.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- TanStack React Query
- React Router

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Add environment variables

Create a `.env` file in the project root:

```env
OPENWEATHER_API_KEY=your_openweather_api_key
```

For local serverless + frontend routing, run with Netlify Dev:

```bash
npx netlify dev
```

### 3) Run development server

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Type-check and create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Build for Production

```bash
npm run build
```

Output is generated in the `dist/` folder.

## Deployment

Recommended options:

- Vercel
- Netlify
- Cloudflare Pages

For all platforms:

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `OPENWEATHER_API_KEY`

## API Key Security Note

Do not store private keys in `VITE_*` variables because they are included in client bundles.

## Project Structure

- `src/api/` - API config, types, and weather service
- `src/components/` - UI and feature components
- `src/hooks/` - Custom hooks (weather, geolocation, favourites, storage)
- `src/pages/` - Route-level pages
