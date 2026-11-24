import { notFound } from "next/navigation";
import { connection } from "next/server";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { getRepo } from "@/db";
import { isUuid, testimonialToInput } from "@/lib/admin-forms";
import { gateAdmin } from "@/lib/admin-gate";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  await gateAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const item = await (await getRepo()).adminGetTestimonial(id);
  if (!item) notFound();
  return <TestimonialForm id={id} initial={testimonialToInput(item)} />;
}
