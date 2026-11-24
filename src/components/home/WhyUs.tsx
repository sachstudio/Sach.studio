import Image from "next/image";
import { SectionHeading, SnapRow, SnapSlide } from "@/components/ui";
import { cn } from "@/lib/cn";
import { home } from "@/content/home";

const { whyUs } = home;

function BentoCard({
  title,
  text,
  children,
  className,
  visualClassName = "h-[240px] sm:h-[270px]",
}: {
  title: string;
  text: string;
  children: React.ReactNode;
  className?: string;
  /** Height of the picture area. The pain-point card needs more room while its labels are stacked one per row. */
  visualClassName?: string;
}) {
  return (
    <SnapSlide as="article" className={cn("flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-card", className)}>
      <div className={cn("relative overflow-hidden", visualClassName)}>{children}</div>
      <div className="flex flex-col gap-3 px-6 pb-7 pt-2 sm:px-8 sm:pb-8">
        <h3 className="font-serif text-[28px] leading-tight text-neutral-950 sm:text-[30px]">{title}</h3>
        <p className="max-w-[60ch] text-base leading-relaxed text-neutral-600 sm:text-[17px]">{text}</p>
      </div>
    </SnapSlide>
  );
}

/**
 * The tilted pain-point labels. They are scattered by hand only from xl (cards at least ~600px wide);
 * on narrower cards the fixed positions pile up on top of each other, so they wrap as a loose, tilted row instead.
 */
const pillPlacement = [
  "-rotate-[4deg] xl:left-3 xl:top-5",
  "rotate-[3deg] xl:right-3 xl:top-2 xl:-rotate-[8deg]",
  "-rotate-[3deg] xl:left-[22%] xl:top-[92px] xl:-rotate-[8deg]",
  "rotate-[5deg] xl:right-[14%] xl:top-[104px] xl:rotate-[6deg]",
  "-rotate-[5deg] xl:left-5 xl:top-[168px] xl:-rotate-[8deg]",
  "rotate-[2deg] xl:right-3 xl:top-[184px] xl:-rotate-[8deg]",
];

function PainPoints() {
  return (
    <div aria-hidden className="absolute inset-0 flex flex-wrap content-center items-center justify-center gap-x-2.5 gap-y-2.5 px-4 xl:block xl:p-0">
      {whyUs.painPoints.map((text, i) => (
        <span
          key={text}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-normal text-neutral-800 xl:absolute",
            pillPlacement[i],
            i % 3 === 0 ? "border-blue-200 bg-blue-100" : "border-neutral-200 bg-neutral-50",
          )}
        >
          <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M12 4 2.5 20h19L12 4Zm0 6v5m0 2.5v.01" strokeLinecap="round" />
          </svg>
          {text}
        </span>
      ))}
    </div>
  );
}

function DesignTiles() {
  const cells = ["Logos", null, "Branding", null, "Graphics", null, "Motion", null, "UI/UX", null, "3D", null];
  return (
    <div aria-hidden className="grid h-full grid-cols-3 gap-2 p-5">
      {cells.map((label, i) => (
        <div
          key={i}
          className={cn(
            "flex items-start rounded-xl border px-3 py-2 font-serif text-base",
            label ? "border-blue-200 bg-blue-100 text-neutral-800" : "border-neutral-100 bg-neutral-100/70",
          )}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

function StandOutBars() {
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-0 flex h-full items-end justify-center gap-1.5 px-14">
      <div className="h-[34%] w-1/3 rounded-t-2xl bg-gradient-to-t from-white to-blue-100" />
      <div className="relative h-[78%] w-1/3 rounded-t-2xl bg-gradient-to-t from-blue-100 to-blue-200">
        <svg viewBox="0 0 28 22" className="absolute -top-7 left-1/2 size-7 -translate-x-1/2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M3 18h22M4 17 2 6l6 5 6-8 6 8 6-5-2 11" />
        </svg>
      </div>
      <div className="h-[44%] w-1/3 rounded-t-2xl bg-gradient-to-t from-white to-blue-100" />
    </div>
  );
}

function ToolChips() {
  const rows = [
    ["Framer", "Webflow", "React", "Next.js", "WordPress"],
    ["Shopify", "Elementor", "Figma", "GSAP", "Vue"],
    ["Next.js", "WordPress", "Framer", "Svelte", "Tailwind"],
  ];
  const offsets = ["-ml-3", "-ml-16", "ml-1"];
  return (
    <div aria-hidden className="flex h-full flex-col justify-center gap-3.5 overflow-hidden">
      {rows.map((row, r) => (
        <div key={r} className={cn("flex w-max gap-2.5", offsets[r])}>
          {row.map((tool, i) => (
            <span
              key={`${tool}-${i}`}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm text-neutral-800",
                (i + r) % 2 === 0 ? "border-blue-200 bg-blue-100" : "border-neutral-200 bg-neutral-50",
              )}
            >
              {tool}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function WhyUs() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-28">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-10 sm:gap-14">
        <SectionHeading title={whyUs.title} subtitle={whyUs.subtitle} />
        {/*
          Phones: one swipe row of all five cards. From md it is a six-column grid that reproduces the old two rows:
          the first two cards share row one (3 + 3), then two across at md with the last card spanning the row,
          or three across (2 + 2 + 2) from lg.
        */}
        <SnapRow label="Why work with us, swipe to see more reasons" className="md:grid md:grid-cols-6 md:gap-7">
          <BentoCard
            title={whyUs.cards.conversion.title}
            text={whyUs.cards.conversion.text}
            className="md:col-span-3"
            visualClassName="h-[300px] sm:h-[270px] md:h-[300px] lg:h-[270px]"
          >
            <PainPoints />
          </BentoCard>
          <BentoCard title={whyUs.cards.integrations.title} text={whyUs.cards.integrations.text} className="md:col-span-3">
            <Image
              src="/images/why/integrations.png"
              alt=""
              width={634}
              height={300}
              className="h-full w-full object-cover"
            />
          </BentoCard>
          <BentoCard title={whyUs.cards.team.title} text={whyUs.cards.team.text} className="md:col-span-3 lg:col-span-2">
            <DesignTiles />
          </BentoCard>
          <BentoCard title={whyUs.cards.standOut.title} text={whyUs.cards.standOut.text} className="md:col-span-3 lg:col-span-2">
            <StandOutBars />
          </BentoCard>
          <BentoCard title={whyUs.cards.tools.title} text={whyUs.cards.tools.text} className="md:col-span-6 lg:col-span-2">
            <ToolChips />
          </BentoCard>
        </SnapRow>
      </div>
    </section>
  );
}
