# Linklytics

A high-throughput, event-driven URL shortening and click-analytics platform. Built as a decoupled monorepo designed to eliminate hot-path database contention, withstand viral traffic spikes, and provide real-time aggregate reporting without front-end memory leaks.

## Architecture Overview

```text
                                  +-------------------+
                                  |   Next.js (Web)   | <---> PostgreSQL (Drizzle)
                                  |  Dashboard & Auth |       (Aggregations via SQL)
                                  +-------------------+
                                            ^
                                            | (Manage Links)
                                            v
[HTTP Request] ---> +-----------------------------------+
                    |      Express Redirect Service     |
                    | (apps/redirect - Bun runtime:3001)|
                    +-----------------------------------+
                             |                      |
                   Cache Hit |                      | Cache Miss / Fallback
                             v                      v
                    +-----------------+    +-----------------+
                    |  Redis (ioredis)|    |   PostgreSQL    |
                    |  Local TCP/RAM  |    |  (Neon/Local)   |
                    +-----------------+    +-----------------+
                             |
                      (Fire-and-Forget)
                             v
                    +-----------------------------------+
                    |     Apache Kafka (KRaft mode)     |
                    |        Topic: click-events        |
                    +-----------------------------------+
                                     |
                             (Consumer Group)
                                     v
                    +-----------------------------------+
                    |         Consumer Worker           |
                    | (apps/consumer - Bun runtime)     |
                    +-----------------------------------+
                                     |
                             (Batched Inserts)
                                     v
                    +-----------------------------------+
                    |            PostgreSQL             |
                    |       linkAnalytics Table        |
                    +-----------------------------------+
```

## Key Engineering Decisions

- **Decoupled Redirect Hot-Path (`apps/redirect`):** Redirect processing runs on a lightweight Express instance using Bun, bypassing front-end framework overhead and connection-pooling limits.

- **Cache-Aside with Negative Caching:** Destination URLs are resolved through Redis with a 24-hour TTL. Non-existent slugs are negative-cached for 60 seconds (`NOT_FOUND`) to protect PostgreSQL from repeated invalid requests and potential denial-of-service traffic.

- **Event-Driven Buffering (Apache Kafka):** Click tracking is decoupled from HTTP redirects. Instead of awaiting database writes or holding queue connections in serverless environments, the redirect service asynchronously publishes click payloads to Kafka before returning `302 Found`.

- **Micro-Batched Ingestion (`apps/consumer`):** A persistent worker consumes from the `click-ingester-group` Kafka consumer group and performs bulk multi-row inserts into PostgreSQL through Drizzle ORM, eliminating per-event database I/O bottlenecks.

- **Privacy & GDPR Compliance:** Visitor hashes are generated using salted SHA-256 hashes with daily rotating salts rather than storing raw IP addresses.

- **Push-Down SQL Aggregations:** Dashboard analytics use native PostgreSQL aggregations (`GROUP BY`, `COUNT`, `date_trunc`, `COUNT(DISTINCT ...)`) directly in the database. Large historical datasets are aggregated in PostgreSQL instead of loading unaggregated rows into front-end memory.

## Monorepo Structure

```text
├── apps/
│   ├── consumer/         # Kafka consumer; parses UA/geo data & batch-inserts to Postgres
│   ├── redirect/         # High-performance Express redirect server & Kafka producer
│   └── web/              # Next.js 16 dashboard, NextAuth authentication, and analytics UI
├── packages/
│   └── db/               # Shared Drizzle ORM schema, migrations, and PostgreSQL client
├── docker-compose.yml    # Local multi-container cluster (Kafka in KRaft mode, Redis)
├── redirect.k6.js        # k6 load-testing suite (hit, notfound, and mixed scenarios)
└── BENCHMARKS.md         # Production benchmark documentation and latency breakdowns
```

## Tech Stack

- **Runtimes & Frameworks:** [Bun](https://bun.sh/), [Next.js](https://nextjs.org/) (App Router), [Express](https://expressjs.com/)
- **Message Broker:** [Apache Kafka](https://kafka.apache.org/) (v3.7, KRaft Mode)
- **Caching Tier:** [Redis](https://redis.io/) via `ioredis`
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) (Neon compatible) via [Drizzle ORM](https://orm.drizzle.team/)
- **Load Testing & Observability:** [k6](https://k6.io/), KafkaJS

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.1+)
- [Docker Desktop](https://www.docker.com/) (WSL2 backend on Windows)
- [k6](https://k6.io/) (for running load tests)

### 1. Infrastructure Setup

Start the background infrastructure — Apache Kafka in KRaft mode and Redis:

```bash
docker compose up -d
```

Verify that both containers (`kafka-1` on port `9092` and `redis-1` on port `6379`) report healthy states.

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/linklytics

# Broker & Cache
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092

# Auth & Web (apps/web)
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
# Install workspace packages
bun install
```

### 4. Running the Development Services

Run all workspace applications concurrently using Turborepo:

```bash
bun run dev
```

Alternatively, start services individually:

```bash
# Redirect service (Port 3001)
cd apps/redirect && bun run dev

# Event ingestion worker
cd apps/consumer && bun run dev

# Web dashboard (Port 3000)
cd apps/web && bun run dev
```

## Load Testing & Performance

Performance characteristics are validated using custom `k6` test profiles simulating mixed caching conditions, cache hits, and high-frequency invalid slug lookups.

To run the standard mixed-traffic load test (80% hits / 20% misses):

```bash
k6 run -e SCENARIO=mixed redirect.k6.js
```

### Benchmark Highlights

**Mixed Traffic Scenario — 80% Cache Hits / 20% Cache Misses**

- **Success Rate:** 100.0%
- **Error Rate:** 0.00%
- **Total Requests:** 11,077
- **Throughput:** 184.6 req/s
- **Cache Hit Latency (p50):** `15.24 ms`
- **Cache Hit Latency (p95):** `54.07 ms`
- **Global Latency (p95):** `141.77 ms`
- **Worker Batching:** Micro-batches click ingestion directly from Kafka buffers, eliminating per-event database connection stalls.

The system also sustained a **0.00% error rate across 22,000+ total requests** across the benchmark scenarios.

For detailed metrics, resource-consumption profiles, latency breakdowns, and testing methodology, see [`BENCHMARKS.md`](./BENCHMARKS.md).

## Design Goals

Linklytics is designed around three core principles:

1. **Keep the redirect path fast.**  
   URL resolution should not depend on analytics processing.

2. **Move expensive work off the request path.**  
   Kafka acts as a durable buffer between incoming traffic and PostgreSQL ingestion.

3. **Aggregate where the data lives.**  
   PostgreSQL performs analytics aggregation instead of transferring large datasets to the application or browser.

This allows the system to remain responsive even when analytics traffic spikes independently of redirect traffic.
