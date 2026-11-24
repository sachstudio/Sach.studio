import { connection } from "next/server";
import { PricingForm } from "@/components/admin/PricingForm";
import { emptyPricingPlan } from "@/lib/admin-forms";
import { gateAdmin } from "@/lib/admin-gate";

export default async function NewPricingPlanPage() {
  await connection();
  await gateAdmin();
  return <PricingForm initial={emptyPricingPlan()} />;
}
