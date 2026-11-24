"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deleteFaqAction,
  publishFaqAction,
  saveFaqAction,
  unpublishFaqAction,
  type ActionResult,
} from "@/app/admin/actions";
import { FAQ_PAGES, type FaqPage } from "@/lib/faq-pages";
import type { FaqInput } from "@/lib/validation";
import { CheckboxField, FormSection, TextArea, TextField } from "./fields";
import { FormActions } from "./FormActions";
import { FormNotice } from "./FormNotice";
import { PageHeader } from "./PageHeader";
import { PublishPanel } from "./PublishPanel";

/** Add or edit one FAQ: the question, the answer, and which pages of the website show it. */
export function FaqForm({ id, initial }: { id?: string; initial: FaqInput }) {
  const router = useRouter();
  const [values, setValues] = useState<FaqInput>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof FaqInput>(key: K, value: FaqInput[K]) => setValues((v) => ({ ...v, [key]: value }));

  // Keep the pages in the website's order (Home, then Contact), whatever order they were ticked in.
  function togglePage(page: FaqPage, on: boolean) {
    const next = FAQ_PAGES.map((p) => p.value).filter((p) => (p === page ? on : values.pages.includes(p)));
    set("pages", next);
  }

  function finish(result: ActionResult, nextStatus?: "draft" | "published") {
    if (!result.ok) {
      setErrors(result.errors ?? {});
      const hasFieldErrors = Object.keys(result.errors ?? {}).length > 0;
      setNotice({ kind: "error", text: hasFieldErrors ? "Some fields need attention. Check the highlighted fields and try again." : result.error });
      return;
    }
    setErrors({});
    setNotice({ kind: "ok", text: result.message });
    if (nextStatus) set("status", nextStatus);
    if (!id && result.id) {
      router.replace(`/admin/faqs/${result.id}`);
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

  const shown = values.status === "published";
  const firstPage = FAQ_PAGES.find((p) => values.pages.includes(p.value));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(async () => finish(await saveFaqAction(values, id)));
      }}
      className="flex flex-col gap-4"
    >
      <PageHeader title={id ? "Edit FAQ" : "New FAQ"} subtitle="A question and answer on your website" />

      {notice && <FormNotice kind={notice.kind} text={notice.text} />}

      <div className="grid grid-cols-12 gap-[30px]">
        <div className="order-2 col-span-12 flex flex-col gap-[30px] lg:order-1 lg:col-span-8">
          <FormSection title="Question and answer" description="What visitors read when they open the question.">
            <TextField required label="Question" value={values.question} onChange={(v) => set("question", v)} error={errors.question} />
            <TextArea required label="Answer" value={values.answer} onChange={(v) => set("answer", v)} error={errors.answer} rows={6} />
          </FormSection>

          <FormSection title="Shown on" description="Tick every page that should show this question.">
            <div className="flex flex-col gap-3">
              {FAQ_PAGES.map((p) => (
                <CheckboxField key={p.value} label={p.label} checked={values.pages.includes(p.value)} onChange={(on) => togglePage(p.value, on)} />
              ))}
            </div>
            {errors.pages && (
              <p role="alert" className="text-sm text-destructive">
                {errors.pages}
              </p>
            )}
          </FormSection>

          <FormActions published={shown} pending={pending} cancelHref="/admin/faqs" />
        </div>

        <aside className="order-1 col-span-12 flex flex-col gap-[30px] self-start lg:order-2 lg:sticky lg:top-20 lg:col-span-4">
          <PublishPanel
            entity="FAQ"
            entityTitle={values.question}
            status={values.status}
            needsContent={false}
            saved={Boolean(id)}
            pending={pending}
            liveHref={id && shown ? firstPage?.href : undefined}
            onPublish={() => run(async () => finish(await publishFaqAction(values, id), "published"))}
            onUnpublish={() => {
              if (!id) return;
              run(async () => finish(await unpublishFaqAction(id), "draft"));
            }}
            onDelete={() => {
              if (!id) return;
              run(async () => {
                const result = await deleteFaqAction(id);
                if (result.ok) {
                  router.replace("/admin/faqs");
                  return;
                }
                setConfirmingDelete(false);
                setNotice({ kind: "error", text: result.error });
              });
            }}
            confirmingDelete={confirmingDelete}
            onConfirmingDeleteChange={setConfirmingDelete}
          />

          <FormSection title="Order">
            <TextField
              label="Position"
              value={String(values.sortOrder)}
              onChange={(v) => set("sortOrder", Number.parseInt(v, 10) || 0)}
              hint="Lower numbers come first on every page. The current FAQs use 10, 20, 30 and so on."
            />
          </FormSection>
        </aside>
      </div>
    </form>
  );
}
