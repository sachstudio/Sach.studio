import { and, asc, desc, eq, ne } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";
import type { CategorySlug } from "@/lib/categories";
import { validateCaseStudy, validatePost, type CaseStudyInput, type PostInput } from "@/lib/validation";
import * as schema from "./schema";
import { blogPosts, caseStudies, type BlogPost, type CaseStudy, type ContentStatus } from "./schema";

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
  };
}

export type Repo = ReturnType<typeof createRepo>;
