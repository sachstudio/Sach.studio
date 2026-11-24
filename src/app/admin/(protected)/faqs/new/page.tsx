import { connection } from "next/server";
import { FaqForm } from "@/components/admin/FaqForm";
import { emptyFaq } from "@/lib/admin-forms";
import { gateAdmin } from "@/lib/admin-gate";

export default async function NewFaqPage() {
  await connection();
  await gateAdmin();
  return <FaqForm initial={emptyFaq()} />;
}
