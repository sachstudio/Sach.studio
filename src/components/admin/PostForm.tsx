"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deletePostAction,
  publishPostAction,
  savePostAction,
  unpublishPostAction,
  type ActionResult,
} from "@/app/admin/actions";
import { PostBody } from "@/components/blogs/PostBody";
import { slugify } from "@/lib/slug";
import type { PostInput } from "@/lib/validation";
import { CheckboxField, FormSection, TextArea, TextField } from "./fields";
import { ImageField } from "./ImageField";
import { StatusBadge } from "./StatusBadge";

export function PostForm({ id, initial }: { id?: string; initial: PostInput }) {
  const router = useRouter();
  const [values, setValues] = useState<PostInput>(initial);
  const [slugTouched, setSlugTouched] = useState(initial.slug !== "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof PostInput>(key: K, value: PostInput[K]) => setValues((v) => ({ ...v, [key]: value }));

  function finish(result: ActionResult, nextStatus?: "draft" | "published") {
    if (!result.ok) {
      setErrors(result.errors ?? {});
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
      router.replace(`/admin/posts/${result.id}`);
      return;
    }
    router.refresh();
  }

  const run = (work: () => Promise<void>) => {
    setNotice(null);
    startTransition(work);
  };

  const published = values.status === "published";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(async () => finish(await savePostAction(values, id)));
      }}
      className="flex flex-col gap-6"
    >
      <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl text-neutral-950">{id ? "Edit post" : "New post"}</h1>
          <StatusBadge status={values.status} needsContent={values.isPlaceholder} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {id && published && values.slug && (
            <a href={`/blogs/${values.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
              View live page
            </a>
          )}
          <button type="submit" disabled={pending} className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 disabled:opacity-50">
            {published ? "Save changes" : "Save draft"}
          </button>
          {!published && (
            <button type="button" disabled={pending} onClick={() => run(async () => finish(await publishPostAction(values, id), "published"))} className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50">
              Publish
            </button>
          )}
          {published && id && (
            <button type="button" disabled={pending} onClick={() => run(async () => finish(await unpublishPostAction(id), "draft"))} className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 disabled:opacity-50">
              Unpublish
            </button>
          )}
          {id && (
            <button type="button" disabled={pending} onClick={() => setConfirmingDelete(true)} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
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

      {confirmingDelete && id && (
        <div role="alertdialog" aria-labelledby="delete-post-title" className="motion-enter-small rounded-xl border border-red-200 bg-red-50 p-5">
          <p id="delete-post-title" className="font-medium text-red-900">
            Delete this post? It will be removed from the website and this cannot be undone.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                run(async () => {
                  const result = await deletePostAction(id);
                  if (result.ok) {
                    router.replace("/admin");
                    return;
                  }
                  setConfirmingDelete(false);
                  setNotice({ kind: "error", text: result.error });
                })
              }
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              Delete post
            </button>
            <button type="button" onClick={() => setConfirmingDelete(false)} className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800">
              Cancel
            </button>
          </div>
        </div>
      )}

      <FormSection title="Basics">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Title"
            value={values.title}
            error={errors.title}
            className="sm:col-span-2"
            onChange={(title) => setValues((v) => ({ ...v, title, slug: slugTouched ? v.slug : slugify(title) }))}
          />
          <TextField
            label="URL slug"
            value={values.slug}
            error={errors.slug}
            hint="The page address: /blogs/your-slug."
            onChange={(v) => {
              setSlugTouched(true);
              set("slug", v);
            }}
          />
          <TextField label="Date shown on the post" value={values.displayDate ?? ""} onChange={(v) => set("displayDate", v || null)} placeholder="5 Mar 2026" />
          <TextArea label="Short summary" value={values.excerpt} onChange={(v) => set("excerpt", v)} error={errors.excerpt} rows={2} className="sm:col-span-2" hint="Used for Google and social previews. Optional." />
        </div>
        <ImageField label="Cover image" value={values.coverImageUrl} onChange={(v) => set("coverImageUrl", v)} error={errors.coverImageUrl} folder="blogs" hint="PNG, JPG, WebP, SVG or AVIF, up to 8 MB. Required to publish." />
      </FormSection>

      <FormSection title="Post text" description="Write with Markdown: ## for headings, - for bullet lists, [text](https://…) for links.">
        <div role="tablist" aria-label="Editor mode" className="inline-flex w-fit gap-1 rounded-xl border border-neutral-200 bg-neutral-100 p-1">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={tab === t ? "rounded-lg bg-white px-4 py-1.5 text-sm font-semibold text-blue-600 shadow-sm" : "rounded-lg px-4 py-1.5 text-sm text-neutral-600"}
            >
              {t === "write" ? "Write" : "Preview"}
            </button>
          ))}
        </div>
        {tab === "write" ? (
          <TextArea label="Post text (Markdown)" value={values.body} onChange={(v) => set("body", v)} error={errors.body} rows={18} mono />
        ) : (
          <div className="min-h-[240px] rounded-xl border border-neutral-200 bg-neutral-50 p-6">
            {values.body.trim() ? <PostBody markdown={values.body} /> : <p className="text-neutral-500">Nothing to preview yet.</p>}
          </div>
        )}
        {tab === "preview" && errors.body && <p role="alert" className="text-sm text-red-600">{errors.body}</p>}
      </FormSection>

      <FormSection title="Options">
        <CheckboxField label="Needs content" hint="Marks text you still plan to replace. Clear it when the post is final." checked={values.isPlaceholder} onChange={(v) => set("isPlaceholder", v)} />
      </FormSection>
    </form>
  );
}
