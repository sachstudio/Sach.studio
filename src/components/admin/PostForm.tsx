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
import { cn } from "cn";
import { slugify } from "@/lib/slug";
import type { PostInput } from "@/lib/validation";
import { CheckboxField, FormSection, TextArea, TextField } from "./fields";
import { FormActions } from "./FormActions";
import { FormNotice } from "./FormNotice";
import { ImageField } from "./ImageField";
import { PageHeader } from "./PageHeader";
import { PublishPanel } from "./PublishPanel";

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

  // The buttons stay clickable while a request is running; a second click is simply ignored.
  const run = (work: () => Promise<void>) => {
    if (pending) return;
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
      className="flex flex-col gap-4"
    >
      <PageHeader title={id ? "Edit post" : "New post"} subtitle="An article on your blog" />

      {notice && <FormNotice kind={notice.kind} text={notice.text} />}

      <div className="grid grid-cols-12 gap-[30px]">
        <div className="order-2 col-span-12 flex flex-col gap-[30px] lg:order-1 lg:col-span-8">
          <FormSection title="Basics">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                required
                label="Title"
                value={values.title}
                error={errors.title}
                className="sm:col-span-2"
                onChange={(title) => setValues((v) => ({ ...v, title, slug: slugTouched ? v.slug : slugify(title) }))}
              />
              <TextField
                required
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
          </FormSection>

          <FormSection title="Post text" description="Write with Markdown: ## for headings, - for bullet lists, [text](https://…) for links.">
            <div role="tablist" aria-label="Editor mode" className="inline-flex w-fit gap-1 rounded-lg bg-muted p-1">
              {(["write", "preview"] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  type="button"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded-md px-4 py-1.5 text-sm font-medium transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    tab === t ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t === "write" ? "Write" : "Preview"}
                </button>
              ))}
            </div>
            {tab === "write" ? (
              <TextArea label="Post text (Markdown)" value={values.body} onChange={(v) => set("body", v)} error={errors.body} rows={18} mono />
            ) : (
              <div className="min-h-[240px] rounded-lg border bg-muted/40 p-6">
                {values.body.trim() ? <PostBody markdown={values.body} /> : <p className="text-muted-foreground">Nothing to preview yet.</p>}
              </div>
            )}
            {tab === "preview" && errors.body && (
              <p role="alert" className="text-sm text-destructive">
                {errors.body}
              </p>
            )}
          </FormSection>

          <FormActions published={published} pending={pending} cancelHref="/admin/posts" />
        </div>

        <aside className="order-1 col-span-12 flex flex-col gap-[30px] self-start lg:order-2 lg:sticky lg:top-20 lg:col-span-4">
          <PublishPanel
            entity="post"
            entityTitle={values.title}
            status={values.status}
            needsContent={values.isPlaceholder}
            saved={Boolean(id)}
            pending={pending}
            liveHref={id && published && values.slug ? `/blogs/${values.slug}` : undefined}
            onPublish={() => run(async () => finish(await publishPostAction(values, id), "published"))}
            onUnpublish={() => {
              if (!id) return;
              run(async () => finish(await unpublishPostAction(id), "draft"));
            }}
            onDelete={() => {
              if (!id) return;
              run(async () => {
                const result = await deletePostAction(id);
                if (result.ok) {
                  router.replace("/admin/posts");
                  return;
                }
                setConfirmingDelete(false);
                setNotice({ kind: "error", text: result.error });
              });
            }}
            confirmingDelete={confirmingDelete}
            onConfirmingDeleteChange={setConfirmingDelete}
          />

          <FormSection title="Cover image">
            <ImageField label="Cover image" value={values.coverImageUrl} onChange={(v) => set("coverImageUrl", v)} error={errors.coverImageUrl} folder="blogs" hint="PNG, JPG, WebP, SVG or AVIF, up to 8 MB. Required to publish." />
          </FormSection>

          <FormSection title="Options">
            <CheckboxField label="Needs content" hint="Marks text you still plan to replace. Clear it when the post is final." checked={values.isPlaceholder} onChange={(v) => set("isPlaceholder", v)} />
          </FormSection>
        </aside>
      </div>
    </form>
  );
}
