import { z } from "zod";
import { CATEGORIES, type CategorySlug } from "./categories";
import { FAQ_PAGE_VALUES } from "./faq-pages";
import { FEATURE_SHAPES } from "./feature-images";
import { SLUG_PATTERN } from "./slug";

export const META_TITLE_MAX = 55;
export const META_DESCRIPTION_MAX = 157;
export const MAX_STATS = 3;
export const MAX_TAGS = 4;

const categorySlugs = CATEGORIES.map((c) => c.slug) as unknown as [CategorySlug, ...CategorySlug[]];

const BLOB_IMAGE = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/\S+$/i;

/** Empty, a path on this site (not protocol-relative), or an upload in Vercel Blob: the only places the site loads images from. */
function isHostedImage(value: string): boolean {
  if (value === "") return true;
  if (value.startsWith("/")) return !value.startsWith("//");
  return BLOB_IMAGE.test(value);
}

/** An uploaded image URL, a site path like /images/x.webp, or empty. */
const imageRef = z
  .string()
  .trim()
  .refine(isHostedImage, "Upload the image here, or use a path from this site such as /images/example.webp");

/** A feature image and whether it is shown as a square (two share a row) or a full-width rectangle. Old plain addresses count as rectangles. */
const featureImage = z.preprocess(
  (value) => (typeof value === "string" ? { url: value, shape: "rectangle" } : value),
  z.object({ url: imageRef, shape: z.enum(FEATURE_SHAPES).default("rectangle") }),
);

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
  featureImages: z.array(featureImage).default([]),
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

export const MAX_PLAN_FEATURES = 12;

/** Where a pricing button can point: a section on the page, a page on this site, or a full web address. */
function isButtonLink(value: string): boolean {
  if (value.startsWith("#")) return value.length > 1;
  if (value.startsWith("/")) return !value.startsWith("//");
  return /^https?:\/\/\S+$/.test(value);
}

const pricingPlanShape = z.object({
  name: z.string().trim().min(1, "Add the package name"),
  description: z.string().trim().default(""),
  priceLabel: z.string().trim().default("Starting from"),
  price: z.string().trim().min(1, "Add the price, for example $1,999"),
  ctaLabel: z.string().trim().min(1, "Add the button text").default("Book a 15min call"),
  ctaHref: z
    .string()
    .trim()
    .refine(isButtonLink, "Use #section, a page like /contact, or a full address starting with https://")
    .default("#book-a-call"),
  features: z
    .array(z.string().trim())
    .transform((items) => items.filter(Boolean))
    .pipe(z.array(z.string()).max(MAX_PLAN_FEATURES, `Use at most ${MAX_PLAN_FEATURES} benefits`))
    .default([]),
  sortOrder: z.number().int().default(100),
  status: z.enum(["draft", "published"]).default("draft"),
});

const faqShape = z.object({
  question: z.string().trim().min(1, "Add the question"),
  answer: z.string().trim().min(1, "Add the answer"),
  pages: z
    .array(z.enum(FAQ_PAGE_VALUES, { message: "Choose pages from the list" }))
    .transform((pages) => [...new Set(pages)])
    .pipe(z.array(z.enum(FAQ_PAGE_VALUES)).min(1, "Choose at least one page to show it on"))
    .default(["home"]),
  sortOrder: z.number().int().default(100),
  status: z.enum(["draft", "published"]).default("draft"),
});

const testimonialShape = z.object({
  name: z.string().trim().min(1, "Add the client's name"),
  role: z.string().trim().default(""),
  tag: z.string().trim().default(""),
  quote: z.string().trim().min(1, "Add what the client said"),
  avatarUrl: imageRef.default(""),
  sortOrder: z.number().int().default(100),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type CaseStudyInput = z.infer<typeof caseStudyShape>;
export type FaqInput = z.infer<typeof faqShape>;
export type TestimonialInput = z.infer<typeof testimonialShape>;
export type PricingPlanInput = z.infer<typeof pricingPlanShape>;
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

export function validatePricingPlan(input: unknown): ValidationResult<PricingPlanInput> {
  const parsed = pricingPlanShape.safeParse(input);
  return parsed.success ? { ok: true, data: parsed.data } : { ok: false, errors: issuesToErrors(parsed.error) };
}

export function validateFaq(input: unknown): ValidationResult<FaqInput> {
  const parsed = faqShape.safeParse(input);
  return parsed.success ? { ok: true, data: parsed.data } : { ok: false, errors: issuesToErrors(parsed.error) };
}

export function validateTestimonial(input: unknown): ValidationResult<TestimonialInput> {
  const parsed = testimonialShape.safeParse(input);
  return parsed.success ? { ok: true, data: parsed.data } : { ok: false, errors: issuesToErrors(parsed.error) };
}
