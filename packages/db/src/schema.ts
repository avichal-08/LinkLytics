import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

// --- NEXTAUTH TABLES (Prisma Style: Text IDs) ---

export const users = pgTable("user", {
  // Prisma: String @id @default(uuid())
  // Drizzle Equivalent: text with randomUUID default
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const accounts = pgTable(
  "account",
  {
    // Prisma: String @id @default(cuid())
    // Drizzle: text with randomUUID (simpler than installing cuid package)
    id: text("id")
      .$defaultFn(() => crypto.randomUUID()),

    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

// --- YOUR LINKS TABLES ---

export const links = pgTable(
  "link",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    slug: varchar("slug", { length: 64 }).notNull().unique(),
    destinationUrl: text("destination_url").notNull(),
    isActive: integer("is_active").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("links_user_id_idx").on(table.userId),
    slugIdx: index("links_slug_idx").on(table.slug),
  })
);

// ... (Add linkAnalytics with text("id") as well)

export const linkAnalytics = pgTable(
  "link_analytic",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    linkId: text("link_id")
      .notNull()
      .references(() => links.id, { onDelete: "cascade" }),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .defaultNow()
      .notNull(),
    visitorHash: varchar("visitor_hash", { length: 128 }).notNull(),
    deviceType: varchar("device_type", { length: 32 }),
    os: varchar("os", { length: 64 }),
    browser: varchar("browser", { length: 64 }),
    countryCode: varchar("country_code", { length: 8 }),
    referrer: text("referrer"),
    utmSource: varchar("utm_source", { length: 128 }),
    utmMedium: varchar("utm_medium", { length: 128 }),
    utmCampaign: varchar("utm_campaign", { length: 128 }),
  },
  (table) => ({
    linkTimeIdx: index("analytics_link_time_idx").on(
      table.linkId,
      table.timestamp
    ),
    linkVisitorIdx: index("analytics_link_visitor_idx").on(
      table.linkId,
      table.visitorHash
    ),
  })
);