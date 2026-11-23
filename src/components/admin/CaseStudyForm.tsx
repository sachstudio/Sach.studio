"use client";

import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deleteCaseStudyAction,
  publishCaseStudyAction,
  saveCaseStudyAction,
  unpublishCaseStudyAction,
  type ActionResult,
} from "@/app/admin/actions";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import { slugify } from "@/lib/slug";
import { META_DESCRIPTION_MAX, META_TITLE_MAX, MAX_STATS, MAX_TAGS, type CaseStudyInput } from "@/lib/validation";
import { CheckboxField, FormSection, SelectField, TextArea, TextField } from "./fields";
import { FormActions } from "./FormActions";
import { FormNotice } from "./FormNotice";
import { FeatureImageListField, ImageField, ImageListField } from "./ImageField";
import { ListField } from "./ListField";
import { PageHeader } from "./PageHeader";
import { PublishPanel } from "./PublishPanel";

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

  // The buttons stay clickable while a request is running; a second click is simply ignored.
  const run = (work: () => Promise<void>) => {
    if (pending) return;
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
        router.replace("/admin/case-studies");
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
      className="flex flex-col gap-4"
    >
      <PageHeader title={id ? "Edit case study" : "New case study"} />

      {notice && <FormNotice kind={notice.kind} text={notice.text} />}

      <div className="grid grid-cols-12 gap-[30px]">
        <div className="order-2 col-span-12 flex flex-col gap-[30px] lg:order-1 lg:col-span-8">
          <FormSection title="Basics" description="What visitors read first, and where this page lives.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Title" value={values.title} onChange={onTitle} error={errors.title} className="sm:col-span-2" required />
              <TextField
                required
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
            </div>
          </FormSection>

          <FormSection title="Images" description="PNG, JPG, WebP, SVG or AVIF, up to 8 MB each.">
            <div className="grid gap-5 xl:grid-cols-2">
              <ImageField label="Card image" value={values.cardImageUrl} onChange={(v) => set("cardImageUrl", v)} error={errors.cardImageUrl} folder="case-studies" hint="Shown on the Works and Home grids. Required to publish." />
              <ImageField label="Hero image" value={values.heroImageUrl} onChange={(v) => set("heroImageUrl", v)} error={errors.heroImageUrl} folder="case-studies" hint="The large image under the title." />
              <ImageField label="Client logo" value={values.clientLogoUrl} onChange={(v) => set("clientLogoUrl", v)} error={errors.clientLogoUrl} folder="logos" />
              <ImageField label="Banner image" value={values.bannerImageUrl} onChange={(v) => set("bannerImageUrl", v)} error={errors.bannerImageUrl} folder="case-studies" />
            </div>
            <FeatureImageListField label="Feature images" value={values.featureImages} onChange={(v) => set("featureImages", v)} folder="case-studies" error={errors.featureImages} />
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
              <legend className="mb-1 text-sm font-medium">Result stats (up to {MAX_STATS})</legend>
              {values.stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-2 sm:flex-row">
                  <Input aria-label={`Stat ${i + 1} number`} placeholder="42%" value={stat.value} onChange={(e) => updateStat(i, { value: e.target.value })} className="sm:w-40" />
                  <Input aria-label={`Stat ${i + 1} label`} placeholder="Increased B2B lead generation" value={stat.label} onChange={(e) => updateStat(i, { label: e.target.value })} />
                  <Button type="button" variant="ghost" aria-label={`Remove stat ${i + 1}`} onClick={() => set("stats", values.stats.filter((_, idx) => idx !== i))} className="text-destructive hover:text-destructive">
                    <X /> Remove
                  </Button>
                </div>
              ))}
              <div>
                <Button type="button" variant="outline" size="sm" disabled={values.stats.length >= MAX_STATS} onClick={() => set("stats", [...values.stats, { value: "", label: "" }])}>
                  <Plus /> Add stat
                </Button>
              </div>
              {errors.stats && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.stats}
                </p>
              )}
            </fieldset>
            <TextArea label="Conclusion" value={values.conclusion} onChange={(v) => set("conclusion", v)} error={errors.conclusion} rows={4} />
          </FormSection>

          <FormSection title="Listing and search" description="How this project appears on cards and in Google.">
            <TextArea label="Card summary" value={values.summary} onChange={(v) => set("summary", v)} error={errors.summary} rows={3} hint="One or two sentences on the project card. Required to publish." />
            <TextField label="Meta title" value={values.metaTitle} onChange={(v) => set("metaTitle", v)} error={errors.metaTitle} max={META_TITLE_MAX} hint="The title in Google results. Include “Sach Studio”." />
            <TextArea label="Meta description" value={values.metaDescription} onChange={(v) => set("metaDescription", v)} error={errors.metaDescription} rows={3} max={META_DESCRIPTION_MAX} />
          </FormSection>

          <FormActions published={published} pending={pending} cancelHref="/admin/case-studies" />
        </div>

        <aside className="order-1 col-span-12 flex flex-col gap-[30px] self-start lg:order-2 lg:sticky lg:top-20 lg:col-span-4">
          <PublishPanel
            entity="case study"
            entityTitle={values.title}
            status={values.status}
            needsContent={values.isPlaceholder}
            saved={Boolean(id)}
            pending={pending}
            previewHref={id ? `/admin/case-studies/${id}/preview` : undefined}
            liveHref={id && published && values.slug ? `/works/${values.slug}` : undefined}
            onPublish={onPublish}
            onUnpublish={onUnpublish}
            onDelete={onDelete}
            confirmingDelete={confirmingDelete}
            onConfirmingDeleteChange={setConfirmingDelete}
          />

          <FormSection title="Details">
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
          </FormSection>

          <FormSection title="Options">
            <CheckboxField label="Feature on the Home page" hint="Featured projects are shown first in the Home page project grid." checked={values.isFeatured} onChange={(v) => set("isFeatured", v)} />
            <CheckboxField label="Needs content" hint="Marks text you still plan to replace. Clear it when the page is final." checked={values.isPlaceholder} onChange={(v) => set("isPlaceholder", v)} />
          </FormSection>
        </aside>
      </div>
    </form>
  );
}
