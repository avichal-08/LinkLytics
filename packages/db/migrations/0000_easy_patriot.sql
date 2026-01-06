CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "linkAnalytic" (
	"id" text PRIMARY KEY NOT NULL,
	"linkId" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"visitorHash" varchar(128) NOT NULL,
	"deviceType" varchar(32),
	"os" varchar(64),
	"browser" varchar(64),
	"countryCode" varchar(8),
	"referrer" text,
	"utmSource" varchar(128),
	"utmMedium" varchar(128),
	"utmCampaign" varchar(128)
);
--> statement-breakpoint
CREATE TABLE "link" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"slug" varchar(64) NOT NULL,
	"destinationUrl" text NOT NULL,
	"isActive" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "link_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linkAnalytic" ADD CONSTRAINT "linkAnalytic_linkId_link_id_fk" FOREIGN KEY ("linkId") REFERENCES "public"."link"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link" ADD CONSTRAINT "link_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytic_link_time_idx" ON "linkAnalytic" USING btree ("linkId","timestamp");--> statement-breakpoint
CREATE INDEX "analytic_link_visitor_idx" ON "linkAnalytic" USING btree ("linkId","visitorHash");--> statement-breakpoint
CREATE INDEX "link_user_id_idx" ON "link" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "link_slug_idx" ON "link" USING btree ("slug");