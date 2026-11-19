import Image from "next/image";
import { SectionHeading } from "@/components/ui";
import { cn } from "@/lib/cn";
import { home } from "@/content/home";

const { whyUs } = home;

function BentoCard({
  title,
  text,
  children,
  className,
}: {
  title: string;
  text: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={cn("flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-card", className)}>
      <div className="relative h-[270px] overflow-hidden">{children}</div>
      <div className="flex flex-col gap-3 px-8 pb-8 pt-2">
        <h3 className="font-serif text-[30px] leading-tight text-neutral-950">{title}</h3>
        <p className="text-[17px] leading-relaxed text-neutral-600">{text}</p>
      </div>
    </article>
  );
}

const pillPlacement = [
  "left-3 top-5 -rotate-[4deg]",
  "right-3 top-2 -rotate-[8deg]",
  "left-[22%] top-[92px] -rotate-[8deg]",
  "right-[14%] top-[104px] rotate-[6deg]",
  "left-5 top-[168px] -rotate-[8deg]",
  "right-3 top-[184px] -rotate-[8deg]",
];

function PainPoints() {
  return (
    <div aria-hidden className="absolute inset-0">
      {whyUs.painPoints.map((text, i) => (
        <span
          key={text}
          className={cn(
            "absolute inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-normal text-neutral-800",
            pillPlacement[i],
            i % 3 === 0 ? "border-blue-200 bg-blue-100" : "border-neutral-200 bg-neutral-50",
          )}
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
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
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-14">
        <SectionHeading title={whyUs.title} subtitle={whyUs.subtitle} />
        <div className="flex flex-col gap-7">
          <div className="grid gap-7 md:grid-cols-2">
            <BentoCard title={whyUs.cards.conversion.title} text={whyUs.cards.conversion.text}>
              <PainPoints />
            </BentoCard>
            <BentoCard title={whyUs.cards.integrations.title} text={whyUs.cards.integrations.text}>
              <Image
                src="/images/why/integrations.png"
                alt=""
                width={634}
                height={300}
                className="h-full w-full object-cover"
              />
            </BentoCard>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            <BentoCard title={whyUs.cards.team.title} text={whyUs.cards.team.text}>
              <DesignTiles />
            </BentoCard>
            <BentoCard title={whyUs.cards.standOut.title} text={whyUs.cards.standOut.text}>
              <StandOutBars />
            </BentoCard>
            <BentoCard title={whyUs.cards.tools.title} text={whyUs.cards.tools.text}>
              <ToolChips />
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}
