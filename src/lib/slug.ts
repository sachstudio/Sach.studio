export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 80;

/** Turn a title into a URL slug: lowercase letters, numbers and single hyphens. */
export function slugify(input: string): string {
  const slug = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, "");
}
