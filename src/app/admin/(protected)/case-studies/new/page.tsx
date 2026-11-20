import { connection } from "next/server";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import { emptyCaseStudy } from "@/lib/admin-forms";
import { gateAdmin } from "@/lib/admin-gate";

export default async function NewCaseStudyPage() {
  await connection();
  await gateAdmin();
  return <CaseStudyForm initial={emptyCaseStudy()} />;
}
