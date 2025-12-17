# KoreaNow

Discover what's trending in Korea right now. Experience Korean culture, food, and trends as they happen.

## Overview

KoreaNow is a content-first web experience that brings Korean local trends to global audiences. Built with Next.js 14 and powered by Supabase, it delivers curated editorial content and restaurant guides in a beautiful, magazine-style interface.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended)

## Features

- 🏠 **Home**: Featured editorials and trending restaurants
- 📰 **Editorial**: In-depth stories about Korean culture and trends
- 🍜 **Restaurants**: Curated restaurant guides loved by locals
- 📖 **Glossary**: Korean cultural terms explained
- 🌐 **SEO Optimized**: Meta tags, OpenGraph, and static generation
- 📱 **Responsive**: Mobile-first design

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd korea-now
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
korea-now/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page
│   ├── editorials/          # Editorial pages
│   ├── restaurants/         # Restaurant pages
│   └── glossary/            # Glossary page
├── components/              # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── EditorialCard.tsx
│   ├── RestaurantCard.tsx
│   ├── GlossarySection.tsx
│   └── GlossaryTooltip.tsx
├── lib/                     # Utilities and data layer
│   ├── supabase.ts         # Supabase client
│   └── data/               # Data fetching functions
│       ├── editorials.ts
│       ├── restaurants.ts
│       └── glossary.ts
└── types/                   # TypeScript type definitions
    └── database.ts
```

## Database Schema

The application reads from the following Supabase tables (schema: `koreanow`):

- `food_editorial_posts_translations`: Editorial metadata
- `food_editorial_post_content_translations`: Editorial full content
- `popular_restaurants_translations`: Restaurant metadata
- `popular_restaurant_detail_translations`: Restaurant details

All queries filter by `lang = 'en'` to show English content only.

## Design Principles

- **Content First**: Typography and readability over animations
- **Magazine Style**: Inspired by Eater (layout) × Condé Nast Traveler (tone)
- **Read-Only**: No user authentication or content creation
- **Static Generation**: Pre-rendered pages for performance

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Next.js.

## Contributing

This is a curated project. For questions or suggestions, please contact the team.

## License

All rights reserved.
# korea-now
