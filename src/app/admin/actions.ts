"use server";

import { getRepo } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { revalidateContent } from "@/lib/revalidate";
import { faqsTag, pricingTag, tagsForCaseStudyChange, tagsForPostChange, testimonialsTag } from "@/lib/tags";
import { validateCaseStudy, validateFaq, validatePost, validatePricingPlan, validateTestimonial } from "@/lib/validation";

export type ActionResult =
  | { ok: true; message: "Saved" | "Published" | "Unpublished" | "Deleted"; id?: string; slug?: string }
  | { ok: false; error: string; errors?: Record<string, string> };

/** Every action runs this first: a non-admin gets a plain refusal and nothing else happens. */
async function denied(): Promise<ActionResult | null> {
  try {
    await requireAdmin();
    return null;
  } catch (error) {
    const e = error as { name?: string; kind?: string };
    if (e?.name === "AdminAuthError") {
      return { ok: false, error: e.kind === "unauthenticated" ? "Sign in to continue" : "Not authorised" };
    }
    throw error;
  }
}

const fix = "Some fields need attention. Check the highlighted fields and try again.";

function fromRepoFailure(result: { ok: false; error: string; field?: string }): ActionResult {
  return { ok: false, error: result.error, ...(result.field ? { errors: { [result.field]: result.error } } : {}) };
}

function unexpected(what: string, error: unknown): ActionResult {
  console.error(`Admin action failed: ${what}`, error);
  return { ok: false, error: `Could not ${what}. Try again in a moment.` };
}

// ---------- case studies ----------

async function saveStudy(input: unknown, id: string | undefined, publish: boolean): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;

  const merged = publish && input && typeof input === "object" ? { ...input, status: "published" } : input;
  const checked = validateCaseStudy(merged);
  if (!checked.ok) return { ok: false, error: fix, errors: checked.errors };

  try {
    const result = await (await getRepo()).saveCaseStudy(checked.data, id);
    if (!result.ok) return fromRepoFailure(result);
    revalidateContent(tagsForCaseStudyChange(result.slug, result.previousSlug));
    return { ok: true, message: publish ? "Published" : "Saved", id: result.id, slug: result.slug };
  } catch (error) {
    return unexpected("save the case study", error);
  }
}

export async function saveCaseStudyAction(input: unknown, id?: string): Promise<ActionResult> {
  return saveStudy(input, id, false);
}

export async function publishCaseStudyAction(input: unknown, id?: string): Promise<ActionResult> {
  return saveStudy(input, id, true);
}

export async function unpublishCaseStudyAction(id: string): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;
  try {
    const result = await (await getRepo()).setCaseStudyStatus(id, "draft");
    if (!result.ok) return { ok: false, error: result.error };
    revalidateContent(tagsForCaseStudyChange(result.slug));
    return { ok: true, message: "Unpublished", slug: result.slug };
  } catch (error) {
    return unexpected("unpublish the case study", error);
  }
}

export async function deleteCaseStudyAction(id: string): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;
  try {
    const result = await (await getRepo()).deleteCaseStudy(id);
    if (!result.ok) return { ok: false, error: result.error };
    revalidateContent(tagsForCaseStudyChange(result.slug));
    return { ok: true, message: "Deleted", slug: result.slug };
  } catch (error) {
    return unexpected("delete the case study", error);
  }
}

// ---------- blog posts ----------

async function savePostInput(input: unknown, id: string | undefined, publish: boolean): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;

  const merged = publish && input && typeof input === "object" ? { ...input, status: "published" } : input;
  const checked = validatePost(merged);
  if (!checked.ok) return { ok: false, error: fix, errors: checked.errors };

  try {
    const result = await (await getRepo()).savePost(checked.data, id);
    if (!result.ok) return fromRepoFailure(result);
    revalidateContent(tagsForPostChange(result.slug, result.previousSlug));
    return { ok: true, message: publish ? "Published" : "Saved", id: result.id, slug: result.slug };
  } catch (error) {
    return unexpected("save the post", error);
  }
}

export async function savePostAction(input: unknown, id?: string): Promise<ActionResult> {
  return savePostInput(input, id, false);
}

export async function publishPostAction(input: unknown, id?: string): Promise<ActionResult> {
  return savePostInput(input, id, true);
}

export async function unpublishPostAction(id: string): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;
  try {
    const result = await (await getRepo()).setPostStatus(id, "draft");
    if (!result.ok) return { ok: false, error: result.error };
    revalidateContent(tagsForPostChange(result.slug));
    return { ok: true, message: "Unpublished", slug: result.slug };
  } catch (error) {
    return unexpected("unpublish the post", error);
  }
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;
  try {
    const result = await (await getRepo()).deletePost(id);
    if (!result.ok) return { ok: false, error: result.error };
    revalidateContent(tagsForPostChange(result.slug));
    return { ok: true, message: "Deleted", slug: result.slug };
  } catch (error) {
    return unexpected("delete the post", error);
  }
}

// ---------- pricing packages ----------

async function savePlanInput(input: unknown, id: string | undefined, status: "draft" | "published" | null): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;

  const merged = status && input && typeof input === "object" ? { ...input, status } : input;
  const checked = validatePricingPlan(merged);
  if (!checked.ok) return { ok: false, error: fix, errors: checked.errors };

  try {
    const result = await (await getRepo()).savePricingPlan(checked.data, id);
    if (!result.ok) return fromRepoFailure(result);
    revalidateContent([pricingTag]);
    return { ok: true, message: status === "published" ? "Published" : "Saved", id: result.id };
  } catch (error) {
    return unexpected("save the package", error);
  }
}

export async function savePricingPlanAction(input: unknown, id?: string): Promise<ActionResult> {
  return savePlanInput(input, id, null);
}

export async function publishPricingPlanAction(input: unknown, id?: string): Promise<ActionResult> {
  return savePlanInput(input, id, "published");
}

export async function unpublishPricingPlanAction(id: string): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;
  try {
    const result = await (await getRepo()).setPricingPlanStatus(id, "draft");
    if (!result.ok) return { ok: false, error: result.error };
    revalidateContent([pricingTag]);
    return { ok: true, message: "Unpublished" };
  } catch (error) {
    return unexpected("hide the package", error);
  }
}

export async function deletePricingPlanAction(id: string): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;
  try {
    const result = await (await getRepo()).deletePricingPlan(id);
    if (!result.ok) return { ok: false, error: result.error };
    revalidateContent([pricingTag]);
    return { ok: true, message: "Deleted" };
  } catch (error) {
    return unexpected("delete the package", error);
  }
}

// ---------- FAQs ----------

async function saveFaqInput(input: unknown, id: string | undefined, status: "draft" | "published" | null): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;

  const merged = status && input && typeof input === "object" ? { ...input, status } : input;
  const checked = validateFaq(merged);
  if (!checked.ok) return { ok: false, error: fix, errors: checked.errors };

  try {
    const result = await (await getRepo()).saveFaq(checked.data, id);
    if (!result.ok) return fromRepoFailure(result);
    revalidateContent([faqsTag]);
    return { ok: true, message: status === "published" ? "Published" : "Saved", id: result.id };
  } catch (error) {
    return unexpected("save the FAQ", error);
  }
}

export async function saveFaqAction(input: unknown, id?: string): Promise<ActionResult> {
  return saveFaqInput(input, id, null);
}

export async function publishFaqAction(input: unknown, id?: string): Promise<ActionResult> {
  return saveFaqInput(input, id, "published");
}

export async function unpublishFaqAction(id: string): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;
  try {
    const result = await (await getRepo()).setFaqStatus(id, "draft");
    if (!result.ok) return { ok: false, error: result.error };
    revalidateContent([faqsTag]);
    return { ok: true, message: "Unpublished" };
  } catch (error) {
    return unexpected("hide the FAQ", error);
  }
}

export async function deleteFaqAction(id: string): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;
  try {
    const result = await (await getRepo()).deleteFaq(id);
    if (!result.ok) return { ok: false, error: result.error };
    revalidateContent([faqsTag]);
    return { ok: true, message: "Deleted" };
  } catch (error) {
    return unexpected("delete the FAQ", error);
  }
}

// ---------- testimonials ----------

async function saveTestimonialInput(input: unknown, id: string | undefined, status: "draft" | "published" | null): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;

  const merged = status && input && typeof input === "object" ? { ...input, status } : input;
  const checked = validateTestimonial(merged);
  if (!checked.ok) return { ok: false, error: fix, errors: checked.errors };

  try {
    const result = await (await getRepo()).saveTestimonial(checked.data, id);
    if (!result.ok) return fromRepoFailure(result);
    revalidateContent([testimonialsTag]);
    return { ok: true, message: status === "published" ? "Published" : "Saved", id: result.id };
  } catch (error) {
    return unexpected("save the testimonial", error);
  }
}

export async function saveTestimonialAction(input: unknown, id?: string): Promise<ActionResult> {
  return saveTestimonialInput(input, id, null);
}

export async function publishTestimonialAction(input: unknown, id?: string): Promise<ActionResult> {
  return saveTestimonialInput(input, id, "published");
}

export async function unpublishTestimonialAction(id: string): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;
  try {
    const result = await (await getRepo()).setTestimonialStatus(id, "draft");
    if (!result.ok) return { ok: false, error: result.error };
    revalidateContent([testimonialsTag]);
    return { ok: true, message: "Unpublished" };
  } catch (error) {
    return unexpected("hide the testimonial", error);
  }
}

export async function deleteTestimonialAction(id: string): Promise<ActionResult> {
  const refusal = await denied();
  if (refusal) return refusal;
  try {
    const result = await (await getRepo()).deleteTestimonial(id);
    if (!result.ok) return { ok: false, error: result.error };
    revalidateContent([testimonialsTag]);
    return { ok: true, message: "Deleted" };
  } catch (error) {
    return unexpected("delete the testimonial", error);
  }
}
