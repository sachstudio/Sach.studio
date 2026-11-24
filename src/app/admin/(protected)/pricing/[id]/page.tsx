import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PricingForm } from "@/components/admin/PricingForm";
import { getRepo } from "@/db";
import { isUuid, pricingPlanToInput } from "@/lib/admin-forms";
import { gateAdmin } from "@/lib/admin-gate";

export default async function EditPricingPlanPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  await gateAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const plan = await (await getRepo()).adminGetPricingPlan(id);
  if (!plan) notFound();
  return <PricingForm id={id} initial={pricingPlanToInput(plan)} />;
}
