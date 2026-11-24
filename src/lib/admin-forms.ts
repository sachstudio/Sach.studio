import type { BlogPost, CaseStudy, Faq, PricingPlan, Testimonial } from "@/db/schema";
import { normalizeFeatureImages } from "./feature-images";
import type { FaqPage } from "./faq-pages";
import type { CaseStudyInput, FaqInput, PostInput, PricingPlanInput, TestimonialInput } from "./validation";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Admin page addresses carry a row id; anything that is not a UUID is a 404, not a database error. */
export function isUuid(value: string): boolean {
  return UUID.test(value);
}

/** A database row as the editor's form values (plain data only: no ids or timestamps). */
export function caseStudyToInput(row: CaseStudy): CaseStudyInput {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    clientName: row.clientName,
    clientLogoUrl: row.clientLogoUrl,
    category: row.category,
    tags: row.tags,
    statusLabel: row.statusLabel,
    displayDate: row.displayDate,
    heroImageUrl: row.heroImageUrl,
    cardImageUrl: row.cardImageUrl,
    figmaUrl: row.figmaUrl,
    liveUrl: row.liveUrl,
    about: row.about,
    bannerImageUrl: row.bannerImageUrl,
    problemIntro: row.problemIntro,
    problems: row.problems,
    solutionIntro: row.solutionIntro,
    solutions: row.solutions,
    featureImages: normalizeFeatureImages(row.featureImages),
    resultsText: row.resultsText,
    stats: row.stats,
    galleryImages: row.galleryImages,
    conclusion: row.conclusion,
    summary: row.summary,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    isFeatured: row.isFeatured,
    sortOrder: row.sortOrder,
    status: row.status,
    isPlaceholder: row.isPlaceholder,
  };
}

export function postToInput(row: BlogPost): PostInput {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImageUrl: row.coverImageUrl,
    body: row.body,
    displayDate: row.displayDate,
    sortOrder: row.sortOrder,
    status: row.status,
    isPlaceholder: row.isPlaceholder,
  };
}

/** Starting values for a new case study. Lives here (not in the client form) so server pages can call it. */
export function emptyCaseStudy(): CaseStudyInput {
  return {
    slug: "",
    title: "",
    subtitle: "",
    clientName: "",
    clientLogoUrl: "",
    category: "websites",
    tags: [],
    statusLabel: null,
    displayDate: null,
    heroImageUrl: "",
    cardImageUrl: "",
    figmaUrl: "",
    liveUrl: "",
    about: "",
    bannerImageUrl: "",
    problemIntro: "",
    problems: [],
    solutionIntro: "",
    solutions: [],
    featureImages: [],
    resultsText: "",
    stats: [],
    galleryImages: [],
    conclusion: "",
    summary: "",
    metaTitle: "",
    metaDescription: "",
    isFeatured: false,
    sortOrder: 0,
    status: "draft",
    isPlaceholder: false,
  };
}

/** Starting values for a new post. */
export function emptyPost(): PostInput {
  return {
    slug: "",
    title: "",
    excerpt: "",
    coverImageUrl: "",
    body: "",
    displayDate: null,
    sortOrder: 0,
    status: "draft",
    isPlaceholder: false,
  };
}

export function pricingPlanToInput(row: PricingPlan): PricingPlanInput {
  return {
    name: row.name,
    description: row.description,
    priceLabel: row.priceLabel,
    price: row.price,
    ctaLabel: row.ctaLabel,
    ctaHref: row.ctaHref,
    features: row.features,
    sortOrder: row.sortOrder,
    status: row.status,
  };
}

/** Starting values for a new package: the same wording the existing cards use, added after the others. */
export function emptyPricingPlan(): PricingPlanInput {
  return {
    name: "",
    description: "",
    priceLabel: "Starting from",
    price: "",
    ctaLabel: "Book a 15min call",
    ctaHref: "#book-a-call",
    features: [],
    sortOrder: 100,
    status: "published",
  };
}

export function faqToInput(row: Faq): FaqInput {
  return {
    question: row.question,
    answer: row.answer,
    pages: row.pages as FaqPage[],
    sortOrder: row.sortOrder,
    status: row.status,
  };
}

/** Starting values for a new FAQ: shown on the home page, after the others. */
export function emptyFaq(): FaqInput {
  return { question: "", answer: "", pages: ["home"], sortOrder: 100, status: "published" };
}

export function testimonialToInput(row: Testimonial): TestimonialInput {
  return {
    name: row.name,
    role: row.role,
    tag: row.tag,
    quote: row.quote,
    avatarUrl: row.avatarUrl,
    sortOrder: row.sortOrder,
    status: row.status,
  };
}

/** Starting values for a new testimonial, added after the others. */
export function emptyTestimonial(): TestimonialInput {
  return { name: "", role: "", tag: "", quote: "", avatarUrl: "", sortOrder: 100, status: "published" };
}
