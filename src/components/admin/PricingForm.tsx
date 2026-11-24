"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deletePricingPlanAction,
  publishPricingPlanAction,
  savePricingPlanAction,
  unpublishPricingPlanAction,
  type ActionResult,
} from "@/app/admin/actions";
import { MAX_PLAN_FEATURES, type PricingPlanInput } from "@/lib/validation";
import { BenefitsField } from "./BenefitsField";
import { FormSection, TextArea, TextField } from "./fields";
import { FormActions } from "./FormActions";
import { FormNotice } from "./FormNotice";
import { PageHeader } from "./PageHeader";
import { PublishPanel } from "./PublishPanel";

/** Add or edit one package: everything on its card in the home page's pricing section. */
export function PricingForm({ id, initial }: { id?: string; initial: PricingPlanInput }) {
  const router = useRouter();
  const [values, setValues] = useState<PricingPlanInput>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof PricingPlanInput>(key: K, value: PricingPlanInput[K]) => setValues((v) => ({ ...v, [key]: value }));

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
      router.replace(`/admin/pricing/${result.id}`);
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
        run(async () => finish(await savePricingPlanAction(values, id)));
      }}
      className="flex flex-col gap-4"
    >
      <PageHeader title={id ? "Edit package" : "New package"} subtitle="A pricing card on your home page" />

      {notice && <FormNotice kind={notice.kind} text={notice.text} />}

      <div className="grid grid-cols-12 gap-[30px]">
        <div className="order-2 col-span-12 flex flex-col gap-[30px] lg:order-1 lg:col-span-8">
          <FormSection title="Card" description="What visitors read on the package card.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField required label="Package name" value={values.name} onChange={(v) => set("name", v)} error={errors.name} className="sm:col-span-2" />
              <TextArea label="Short description" value={values.description} onChange={(v) => set("description", v)} error={errors.description} rows={3} className="sm:col-span-2" />
              <TextField label="Words before the price" value={values.priceLabel} onChange={(v) => set("priceLabel", v)} error={errors.priceLabel} hint="For example Starting from. Leave empty to show only the price." />
              <TextField required label="Price" value={values.price} onChange={(v) => set("price", v)} error={errors.price} placeholder="$1,999" hint="Shown exactly as you type it." />
            </div>
          </FormSection>

          <FormSection title="Button">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField required label="Button text" value={values.ctaLabel} onChange={(v) => set("ctaLabel", v)} error={errors.ctaLabel} />
              <TextField
                label="Button link"
                value={values.ctaHref}
                onChange={(v) => set("ctaHref", v)}
                error={errors.ctaHref}
                hint="#book-a-call jumps to the booking section. You can also use /contact or a full https:// address."
              />
            </div>
          </FormSection>

          <FormSection title="Benefits" description="The list under the button, one line each.">
            <BenefitsField label="Benefits" value={values.features} onChange={(v) => set("features", v)} max={MAX_PLAN_FEATURES} error={errors.features} />
          </FormSection>

          <FormActions published={shown} pending={pending} cancelHref="/admin/pricing" />
        </div>

        <aside className="order-1 col-span-12 flex flex-col gap-[30px] self-start lg:order-2 lg:sticky lg:top-20 lg:col-span-4">
          <PublishPanel
            entity="package"
            entityTitle={values.name}
            status={values.status}
            needsContent={false}
            saved={Boolean(id)}
            pending={pending}
            liveHref={id && shown ? "/#pricing" : undefined}
            onPublish={() => run(async () => finish(await publishPricingPlanAction(values, id), "published"))}
            onUnpublish={() => {
              if (!id) return;
              run(async () => finish(await unpublishPricingPlanAction(id), "draft"));
            }}
            onDelete={() => {
              if (!id) return;
              run(async () => {
                const result = await deletePricingPlanAction(id);
                if (result.ok) {
                  router.replace("/admin/pricing");
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
              hint="Lower numbers come first. The current cards use 10, 20, 30 and 40."
            />
          </FormSection>
        </aside>
      </div>
    </form>
  );
}
