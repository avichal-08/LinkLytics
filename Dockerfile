FROM oven/bun:1.3.3 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock .npmrc ./
COPY apps/web/package.json apps/web/
COPY apps/redirect/package.json apps/redirect/
COPY apps/consumer/package.json apps/consumer/
COPY packages/db/package.json packages/db/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/typescript-config/package.json packages/typescript-config/
RUN bun install --frozen-lockfile

FROM base AS redirect
ENV NODE_ENV=production
COPY --from=deps /app ./
COPY packages ./packages
COPY apps/redirect ./apps/redirect
WORKDIR /app/apps/redirect
USER bun
EXPOSE 3001
CMD ["bun", "server.ts"]

FROM base AS consumer
ENV NODE_ENV=production
COPY --from=deps /app ./
COPY packages ./packages
COPY apps/consumer ./apps/consumer
WORKDIR /app/apps/consumer
USER bun
CMD ["bun", "index.ts"]

FROM base AS web-build
COPY --from=node:22-slim /usr/local/bin/node /usr/local/bin/node
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app ./
COPY packages ./packages
COPY apps/web ./apps/web
WORKDIR /app/apps/web
RUN bun run build && rm -rf .next/cache

FROM base AS web
COPY --from=node:22-slim /usr/local/bin/node /usr/local/bin/node
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=web-build /app ./
WORKDIR /app/apps/web
USER bun
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
