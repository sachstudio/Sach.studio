import Image from "next/image";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { cardMeta, type ProjectCardData } from "@/lib/projects";

function FigmaMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M8 3h4a3 3 0 1 1 0 6H8V3Zm0 6h4a3 3 0 1 1 0 6H8V9Zm0 6h3v3a3 3 0 1 1-3-3Zm0-6v6M12 9v6" />
    </svg>
  );
}

/** The link text stays small and underlined; the invisible pseudo-element stretches the tap area to 48px high. */
const linkHitArea = "relative after:absolute after:-inset-x-1 after:-inset-y-3 after:content-['']";

function CardActions({ project }: { project: ProjectCardData }) {
  if (!project.hasDetail && !project.figmaUrl) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
      {project.hasDetail && (
        <Button variant="link" href={`/works/${project.slug}`} className={linkHitArea}>
          Case study
        </Button>
      )}
      {project.figmaUrl && (
        <Button variant="link" href={project.figmaUrl} icon={<FigmaMark />} className={linkHitArea}>
          Explore project
        </Button>
      )}
    </div>
  );
}

function CardImage({ project, className, sizes }: { project: ProjectCardData; className?: string; sizes: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl bg-neutral-100", className)}>
      <Image
        src={project.cardImageUrl}
        alt={`Preview of the ${project.title} design`}
        width={630}
        height={474}
        sizes={sizes}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/** Wide card: image on the left, details on the right (Works page, and the lead card on Home). */
export function ProjectRowCard({ project }: { project: ProjectCardData }) {
  const meta = cardMeta(project);
  return (
    <article className="motion-lift grid gap-6 rounded-3xl border border-neutral-200 bg-white p-2.5 shadow-card lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] lg:gap-8 xl:grid-cols-[minmax(0,630px)_1fr] xl:gap-10">
      <CardImage project={project} sizes="(min-width: 1280px) 630px, (min-width: 1024px) 55vw, 100vw" className="aspect-[630/474]" />
      <div className="flex flex-col justify-between gap-8 px-3 pb-6 pt-2 lg:py-8 lg:pr-8 xl:py-9 xl:pr-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-600">{meta || " "}</p>
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-3xl leading-[1.15] text-neutral-950 sm:text-4xl md:text-[40px] lg:text-4xl xl:text-[40px]">{project.title}</h3>
          {project.summary && <p className="max-w-[520px] text-[17px] leading-[1.75] text-neutral-600">{project.summary}</p>}
        </div>
        <CardActions project={project} />
      </div>
    </article>
  );
}

/** Compact card: image on top, title and links below (Home grid and "More like this"). */
export function ProjectTileCard({ project, showDate = false }: { project: ProjectCardData; showDate?: boolean }) {
  const meta = showDate ? (project.displayDate ?? cardMeta(project)) : "";
  return (
    <article className="motion-lift flex flex-col gap-5">
      <div className="rounded-3xl border border-neutral-200 bg-white p-2.5 shadow-card">
        <CardImage project={project} sizes="(min-width: 768px) 400px, 100vw" className="aspect-[4/3]" />
      </div>
      <div className="flex flex-col gap-3 px-1">
        {meta && <p className="text-sm text-neutral-500">{meta}</p>}
        <h3 className="font-serif text-[28px] leading-tight text-neutral-950 md:text-2xl lg:text-[28px]">{project.title}</h3>
        <CardActions project={project} />
      </div>
    </article>
  );
}
