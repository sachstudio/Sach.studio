"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deleteCaseStudyAction,
  publishCaseStudyAction,
  saveCaseStudyAction,
  unpublishCaseStudyAction,
  type ActionResult,
} from "@/app/admin/actions";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import { slugify } from "@/lib/slug";
import { META_DESCRIPTION_MAX, META_TITLE_MAX, MAX_STATS, MAX_TAGS, type CaseStudyInput } from "@/lib/validation";
import { CheckboxField, FormSection, SelectField, TextArea, TextField, inputClass } from "./fields";
import { ImageField, ImageListField } from "./ImageField";
import { ListField } from "./ListField";
import { StatusBadge } from "./StatusBadge";

const categoryOptions = CATEGORIES.map((c) => ({ value: c.slug, label: c.label }));
const statusLabelOptions = [
  { value: "", label: "None (show the date)" },
  { value: "LIVE", label: "LIVE" },
  { value: "ONGOING", label: "ONGOING" },
  { value: "CONCEPT", label: "CONCEPT" },
] as const;

export function CaseStudyForm({ id, initial }: { id?: string; initial: CaseStudyInput }) {
  const router = useRouter();
  const [values, setValues] = useState<CaseStudyInput>(initial);
  const [slugTouched, setSlugTouched] = useState(initial.slug !== "");
  const [tagsText, setTagsText] = useState(initial.tags.join(", "));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof CaseStudyInput>(key: K, value: CaseStudyInput[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  function onTitle(title: string) {
    setValues((v) => ({ ...v, title, slug: slugTouched ? v.slug : slugify(title) }));
  }

  function onTags(text: string) {
    setTagsText(text);
    set(
      "tags",
      text
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    );
  }

  function finish(result: ActionResult, nextStatus?: "draft" | "published") {
    if (!result.ok) {
      setErrors(result.errors ?? {});
      // When specific fields carry the detail, the banner only points at them instead of repeating it.
      const hasFieldErrors = Object.keys(result.errors ?? {}).length > 0;
      setNotice({
        kind: "error",
        text: hasFieldErrors ? "Some fields need attention. Check the highlighted fields and try again." : result.error,
      });
      return;
    }
    setErrors({});
    setNotice({ kind: "ok", text: result.message });
    if (nextStatus) set("status", nextStatus);
    if (!id && result.id) {
      router.replace(`/admin/case-studies/${result.id}`);
      return;
    }
    router.refresh();
  }

  const run = (work: () => Promise<void>) => {
    setNotice(null);
    startTransition(work);
  };

  const onSave = () => run(async () => finish(await saveCaseStudyAction(values, id)));
  const onPublish = () => run(async () => finish(await publishCaseStudyAction(values, id), "published"));
  const onUnpublish = () => {
    if (!id) return;
    run(async () => finish(await unpublishCaseStudyAction(id), "draft"));
  };
  const onDelete = () => {
    if (!id) return;
    run(async () => {
      const result = await deleteCaseStudyAction(id);
      if (result.ok) {
        router.replace("/admin");
        return;
      }
      setConfirmingDelete(false);
      setNotice({ kind: "error", text: result.error });
    });
  };

  const tagsError = values.tags.length > MAX_TAGS ? `Use at most ${MAX_TAGS} tags` : errors.tags;
  const published = values.status === "published";

  function updateStat(index: number, patch: Partial<{ value: string; label: string }>) {
    set(
      "stats",
      values.stats.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="flex flex-col gap-6"
    >
      <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl text-neutral-950">{id ? "Edit case study" : "New case study"}</h1>
          <StatusBadge status={values.status} needsContent={values.isPlaceholder} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {id && (
            <a href={`/admin/case-studies/${id}/preview`} target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
              Preview
            </a>
          )}
          {id && published && values.slug && (
            <a href={`/works/${values.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
              View live page
            </a>
          )}
          <button type="submit" disabled={pending} className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 disabled:opacity-50">
            {published ? "Save changes" : "Save draft"}
          </button>
          {!published && (
            <button type="button" onClick={onPublish} disabled={pending} className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50">
              Publish
            </button>
          )}
          {published && id && (
            <button type="button" onClick={onUnpublish} disabled={pending} className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 disabled:opacity-50">
              Unpublish
            </button>
          )}
          {id && (
            <button type="button" onClick={() => setConfirmingDelete(true)} disabled={pending} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
              Delete
            </button>
          )}
        </div>
      </div>

      {notice && (
        <p
          role={notice.kind === "ok" ? "status" : "alert"}
          className={notice.kind === "ok" ? "motion-enter-small rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800" : "motion-enter-small rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"}
        >
          {notice.text}
        </p>
      )}

      {confirmingDelete && (
        <div role="alertdialog" aria-labelledby="delete-title" className="motion-enter-small rounded-xl border border-red-200 bg-red-50 p-5">
          <p id="delete-title" className="font-medium text-red-900">
            Delete this case study? It will be removed from the website and this cannot be undone.
          </p>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={onDelete} disabled={pending} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
              Delete case study
            </button>
            <button type="button" onClick={() => setConfirmingDelete(false)} className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800">
              Cancel
            </button>
          </div>
        </div>
      )}

      <FormSection title="Basics" description="What visitors read first, and where this page lives.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Title" value={values.title} onChange={onTitle} error={errors.title} className="sm:col-span-2" />
          <TextField
            label="URL slug"
            value={values.slug}
            onChange={(v) => {
              setSlugTouched(true);
              set("slug", v);
            }}
            error={errors.slug}
            hint="The page address: /works/your-slug. Lowercase letters, numbers and hyphens."
          />
          <TextField label="Client name" value={values.clientName} onChange={(v) => set("clientName", v)} error={errors.clientName} />
          <TextField label="Subtitle" value={values.subtitle} onChange={(v) => set("subtitle", v)} error={errors.subtitle} className="sm:col-span-2" hint="One line under the title." />
          <SelectField<CategorySlug> label="Category" value={values.category} options={categoryOptions} onChange={(v) => set("category", v)} error={errors.category} />
          <SelectField<string>
            label="Status label"
            value={values.statusLabel ?? ""}
            options={[...statusLabelOptions]}
            onChange={(v) => set("statusLabel", v === "" ? null : (v as "LIVE" | "ONGOING" | "CONCEPT"))}
            hint="Shown above the title on project cards."
          />
          <TextField label="Date shown on cards" value={values.displayDate ?? ""} onChange={(v) => set("displayDate", v || null)} placeholder="10 Feb 2025" />
          <TextField label="Tags" value={tagsText} onChange={onTags} error={tagsError} hint="Up to 4, separated by commas." />
        </div>
      </FormSection>

      <FormSection title="Images" description="PNG, JPG, WebP, SVG or AVIF, up to 8 MB each.">
        <div className="grid gap-5 lg:grid-cols-2">
          <ImageField label="Card image" value={values.cardImageUrl} onChange={(v) => set("cardImageUrl", v)} error={errors.cardImageUrl} folder="case-studies" hint="Shown on the Works and Home grids. Required to publish." />
          <ImageField label="Hero image" value={values.heroImageUrl} onChange={(v) => set("heroImageUrl", v)} error={errors.heroImageUrl} folder="case-studies" hint="The large image under the title." />
          <ImageField label="Client logo" value={values.clientLogoUrl} onChange={(v) => set("clientLogoUrl", v)} error={errors.clientLogoUrl} folder="logos" />
          <ImageField label="Banner image" value={values.bannerImageUrl} onChange={(v) => set("bannerImageUrl", v)} error={errors.bannerImageUrl} folder="case-studies" />
        </div>
        <ImageListField label="Feature images" value={values.featureImages} onChange={(v) => set("featureImages", v)} folder="case-studies" error={errors.featureImages} />
        <ImageListField label="Gallery images" value={values.galleryImages} onChange={(v) => set("galleryImages", v)} folder="case-studies" error={errors.galleryImages} />
      </FormSection>

      <FormSection title="Links">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Figma design link" value={values.figmaUrl} onChange={(v) => set("figmaUrl", v)} error={errors.figmaUrl} placeholder="https://www.figma.com/..." hint="Leave empty to hide the button." />
          <TextField label="Live website link" value={values.liveUrl} onChange={(v) => set("liveUrl", v)} error={errors.liveUrl} placeholder="https://..." hint="Leave empty to show “Live soon”." />
        </div>
      </FormSection>

      <FormSection title="The story" description="Sections with no text are left out of the page.">
        <TextArea label="About the client or project" value={values.about} onChange={(v) => set("about", v)} error={errors.about} rows={5} hint="A case study page needs this text to appear on the website." />
        <TextArea label="Problem intro" value={values.problemIntro} onChange={(v) => set("problemIntro", v)} error={errors.problemIntro} rows={3} />
        <ListField label="Problems" value={values.problems} onChange={(v) => set("problems", v)} error={errors.problems} />
        <TextArea label="Solutions intro" value={values.solutionIntro} onChange={(v) => set("solutionIntro", v)} error={errors.solutionIntro} rows={3} />
        <ListField label="Solutions" value={values.solutions} onChange={(v) => set("solutions", v)} error={errors.solutions} />
        <TextArea label="Results text" value={values.resultsText} onChange={(v) => set("resultsText", v)} error={errors.resultsText} rows={5} />
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-neutral-800">Result stats (up to {MAX_STATS})</legend>
          {values.stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-2 sm:flex-row">
              <input aria-label={`Stat ${i + 1} number`} placeholder="42%" value={stat.value} onChange={(e) => updateStat(i, { value: e.target.value })} className={`${inputClass} sm:w-40`} />
              <input aria-label={`Stat ${i + 1} label`} placeholder="Increased B2B lead generation" value={stat.label} onChange={(e) => updateStat(i, { label: e.target.value })} className={inputClass} />
              <button type="button" aria-label={`Remove stat ${i + 1}`} onClick={() => set("stats", values.stats.filter((_, idx) => idx !== i))} className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                Remove
              </button>
            </div>
          ))}
          <div>
            <button type="button" disabled={values.stats.length >= MAX_STATS} onClick={() => set("stats", [...values.stats, { value: "", label: "" }])} className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50">
              + Add stat
            </button>
          </div>
          {errors.stats && <p role="alert" className="text-sm text-red-600">{errors.stats}</p>}
        </fieldset>
        <TextArea label="Conclusion" value={values.conclusion} onChange={(v) => set("conclusion", v)} error={errors.conclusion} rows={4} />
      </FormSection>

      <FormSection title="Listing and search" description="How this project appears on cards and in Google.">
        <TextArea label="Card summary" value={values.summary} onChange={(v) => set("summary", v)} error={errors.summary} rows={3} hint="One or two sentences on the project card. Required to publish." />
        <TextField label="Meta title" value={values.metaTitle} onChange={(v) => set("metaTitle", v)} error={errors.metaTitle} max={META_TITLE_MAX} hint="The title in Google results. Include “Sach Studio”." />
        <TextArea label="Meta description" value={values.metaDescription} onChange={(v) => set("metaDescription", v)} error={errors.metaDescription} rows={3} max={META_DESCRIPTION_MAX} />
      </FormSection>

      <FormSection title="Options">
        <CheckboxField label="Show on the Home page" hint="Featured projects can be highlighted on Home." checked={values.isFeatured} onChange={(v) => set("isFeatured", v)} />
        <CheckboxField label="Needs content" hint="Marks text you still plan to replace. Clear it when the page is final." checked={values.isPlaceholder} onChange={(v) => set("isPlaceholder", v)} />
      </FormSection>
    </form>
  );
}
