/** The pages of the website that show a list of FAQs. Add a page here and it appears as a choice in the admin. */
export const FAQ_PAGES = [
  { value: "home", label: "Home page", href: "/" },
  { value: "contact", label: "Contact page", href: "/contact" },
] as const;

export type FaqPage = (typeof FAQ_PAGES)[number]["value"];

export const FAQ_PAGE_VALUES = FAQ_PAGES.map((p) => p.value) as unknown as [FaqPage, ...FaqPage[]];

export function faqPageLabel(page: string): string {
  return FAQ_PAGES.find((p) => p.value === page)?.label ?? page;
}
