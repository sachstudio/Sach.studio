export const ADMIN_SECTIONS = [
  { href: "/admin/case-studies", label: "Case studies", singular: "case study" },
  { href: "/admin/posts", label: "Blog posts", singular: "post" },
] as const;

export const DASHBOARD_HREF = "/admin";

/** True on the admin home only, not on the sections inside it. */
export function isDashboard(pathname: string): boolean {
  return pathname === DASHBOARD_HREF || pathname === `${DASHBOARD_HREF}/`;
}

export type Crumb = { label: string; href?: string };

/** True on the section's list page and on everything inside it (new, edit, preview). */
export function isCurrentSection(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** The trail shown in the admin's top bar, for example Case studies / Edit case study. */
export function breadcrumbsFor(pathname: string): Crumb[] {
  const section = ADMIN_SECTIONS.find((s) => isCurrentSection(pathname, s.href));
  if (!section) return [];

  const rest = pathname.slice(section.href.length).split("/").filter(Boolean);
  if (rest.length === 0) return [{ label: section.label }];

  const listCrumb: Crumb = { label: section.label, href: section.href };
  if (rest[0] === "new") return [listCrumb, { label: `New ${section.singular}` }];

  const editLabel = `Edit ${section.singular}`;
  if (rest[1] === "preview") {
    return [listCrumb, { label: editLabel, href: `${section.href}/${rest[0]}` }, { label: "Preview" }];
  }
  return [listCrumb, { label: editLabel }];
}
