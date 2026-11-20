import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";
import { SplitText, wordCount } from "./SplitText";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  /** Trailing text rendered in the primary blue after the title. */
  accent?: string;
  as?: "h1" | "h2";
  size?: "hero" | "section";
  className?: string;
};

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  accent,
  as: Tag = "h2",
  size = "section",
  className,
}: SectionHeadingProps) {
  const isPageTitle = Tag === "h1";
  const titleWords = wordCount(title);
  // The subtitle follows the last heading word (60ms per word, capped at 10 steps) plus a short beat.
  const subtitleDelay = Math.min(titleWords + wordCount(accent), 10) * 60 + 150;

  const content = (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <Tag
        className={cn(
          "font-serif font-normal text-neutral-950 text-balance",
          size === "hero"
            ? "text-[44px] leading-[1.05] tracking-[-0.02em] sm:text-6xl md:text-7xl"
            : "text-4xl leading-[1.1] tracking-[-0.015em] sm:text-5xl md:text-[56px]",
        )}
      >
        {isPageTitle ? <SplitText text={title} /> : title}
        {accent && (
          <>
            {" "}
            <span className="text-blue-500">{isPageTitle ? <SplitText text={accent} startIndex={titleWords} /> : accent}</span>
          </>
        )}
      </Tag>
      {subtitle && (
        <p
          style={isPageTitle ? ({ "--motion-delay": `${subtitleDelay}ms` } as React.CSSProperties) : undefined}
          className={cn(
            "max-w-[820px] text-base leading-[1.75] text-neutral-600 text-pretty sm:text-lg",
            isPageTitle && "motion-enter",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );

  // Page titles animate on load; headings further down the page ease in once as they scroll into view.
  return isPageTitle ? content : <Reveal>{content}</Reveal>;
}
