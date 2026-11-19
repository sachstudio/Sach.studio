import { cn } from "@/lib/cn";

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
  return (
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
        {title}
        {accent && (
          <>
            {" "}
            <span className="text-blue-500">{accent}</span>
          </>
        )}
      </Tag>
      {subtitle && (
        <p className="max-w-[820px] text-base leading-[1.75] text-neutral-600 text-pretty sm:text-lg">{subtitle}</p>
      )}
    </div>
  );
}
