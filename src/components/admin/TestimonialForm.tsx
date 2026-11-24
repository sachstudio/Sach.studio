"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deleteTestimonialAction,
  publishTestimonialAction,
  saveTestimonialAction,
  unpublishTestimonialAction,
  type ActionResult,
} from "@/app/admin/actions";
import type { TestimonialInput } from "@/lib/validation";
import { FormSection, TextArea, TextField } from "./fields";
import { FormActions } from "./FormActions";
import { FormNotice } from "./FormNotice";
import { ImageField } from "./ImageField";
import { PageHeader } from "./PageHeader";
import { PublishPanel } from "./PublishPanel";

/** Add or edit one client quote shown in the home page's "What our clients say" section. */
export function TestimonialForm({ id, initial }: { id?: string; initial: TestimonialInput }) {
  const router = useRouter();
  const [values, setValues] = useState<TestimonialInput>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof TestimonialInput>(key: K, value: TestimonialInput[K]) => setValues((v) => ({ ...v, [key]: value }));

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
      router.replace(`/admin/testimonials/${result.id}`);
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(async () => finish(await saveTestimonialAction(values, id)));
      }}
      className="flex flex-col gap-4"
    >
      <PageHeader title={id ? "Edit testimonial" : "New testimonial"} subtitle="A client quote on your home page" />

      {notice && <FormNotice kind={notice.kind} text={notice.text} />}

      <div className="grid grid-cols-12 gap-[30px]">
        <div className="order-2 col-span-12 flex flex-col gap-[30px] lg:order-1 lg:col-span-8">
          <FormSection title="Client" description="Who said it.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField required label="Client name" value={values.name} onChange={(v) => set("name", v)} error={errors.name} />
              <TextField label="Role and company" value={values.role} onChange={(v) => set("role", v)} error={errors.role} placeholder="Founder, SaaS Startup" />
              <TextField
                label="Label on the card"
                value={values.tag}
                onChange={(v) => set("tag", v)}
                error={errors.tag}
                placeholder="Website & Landing Pages"
                hint="The small tag in the corner, usually the service they bought."
                className="sm:col-span-2"
              />
            </div>
          </FormSection>

          <FormSection title="Quote" description="Exactly what the client said.">
            <TextArea
              required
              label="Quote"
              value={values.quote}
              onChange={(v) => set("quote", v)}
              error={errors.quote}
              rows={7}
              hint="Shown as typed, so add quotation marks yourself if you want them."
            />
          </FormSection>

          <FormSection title="Photo">
            <ImageField
              label="Client photo"
              value={values.avatarUrl}
              onChange={(v) => set("avatarUrl", v)}
              error={errors.avatarUrl}
              folder="testimonials"
              hint="Optional. With no photo the card shows their initials instead."
            />
          </FormSection>

          <FormActions published={shown} pending={pending} cancelHref="/admin/testimonials" />
        </div>

        <aside className="order-1 col-span-12 flex flex-col gap-[30px] self-start lg:order-2 lg:sticky lg:top-20 lg:col-span-4">
          <PublishPanel
            entity="testimonial"
            entityTitle={values.name}
            status={values.status}
            needsContent={false}
            saved={Boolean(id)}
            pending={pending}
            liveHref={id && shown ? "/" : undefined}
            onPublish={() => run(async () => finish(await publishTestimonialAction(values, id), "published"))}
            onUnpublish={() => {
              if (!id) return;
              run(async () => finish(await unpublishTestimonialAction(id), "draft"));
            }}
            onDelete={() => {
              if (!id) return;
              run(async () => {
                const result = await deleteTestimonialAction(id);
                if (result.ok) {
                  router.replace("/admin/testimonials");
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
              hint="Lower numbers come first. The current quotes use 10, 20, 30 and so on."
            />
          </FormSection>
        </aside>
      </div>
    </form>
  );
}
