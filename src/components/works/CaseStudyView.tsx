import Image from "next/image";
import { Button, Pill, SectionHeading, SnapRow, SnapSlide } from "@/components/ui";
import { Reveal } from "@/components/ui/Reveal";
import type { CaseStudy } from "@/db/schema";
import { groupFeatureImages, normalizeFeatureImages } from "@/lib/feature-images";
import { toCardData } from "@/lib/projects";
import { ProjectTileCard } from "./ProjectCard";

function FigmaMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M8 3h4a3 3 0 1 1 0 6H8V3Zm0 6h4a3 3 0 1 1 0 6H8V9Zm0 6h3v3a3 3 0 1 1-3-3Zm0-6v6M12 9v6" />
    </svg>
  );
}

function ImageCard({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-2.5 shadow-card">
      <Image
        src={src}
        alt={alt}
        width={1280}
        height={720}
        priority={priority}
        sizes="(min-width: 1300px) 1280px, 100vw"
        className="h-auto w-full rounded-[20px]"
      />
    </div>
  );
}

/** A square image in the same framed card; two of these share a row (half the page width each). */
function SquareCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-2.5 shadow-card">
      <Image
        src={src}
        alt={alt}
        width={640}
        height={640}
        sizes="(min-width: 1300px) 640px, (min-width: 640px) 50vw, 100vw"
        className="aspect-square h-auto w-full rounded-[20px] object-cover"
      />
    </div>
  );
}

/** `reveal={false}` when a parent group already reveals it (Results), so the fade never runs twice. */
function TwoColumn({ title, children, reveal = true }: { title: string; children: React.ReactNode; reveal?: boolean }) {
  const content = (
    <section className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-10">
      <h2 className="font-serif text-4xl leading-tight text-neutral-950 sm:text-[44px]">{title}</h2>
      <div className="flex flex-col gap-5 text-base leading-[1.8] text-neutral-500 lg:text-[15px] lg:leading-[1.85]">{children}</div>
    </section>
  );
  return reveal ? <Reveal>{content}</Reveal> : content;
}

function LeadList({ items }: { items: { lead: string; text: string }[] }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((item) => (
        <li key={item.lead} className="flex gap-3">
          <span aria-hidden className="mt-3 size-1.5 shrink-0 rounded-full bg-neutral-300" />
          <p>
            <strong className="font-semibold text-neutral-700">{item.lead}:</strong> {item.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function CaseStudyView({ study, related }: { study: CaseStudy; related: CaseStudy[] }) {
  const hasProblem = study.problemIntro.trim() || study.problems.length > 0;
  const hasSolution = study.solutionIntro.trim() || study.solutions.length > 0;
  const hasResults = study.resultsText.trim() || study.stats.length > 0;
  const featureImages = normalizeFeatureImages(study.featureImages).filter((image) => image.url);
  const featureRows = groupFeatureImages(featureImages);
  const galleryImages = study.galleryImages.filter((src) => src.trim());
  const featureNumber = new Map(featureImages.map((image, i) => [image.url, i + 1]));

  return (
    <article className="px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-16 sm:gap-24 lg:gap-32">
        <header className="flex flex-col gap-10 sm:gap-14">
          <SectionHeading as="h1" title={study.title} subtitle={study.subtitle} className="mx-auto max-w-[1000px]" />
          {study.heroImageUrl && <ImageCard src={study.heroImageUrl} alt={`${study.title}: project overview`} priority />}
        </header>

        <Reveal>
          <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-6">
              {study.clientLogoUrl && (
                <Image
                  src={study.clientLogoUrl}
                  alt={study.clientName ? `${study.clientName} logo` : "Client logo"}
                  width={300}
                  height={100}
                  className="h-14 w-auto self-start mix-blend-multiply"
                />
              )}
              {study.tags.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {study.tags.map((tag) => (
                    <li key={tag}>
                      <Pill tone="neutral">{tag}</Pill>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
                {study.figmaUrl && (
                  <Button variant="primary" href={study.figmaUrl} icon={<FigmaMark />} className="h-11 w-full px-5 text-xs sm:w-auto">
                    View Figma design
                  </Button>
                )}
                {study.liveUrl ? (
                  <Button variant="outline" href={study.liveUrl} className="h-11 w-full px-5 text-xs sm:w-auto">
                    Live website
                  </Button>
                ) : (
                  <span
                    aria-disabled
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 text-xs sm:w-auto font-semibold uppercase tracking-[0.01em] text-neutral-400"
                  >
                    Live soon
                  </span>
                )}
              </div>
            </div>
            {study.about.trim() && (
              <div className="flex flex-col gap-5">
                <h2 className="font-serif text-4xl leading-tight text-neutral-950 sm:text-[44px]">
                  {study.clientName ? `About ${study.clientName}` : "About the project"}
                </h2>
                <p className="text-base leading-[1.8] text-neutral-500 lg:text-[15px] lg:leading-[1.85]">{study.about}</p>
              </div>
            )}
          </section>
        </Reveal>

        {study.bannerImageUrl && (
          <Reveal>
            <ImageCard src={study.bannerImageUrl} alt={`${study.title}: highlights`} />
          </Reveal>
        )}

        {hasProblem && (
          <TwoColumn title="Problem Statement">
            {study.problemIntro && <p>{study.problemIntro}</p>}
            {study.problems.length > 0 && <LeadList items={study.problems} />}
          </TwoColumn>
        )}

        {hasSolution && (
          <TwoColumn title="Solutions">
            {study.solutionIntro && <p>{study.solutionIntro}</p>}
            {study.solutions.length > 0 && <LeadList items={study.solutions} />}
          </TwoColumn>
        )}

        {featureRows.length > 0 && (
          <Reveal className="flex flex-col gap-6">
            {featureRows.map((row) =>
              row[0].shape === "rectangle" ? (
                <div key={row[0].url} data-feature-row="rectangle">
                  <ImageCard src={row[0].url} alt={`${study.title}: design detail ${featureNumber.get(row[0].url)}`} />
                </div>
              ) : (
                <div key={row[0].url} data-feature-row="square-pair" className="grid gap-6 sm:grid-cols-2">
                  {row.map((image) => (
                    <SquareCard key={image.url} src={image.url} alt={`${study.title}: design detail ${featureNumber.get(image.url)}`} />
                  ))}
                </div>
              ),
            )}
          </Reveal>
        )}

        {hasResults && (
          <Reveal className="flex flex-col gap-10 sm:gap-14">
            <TwoColumn title="Results" reveal={false}>{study.resultsText && <p>{study.resultsText}</p>}</TwoColumn>
            {study.stats.length > 0 && (
              <dl className="grid divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200 bg-white/60 md:grid-flow-col md:auto-cols-fr md:divide-x md:divide-y-0">
                {study.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse items-center gap-2 px-6 py-8 text-center">
                    <dt className="text-[15px] text-neutral-500">{stat.label}</dt>
                    <dd className="font-serif text-[48px] leading-none text-neutral-900">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>
        )}

        {galleryImages.length > 0 && (
          <Reveal className="flex flex-col gap-6">
            {galleryImages.map((src, i) => (
              <ImageCard key={src} src={src} alt={`${study.title}: gallery image ${i + 1}`} />
            ))}
          </Reveal>
        )}

        {study.conclusion.trim() && (
          <TwoColumn title="Conclusion">
            <p>{study.conclusion}</p>
          </TwoColumn>
        )}

        {related.length > 0 && (
          <Reveal>
            <section className="flex flex-col gap-12">
              <h2 className="text-center font-serif text-4xl text-neutral-950 sm:text-[44px]">More like this</h2>
              <SnapRow label="More like this, swipe to see more case studies" className="md:grid md:grid-cols-3 md:gap-6 lg:gap-8">
                {related.map((r) => (
                  <SnapSlide key={r.slug}>
                    <ProjectTileCard project={toCardData(r)} showDate />
                  </SnapSlide>
                ))}
              </SnapRow>
            </section>
          </Reveal>
        )}
      </div>
    </article>
  );
}
