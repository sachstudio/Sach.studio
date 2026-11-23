import { redirect } from "next/navigation";
import { connection } from "next/server";
import { gateAdmin } from "@/lib/admin-gate";

/** /admin is the way in; the work happens on the case studies and blog posts pages. */
export default async function AdminHome() {
  await connection();
  await gateAdmin();
  redirect("/admin/case-studies");
}
