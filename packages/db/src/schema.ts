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

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
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
    destinationUrl: text("destinationUrl").notNull(),
    isActive: integer("isActive").default(1).notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("link_user_id_idx").on(table.userId),
    slugIdx: index("link_slug_idx").on(table.slug),
  })
);

export const linkAnalytics = pgTable(
  "linkAnalytic",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    linkId: text("linkId")
      .notNull()
      .references(() => links.id, { onDelete: "cascade" }),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .defaultNow()
      .notNull(),
    visitorHash: varchar("visitorHash", { length: 128 }).notNull(),
    deviceType: varchar("deviceType", { length: 32 }),
    os: varchar("os", { length: 64 }),
    browser: varchar("browser", { length: 64 }),
    countryCode: varchar("countryCode", { length: 8 }),
    city: text("city"),
    referrer: text("referrer")
  },
  (table) => ({
    linkTimeIdx: index("analytic_link_time_idx").on(
      table.linkId,
      table.timestamp
    ),
    linkVisitorIdx: index("analytic_link_visitor_idx").on(
      table.linkId,
      table.visitorHash
    ),
  })
);