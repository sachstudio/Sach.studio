import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = {
  variant: "primary" | "outline" | "link";
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  fullWidth?: boolean;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
};

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold uppercase tracking-[0.01em] text-sm transition-[transform,box-shadow,background-color] duration-200 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary:
    "h-[54px] rounded-xl px-7 text-white bg-gradient-to-b from-blue-500 to-blue-700 shadow-button hover:-translate-y-px hover:shadow-[0_10px_22px_rgb(46_91_255/0.34)] active:translate-y-0",
  outline:
    "h-[54px] rounded-xl px-7 text-blue-500 bg-white border border-neutral-200 hover:border-blue-300 hover:bg-blue-50",
  link: "text-blue-500 border-b-2 border-blue-500 pb-0.5 hover:text-blue-700 hover:border-blue-700",
} as const;

export function Button({
  variant,
  href,
  onClick,
  children,
  fullWidth,
  icon,
  className,
  disabled,
  type = "button",
}: ButtonProps) {
  const classes = cn(base, variants[variant], fullWidth && "w-full", className);
  const content = (
    <>
      {icon}
      {children}
    </>
  );

  if (href) {
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  );
}
