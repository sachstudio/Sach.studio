export const CATEGORIES = [
  { slug: "websites", label: "Website & Landing Pages" },
  { slug: "mobile-apps", label: "Mobile Apps" },
  { slug: "web-apps-dashboard", label: "Web Apps & Dashboard" },
  { slug: "logo-branding", label: "Logo & Branding" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value);
}

export function categoryLabel(slug: CategorySlug): string {
  return CATEGORIES.find((c) => c.slug === slug)!.label;
}
