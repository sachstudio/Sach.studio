import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import { emptyCaseStudy } from "@/lib/admin-forms";

export default function NewCaseStudyPage() {
  return <CaseStudyForm initial={emptyCaseStudy()} />;
}
