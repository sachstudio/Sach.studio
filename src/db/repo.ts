import { and, asc, desc, eq, ne, sql } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";
import type { CategorySlug } from "@/lib/categories";
import type { FaqPage } from "@/lib/faq-pages";
import {
  validateCaseStudy,
  validatePost,
  type CaseStudyInput,
  type FaqInput,
  type PostInput,
  type PricingPlanInput,
  type TestimonialInput,
} from "@/lib/validation";
import * as schema from "./schema";
import {
  blogPosts,
  bookings,
  caseStudies,
  faqs,
  pricingPlans,
  testimonials,
  type BlogPost,
  type Booking,
  type CaseStudy,
  type ContentStatus,
  type Faq,
  type PricingPlan,
  type Testimonial,
} from "./schema";
import type { BookingInput } from "@/lib/cal-webhook";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Db = PgDatabase<any, typeof schema>;

export type SaveResult =
  | { ok: true; id: string; slug: string; previousSlug?: string }
  | { ok: false; error: string; field?: string };
export type StatusResult = { ok: true; slug: string } | { ok: false; error: string };

function isUniqueViolation(error: unknown): boolean {
  const e = error as { code?: string; cause?: { code?: string } } | null;
  return e?.code === "23505" || e?.cause?.code === "23505";
}

function slugTaken(slug: string, title: string): SaveResult {
  return {
    ok: false,
    field: "slug",
    error: `The slug "${slug}" is already used by "${title}". Choose a different slug.`,
  };
}

function firstError(errors: Record<string, string>): string {
  return Object.values(errors).join(". ");
}

export function createRepo(db: Db) {
  const caseOrder = [asc(caseStudies.sortOrder), desc(caseStudies.createdAt)];
  const postOrder = [asc(blogPosts.sortOrder), desc(blogPosts.createdAt)];
  const planOrder = [asc(pricingPlans.sortOrder), asc(pricingPlans.createdAt)];
  const faqOrder = [asc(faqs.sortOrder), asc(faqs.createdAt)];
  const testimonialOrder = [asc(testimonials.sortOrder), asc(testimonials.createdAt)];

  return {
    // ---- case studies: public ----
    async listPublishedCaseStudies(opts: { category?: CategorySlug; featuredOnly?: boolean } = {}): Promise<CaseStudy[]> {
      const filters = [eq(caseStudies.status, "published")];
      if (opts.category) filters.push(eq(caseStudies.category, opts.category));
      if (opts.featuredOnly) filters.push(eq(caseStudies.isFeatured, true));
      return db
        .select()
        .from(caseStudies)
        .where(and(...filters))
        .orderBy(...caseOrder);
    },

    async getPublishedCaseStudy(slug: string): Promise<CaseStudy | null> {
      const [row] = await db
        .select()
        .from(caseStudies)
        .where(and(eq(caseStudies.slug, slug), eq(caseStudies.status, "published")))
        .limit(1);
      return row ?? null;
    },

    async listRelatedCaseStudies(slug: string, limit = 3): Promise<CaseStudy[]> {
      return db
        .select()
        .from(caseStudies)
        .where(and(eq(caseStudies.status, "published"), ne(caseStudies.slug, slug)))
        .orderBy(...caseOrder)
        .limit(limit);
    },

    // ---- case studies: admin ----
    async adminListCaseStudies(): Promise<CaseStudy[]> {
      return db.select().from(caseStudies).orderBy(desc(caseStudies.updatedAt));
    },

    async adminGetCaseStudy(id: string): Promise<CaseStudy | null> {
      const [row] = await db.select().from(caseStudies).where(eq(caseStudies.id, id)).limit(1);
      return row ?? null;
    },

    async saveCaseStudy(input: CaseStudyInput, id?: string): Promise<SaveResult> {
      const [clash] = await db.select().from(caseStudies).where(eq(caseStudies.slug, input.slug)).limit(1);
      if (clash && clash.id !== id) return slugTaken(input.slug, clash.title);

      try {
        if (!id) {
          const [row] = await db
            .insert(caseStudies)
            .values({ ...input, publishedAt: input.status === "published" ? new Date() : null })
            .returning({ id: caseStudies.id });
          return { ok: true, id: row.id, slug: input.slug };
        }
        const [current] = await db.select().from(caseStudies).where(eq(caseStudies.id, id)).limit(1);
        if (!current) return { ok: false, error: "This case study no longer exists. It may have been deleted." };
        await db
          .update(caseStudies)
          .set({
            ...input,
            updatedAt: new Date(),
            publishedAt: input.status === "published" ? (current.publishedAt ?? new Date()) : current.publishedAt,
          })
          .where(eq(caseStudies.id, id));
        return {
          ok: true,
          id,
          slug: input.slug,
          previousSlug: current.slug !== input.slug ? current.slug : undefined,
        };
      } catch (error) {
        if (isUniqueViolation(error)) return slugTaken(input.slug, "another case study");
        throw error;
      }
    },

    async setCaseStudyStatus(id: string, status: ContentStatus): Promise<StatusResult> {
      const [current] = await db.select().from(caseStudies).where(eq(caseStudies.id, id)).limit(1);
      if (!current) return { ok: false, error: "This case study no longer exists. It may have been deleted." };
      if (status === "published") {
        const check = validateCaseStudy({ ...current, status });
        if (!check.ok) return { ok: false, error: firstError(check.errors) };
      }
      await db
        .update(caseStudies)
        .set({
          status,
          updatedAt: new Date(),
          publishedAt: status === "published" ? (current.publishedAt ?? new Date()) : current.publishedAt,
        })
        .where(eq(caseStudies.id, id));
      return { ok: true, slug: current.slug };
    },

    async deleteCaseStudy(id: string): Promise<StatusResult> {
      const deleted = await db.delete(caseStudies).where(eq(caseStudies.id, id)).returning({ slug: caseStudies.slug });
      if (!deleted.length) return { ok: false, error: "This case study no longer exists. It may have been deleted." };
      return { ok: true, slug: deleted[0].slug };
    },

    // ---- blog posts ----
    async listPublishedPosts(): Promise<BlogPost[]> {
      return db.select().from(blogPosts).where(eq(blogPosts.status, "published")).orderBy(...postOrder);
    },

    async getPublishedPost(slug: string): Promise<BlogPost | null> {
      const [row] = await db
        .select()
        .from(blogPosts)
        .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
        .limit(1);
      return row ?? null;
    },

    async listRelatedPosts(slug: string, limit = 2): Promise<BlogPost[]> {
      return db
        .select()
        .from(blogPosts)
        .where(and(eq(blogPosts.status, "published"), ne(blogPosts.slug, slug)))
        .orderBy(...postOrder)
        .limit(limit);
    },

    async adminListPosts(): Promise<BlogPost[]> {
      return db.select().from(blogPosts).orderBy(desc(blogPosts.updatedAt));
    },

    async adminGetPost(id: string): Promise<BlogPost | null> {
      const [row] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      return row ?? null;
    },

    async savePost(input: PostInput, id?: string): Promise<SaveResult> {
      const [clash] = await db.select().from(blogPosts).where(eq(blogPosts.slug, input.slug)).limit(1);
      if (clash && clash.id !== id) return slugTaken(input.slug, clash.title);

      try {
        if (!id) {
          const [row] = await db
            .insert(blogPosts)
            .values({ ...input, publishedAt: input.status === "published" ? new Date() : null })
            .returning({ id: blogPosts.id });
          return { ok: true, id: row.id, slug: input.slug };
        }
        const [current] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
        if (!current) return { ok: false, error: "This post no longer exists. It may have been deleted." };
        await db
          .update(blogPosts)
          .set({
            ...input,
            updatedAt: new Date(),
            publishedAt: input.status === "published" ? (current.publishedAt ?? new Date()) : current.publishedAt,
          })
          .where(eq(blogPosts.id, id));
        return {
          ok: true,
          id,
          slug: input.slug,
          previousSlug: current.slug !== input.slug ? current.slug : undefined,
        };
      } catch (error) {
        if (isUniqueViolation(error)) return slugTaken(input.slug, "another post");
        throw error;
      }
    },

    async setPostStatus(id: string, status: ContentStatus): Promise<StatusResult> {
      const [current] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      if (!current) return { ok: false, error: "This post no longer exists. It may have been deleted." };
      if (status === "published") {
        const check = validatePost({ ...current, status });
        if (!check.ok) return { ok: false, error: firstError(check.errors) };
      }
      await db
        .update(blogPosts)
        .set({
          status,
          updatedAt: new Date(),
          publishedAt: status === "published" ? (current.publishedAt ?? new Date()) : current.publishedAt,
        })
        .where(eq(blogPosts.id, id));
      return { ok: true, slug: current.slug };
    },

    async deletePost(id: string): Promise<StatusResult> {
      const deleted = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning({ slug: blogPosts.slug });
      if (!deleted.length) return { ok: false, error: "This post no longer exists. It may have been deleted." };
      return { ok: true, slug: deleted[0].slug };
    },

    // ---- bookings (Cal.com) ----
    /** Saves a booking from the Cal.com webhook. The same booking sent again updates the row instead of adding one. */
    async upsertBooking(input: BookingInput, replacesUid: string | null = null): Promise<void> {
      const now = new Date();
      await db
        .insert(bookings)
        .values(input)
        .onConflictDoUpdate({ target: bookings.calUid, set: { ...input, updatedAt: now } });
      if (replacesUid && replacesUid !== input.calUid) {
        await db.update(bookings).set({ status: "rescheduled", updatedAt: now }).where(eq(bookings.calUid, replacesUid));
      }
    },

    /** Every booking, the latest call time first. */
    async adminListBookings(): Promise<Booking[]> {
      return db.select().from(bookings).orderBy(desc(bookings.startTime));
    },

    // ---- pricing plans (home page) ----
    async listPublishedPricingPlans(): Promise<PricingPlan[]> {
      return db.select().from(pricingPlans).where(eq(pricingPlans.status, "published")).orderBy(...planOrder);
    },

    async adminListPricingPlans(): Promise<PricingPlan[]> {
      return db.select().from(pricingPlans).orderBy(...planOrder);
    },

    async adminGetPricingPlan(id: string): Promise<PricingPlan | null> {
      const [row] = await db.select().from(pricingPlans).where(eq(pricingPlans.id, id)).limit(1);
      return row ?? null;
    },

    async savePricingPlan(input: PricingPlanInput, id?: string): Promise<SaveResult> {
      if (!id) {
        const [row] = await db.insert(pricingPlans).values(input).returning({ id: pricingPlans.id });
        return { ok: true, id: row.id, slug: input.name };
      }
      const updated = await db
        .update(pricingPlans)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(pricingPlans.id, id))
        .returning({ id: pricingPlans.id });
      if (!updated.length) return { ok: false, error: "This package no longer exists. It may have been deleted." };
      return { ok: true, id, slug: input.name };
    },

    async setPricingPlanStatus(id: string, status: ContentStatus): Promise<{ ok: true } | { ok: false; error: string }> {
      const updated = await db
        .update(pricingPlans)
        .set({ status, updatedAt: new Date() })
        .where(eq(pricingPlans.id, id))
        .returning({ id: pricingPlans.id });
      return updated.length ? { ok: true } : { ok: false, error: "This package no longer exists. It may have been deleted." };
    },

    async deletePricingPlan(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
      const deleted = await db.delete(pricingPlans).where(eq(pricingPlans.id, id)).returning({ id: pricingPlans.id });
      return deleted.length ? { ok: true } : { ok: false, error: "This package no longer exists. It may have been deleted." };
    },

    // ---- FAQs (home and contact pages) ----
    /** The FAQs one page shows: only the ones switched on for that page, in the admin's order. */
    async listPublishedFaqs(page: FaqPage): Promise<Faq[]> {
      return db
        .select()
        .from(faqs)
        .where(and(eq(faqs.status, "published"), sql`${faqs.pages} @> ${JSON.stringify([page])}::jsonb`))
        .orderBy(...faqOrder);
    },

    async adminListFaqs(): Promise<Faq[]> {
      return db.select().from(faqs).orderBy(...faqOrder);
    },

    async adminGetFaq(id: string): Promise<Faq | null> {
      const [row] = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
      return row ?? null;
    },

    async saveFaq(input: FaqInput, id?: string): Promise<SaveResult> {
      if (!id) {
        const [row] = await db.insert(faqs).values(input).returning({ id: faqs.id });
        return { ok: true, id: row.id, slug: input.question };
      }
      const updated = await db.update(faqs).set({ ...input, updatedAt: new Date() }).where(eq(faqs.id, id)).returning({ id: faqs.id });
      if (!updated.length) return { ok: false, error: "This FAQ no longer exists. It may have been deleted." };
      return { ok: true, id, slug: input.question };
    },

    async setFaqStatus(id: string, status: ContentStatus): Promise<{ ok: true } | { ok: false; error: string }> {
      const updated = await db.update(faqs).set({ status, updatedAt: new Date() }).where(eq(faqs.id, id)).returning({ id: faqs.id });
      return updated.length ? { ok: true } : { ok: false, error: "This FAQ no longer exists. It may have been deleted." };
    },

    async deleteFaq(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
      const deleted = await db.delete(faqs).where(eq(faqs.id, id)).returning({ id: faqs.id });
      return deleted.length ? { ok: true } : { ok: false, error: "This FAQ no longer exists. It may have been deleted." };
    },

    // ---- testimonials (home page) ----
    async listPublishedTestimonials(): Promise<Testimonial[]> {
      return db.select().from(testimonials).where(eq(testimonials.status, "published")).orderBy(...testimonialOrder);
    },

    async adminListTestimonials(): Promise<Testimonial[]> {
      return db.select().from(testimonials).orderBy(...testimonialOrder);
    },

    async adminGetTestimonial(id: string): Promise<Testimonial | null> {
      const [row] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
      return row ?? null;
    },

    async saveTestimonial(input: TestimonialInput, id?: string): Promise<SaveResult> {
      if (!id) {
        const [row] = await db.insert(testimonials).values(input).returning({ id: testimonials.id });
        return { ok: true, id: row.id, slug: input.name };
      }
      const updated = await db
        .update(testimonials)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(testimonials.id, id))
        .returning({ id: testimonials.id });
      if (!updated.length) return { ok: false, error: "This testimonial no longer exists. It may have been deleted." };
      return { ok: true, id, slug: input.name };
    },

    async setTestimonialStatus(id: string, status: ContentStatus): Promise<{ ok: true } | { ok: false; error: string }> {
      const updated = await db
        .update(testimonials)
        .set({ status, updatedAt: new Date() })
        .where(eq(testimonials.id, id))
        .returning({ id: testimonials.id });
      return updated.length ? { ok: true } : { ok: false, error: "This testimonial no longer exists. It may have been deleted." };
    },

    async deleteTestimonial(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
      const deleted = await db.delete(testimonials).where(eq(testimonials.id, id)).returning({ id: testimonials.id });
      return deleted.length ? { ok: true } : { ok: false, error: "This testimonial no longer exists. It may have been deleted." };
    },
  };
}

export type Repo = ReturnType<typeof createRepo>;
