export type NavLink = { label: string; href: string };

export const site = {
  name: "Sach Studio",
  tagline: "Premium Design & Development Studio",
  email: "hi@sach.studio",
  phone: "+91 6360 809 874",
  phoneHref: "tel:+916360809874",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Works", href: "/works" },
    { label: "Contact Us", href: "/contact" },
  ] satisfies NavLink[],
  footerLinks: [
    { label: "Work", href: "/works" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavLink[],
  /** Profile URLs were not supplied; they point at the contact page until the owner provides them. */
  social: [
    { label: "LinkedIn", href: "/contact" },
    { label: "Instagram", href: "/contact" },
    { label: "Twitter / X", href: "/contact" },
  ] satisfies NavLink[],
  legal: [
    { label: "Privacy Policy", href: "/conditions/privacy-policy" },
    { label: "Terms & Conditions", href: "/conditions/terms-conditions" },
    { label: "Payment & Cancellation", href: "/conditions/payment-cancellation" },
  ] satisfies NavLink[],
};

/** Highlight rule for the header: a nav link is current for its own path and any nested path. */
export function isCurrentPath(linkHref: string, currentPath: string): boolean {
  if (linkHref === "/") return currentPath === "/";
  return currentPath === linkHref || currentPath.startsWith(`${linkHref}/`);
}
