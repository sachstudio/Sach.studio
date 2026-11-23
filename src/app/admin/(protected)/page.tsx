import { currentUser } from "@clerk/nextjs/server";
import { connection } from "next/server";
import { Dashboard } from "@/components/admin/dashboard/Dashboard";
import { getRepo } from "@/db";
import { gateAdmin } from "@/lib/admin-gate";
import { buildDashboard, greetingFor } from "@/lib/admin-dashboard";

/** The admin home: how much content there is, what is live, and what was edited last. */
export default async function AdminHome() {
  await connection(); // read the database at request time, never during the build
  await gateAdmin();
  const repo = await getRepo();
  const [studies, posts, user] = await Promise.all([repo.adminListCaseStudies(), repo.adminListPosts(), currentUser()]);

  return <Dashboard data={buildDashboard(studies, posts)} greeting={greetingFor(new Date())} name={user?.firstName || "there"} />;
}
