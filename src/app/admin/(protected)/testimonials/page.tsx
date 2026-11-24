import { connection } from "next/server";
import { TestimonialTable } from "@/components/admin/TestimonialTable";
import { getRepo } from "@/db";
import { gateAdmin } from "@/lib/admin-gate";

export default async function AdminTestimonialsPage() {
  await connection(); // read the database at request time, never during the build
  await gateAdmin();
  const items = await (await getRepo()).adminListTestimonials();

  return (
    <TestimonialTable
      rows={items.map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        tag: t.tag,
        quote: t.quote,
        avatarUrl: t.avatarUrl,
        status: t.status,
        position: t.sortOrder,
      }))}
    />
  );
}
