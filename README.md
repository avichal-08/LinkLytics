# Linklytics

A high-performance URL shortener and real-time analytics engine. I built this project to handle fast link redirection and asynchronous data processing at scale, ensuring the main web application is never blocked by database writes.

**[Live Demo](https://linklytics-two.vercel.app/)**

## The Architecture

Linklytics operates on a distributed, event-driven architecture to keep redirects under 100ms:

1. **The Intercept:** A user hits a short link (e.g., `linklytics-two.vercel.app/slug`).
2. **The Cache:** The Next.js server checks Upstash Redis. If the destination URL is cached, it redirects instantly. If it's a cache miss, it queries PostgreSQL, caches the result, and then redirects.
3. **The Queue:** To avoid slowing down the redirect response, visitor metadata (IP, User-Agent, Vercel geolocation headers) is immediately pushed to a BullMQ Redis queue.
4. **The Worker:** A standalone background worker picks up the job from the queue, parses the raw data into meaningful analytics (OS, Browser, Location), and inserts it into the PostgreSQL database.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS, Shadcn UI, Recharts
- **Backend:** Next.js API Routes, NextAuth.js
- **Database & ORM:** PostgreSQL, Drizzle ORM
- **Caching & Queue:** Upstash Redis, BullMQ
- **Tooling:** TypeScript, Bun, Turborepo
- **Deployment:** Vercel (Web App), Render (Background Worker)

## Local Setup

This project is structured as a monorepo using **Turborepo** and uses **Bun** as the primary package manager and runtime for the worker.

### Prerequisites
- [Bun](https://bun.sh/) installed on your machine.
- A PostgreSQL database string.
- A Redis instance (Upstash is highly recommended for serverless).

### 1. Clone the repository
```bash
git clone [https://github.com/avichal-08/LinkLytics.git](https://github.com/avichal-08/LinkLytics.git)
cd LinkLytics
bun install
```

### 2. Install dependencies
```bash
bun install
```

### 3. Set up environment variables
# Database
```text
DATABASE_URL="postgresql://user:password@host:port/db?sslmode=require"
```

# Redis (Upstash)
```text
REDIS_REST_URL="[https://your-upstash-url.upstash.io](https://your-upstash-url.upstash.io)"
REDIS_REST_TOKEN="your_upstash_token"
REDIS_TCP_URL="rediss://default:password@host:port"
```

# NextAuth
```text
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_string"
GOOGLE_CLIENT_ID="your_google_id"
GOOGLE_CLIENT_SECRET="your_google_secret"
```

### 4. Run database migrations
```bash
cd packages/db
bun run generate
bun run push
cd ../..
```

### 5. Start the development server
```bash
bun dev
```

## Project Structure
```text
├── apps
│   ├── web        # Main Next.js application (UI, Auth, Analytics Dashboard)
│   └── worker     # Bun background worker for processing click analytics
├── packages
│   ├── db         # Database configuration, Drizzle schema, and queries
│   └── queue      # Shared BullMQ setup and types
└── turbo.json     # Monorepo build pipeline
```