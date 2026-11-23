import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { CategorySlug } from "@/lib/categories";

export type LeadItem = { lead: string; text: string };
export type StatItem = { value: string; label: string };
export type ContentStatus = "draft" | "published";

const timestamps = {
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const caseStudies = pgTable("case_studies", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  clientName: text("client_name").notNull().default(""),
  clientLogoUrl: text("client_logo_url").notNull().default(""),
  category: text("category").$type<CategorySlug>().notNull(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  statusLabel: text("status_label").$type<"LIVE" | "ONGOING" | "CONCEPT">(),
  displayDate: text("display_date"),
  heroImageUrl: text("hero_image_url").notNull().default(""),
  cardImageUrl: text("card_image_url").notNull().default(""),
  figmaUrl: text("figma_url").notNull().default(""),
  liveUrl: text("live_url").notNull().default(""),
  about: text("about").notNull().default(""),
  bannerImageUrl: text("banner_image_url").notNull().default(""),
  problemIntro: text("problem_intro").notNull().default(""),
  problems: jsonb("problems").$type<LeadItem[]>().notNull().default([]),
  solutionIntro: text("solution_intro").notNull().default(""),
  solutions: jsonb("solutions").$type<LeadItem[]>().notNull().default([]),
  featureImages: jsonb("feature_images").$type<(string | { url: string; shape: "square" | "rectangle" })[]>().notNull().default([]),
  resultsText: text("results_text").notNull().default(""),
  stats: jsonb("stats").$type<StatItem[]>().notNull().default([]),
  galleryImages: jsonb("gallery_images").$type<string[]>().notNull().default([]),
  conclusion: text("conclusion").notNull().default(""),
  summary: text("summary").notNull().default(""),
  metaTitle: text("meta_title").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  isFeatured: boolean("is_featured").notNull().default(false),
  /** Lower numbers come first; new items use 0 so the newest appear first. */
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status").$type<ContentStatus>().notNull().default("draft"),
  isPlaceholder: boolean("is_placeholder").notNull().default(false),
  ...timestamps,
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  coverImageUrl: text("cover_image_url").notNull().default(""),
  body: text("body").notNull().default(""),
  displayDate: text("display_date"),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status").$type<ContentStatus>().notNull().default("draft"),
  isPlaceholder: boolean("is_placeholder").notNull().default(false),
  ...timestamps,
});

export type CaseStudy = typeof caseStudies.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
