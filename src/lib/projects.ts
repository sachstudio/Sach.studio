import type { CategorySlug } from "./categories";

/** The fields of a case study that the cards need. Kept small so it is cheap to send to the browser. */
export type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  category: CategorySlug;
  cardImageUrl: string;
  statusLabel: "LIVE" | "ONGOING" | "CONCEPT" | null;
  displayDate: string | null;
  figmaUrl: string;
  /** True when the project has a case study page worth linking to. */
  hasDetail: boolean;
};

export type ProjectSource = Omit<ProjectCardData, "hasDetail"> & { about: string };

export function toCardData(source: ProjectSource): ProjectCardData {
  return {
    slug: source.slug,
    title: source.title,
    summary: source.summary,
    category: source.category,
    cardImageUrl: source.cardImageUrl,
    statusLabel: source.statusLabel,
    displayDate: source.displayDate,
    figmaUrl: source.figmaUrl,
    hasDetail: source.about.trim().length > 0,
  };
}

/** The small label above a card title: status if it has one, otherwise the date. */
export function cardMeta(project: Pick<ProjectCardData, "statusLabel" | "displayDate">): string {
  return project.statusLabel ?? project.displayDate ?? "";
}
