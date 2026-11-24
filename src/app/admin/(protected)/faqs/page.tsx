import { connection } from "next/server";
import { FaqTable } from "@/components/admin/FaqTable";
import { getRepo } from "@/db";
import { gateAdmin } from "@/lib/admin-gate";

export default async function AdminFaqsPage() {
  await connection(); // read the database at request time, never during the build
  await gateAdmin();
  const faqs = await (await getRepo()).adminListFaqs();

  return (
    <FaqTable
      rows={faqs.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        pages: f.pages,
        status: f.status,
        position: f.sortOrder,
      }))}
    />
  );
}
