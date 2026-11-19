import { z } from "zod";
import { CATEGORIES, type CategorySlug } from "./categories";
import { SLUG_PATTERN } from "./slug";

export const META_TITLE_MAX = 55;
export const META_DESCRIPTION_MAX = 157;
export const MAX_STATS = 3;
export const MAX_TAGS = 4;

const categorySlugs = CATEGORIES.map((c) => c.slug) as unknown as [CategorySlug, ...CategorySlug[]];

/** An uploaded image URL, a site path like /images/x.webp, or empty. */
const imageRef = z
  .string()
  .trim()
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), "Use an uploaded image or a full web address");

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\//.test(v), "Use a full web address starting with https://");

const slug = z
  .string()
  .trim()
  .min(1, "Add a URL slug")
  .max(80, "Slugs can be up to 80 characters")
  .regex(SLUG_PATTERN, "Use lowercase letters, numbers and hyphens only, for example my-case-study");

const leadText = z.object({ lead: z.string().trim().min(1, "Add a bold lead-in"), text: z.string().trim().min(1, "Add the sentence") });

const caseStudyShape = z.object({
  slug,
  title: z.string().trim().min(1, "Add a title"),
  subtitle: z.string().trim().default(""),
  clientName: z.string().trim().default(""),
  clientLogoUrl: imageRef.default(""),
  category: z.enum(categorySlugs, { message: "Choose one of the four categories" }),
  tags: z.array(z.string().trim().min(1)).max(MAX_TAGS, `Use at most ${MAX_TAGS} tags`).default([]),
  statusLabel: z.enum(["LIVE", "ONGOING", "CONCEPT"]).nullable().default(null),
  displayDate: z.string().trim().nullable().default(null),
  heroImageUrl: imageRef.default(""),
  cardImageUrl: imageRef.default(""),
  figmaUrl: optionalUrl.default(""),
  liveUrl: optionalUrl.default(""),
  about: z.string().trim().default(""),
  bannerImageUrl: imageRef.default(""),
  problemIntro: z.string().trim().default(""),
  problems: z.array(leadText).default([]),
  solutionIntro: z.string().trim().default(""),
  solutions: z.array(leadText).default([]),
  featureImages: z.array(imageRef).default([]),
  resultsText: z.string().trim().default(""),
  stats: z
    .array(z.object({ value: z.string().trim().min(1, "Add the number"), label: z.string().trim().min(1, "Add the label") }))
    .max(MAX_STATS, `Use at most ${MAX_STATS} result stats`)
    .default([]),
  galleryImages: z.array(imageRef).default([]),
  conclusion: z.string().trim().default(""),
  summary: z.string().trim().default(""),
  metaTitle: z.string().trim().default(""),
  metaDescription: z.string().trim().default(""),
  isFeatured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  sortOrder: z.number().int().default(0),
  isPlaceholder: z.boolean().default(false),
});

const postShape = z.object({
  slug,
  title: z.string().trim().min(1, "Add a title"),
  excerpt: z.string().trim().default(""),
  coverImageUrl: imageRef.default(""),
  body: z.string().default(""),
  displayDate: z.string().trim().nullable().default(null),
  status: z.enum(["draft", "published"]).default("draft"),
  sortOrder: z.number().int().default(0),
  isPlaceholder: z.boolean().default(false),
});

export type CaseStudyInput = z.infer<typeof caseStudyShape>;
export type PostInput = z.infer<typeof postShape>;

export type ValidationResult<T> = { ok: true; data: T } | { ok: false; errors: Record<string, string> };

function lengthMessage(label: string, max: number, actual: number) {
  return `${label} must be ${max} characters or fewer; this one is ${actual}`;
}

function issuesToErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function validateCaseStudy(input: unknown): ValidationResult<CaseStudyInput> {
  const parsed = caseStudyShape.safeParse(input);
  if (!parsed.success) return { ok: false, errors: issuesToErrors(parsed.error) };

  const data = parsed.data;
  const errors: Record<string, string> = {};
  if (data.metaTitle.length > META_TITLE_MAX) {
    errors.metaTitle = lengthMessage("Meta title", META_TITLE_MAX, data.metaTitle.length);
  }
  if (data.metaDescription.length > META_DESCRIPTION_MAX) {
    errors.metaDescription = lengthMessage("Meta description", META_DESCRIPTION_MAX, data.metaDescription.length);
  }
  if (data.status === "published") {
    if (!data.cardImageUrl) errors.cardImageUrl = "Add a card image before you publish";
    if (!data.summary) errors.summary = "Add a card summary before you publish";
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export function validatePost(input: unknown): ValidationResult<PostInput> {
  const parsed = postShape.safeParse(input);
  if (!parsed.success) return { ok: false, errors: issuesToErrors(parsed.error) };

  const data = parsed.data;
  const errors: Record<string, string> = {};
  if (data.status === "published") {
    if (!data.body.trim()) errors.body = "Add the post text before you publish";
    if (!data.coverImageUrl) errors.coverImageUrl = "Add a cover image before you publish";
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
