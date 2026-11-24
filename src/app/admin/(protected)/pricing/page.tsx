import { connection } from "next/server";
import { PricingTable } from "@/components/admin/PricingTable";
import { getRepo } from "@/db";
import { gateAdmin } from "@/lib/admin-gate";

export default async function AdminPricingPage() {
  await connection(); // read the database at request time, never during the build
  await gateAdmin();
  const plans = await (await getRepo()).adminListPricingPlans();

  return (
    <PricingTable
      rows={plans.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        priceLabel: p.priceLabel,
        benefits: p.features.length,
        status: p.status,
        position: p.sortOrder,
      }))}
    />
  );
}
