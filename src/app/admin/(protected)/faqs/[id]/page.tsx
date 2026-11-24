import { notFound } from "next/navigation";
import { connection } from "next/server";
import { FaqForm } from "@/components/admin/FaqForm";
import { getRepo } from "@/db";
import { faqToInput, isUuid } from "@/lib/admin-forms";
import { gateAdmin } from "@/lib/admin-gate";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  await gateAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const faq = await (await getRepo()).adminGetFaq(id);
  if (!faq) notFound();
  return <FaqForm id={id} initial={faqToInput(faq)} />;
}
