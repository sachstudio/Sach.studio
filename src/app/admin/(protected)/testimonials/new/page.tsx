import { connection } from "next/server";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { emptyTestimonial } from "@/lib/admin-forms";
import { gateAdmin } from "@/lib/admin-gate";

export default async function NewTestimonialPage() {
  await connection();
  await gateAdmin();
  return <TestimonialForm initial={emptyTestimonial()} />;
}
