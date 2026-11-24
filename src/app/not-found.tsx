import type { Metadata } from "next";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
};

/** Shown for any address that does not exist, including draft or unpublished case studies and posts. */
export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-24 text-center sm:px-6">
      <p className="font-sans text-sm font-medium uppercase tracking-[0.2em] text-neutral-600">Error 404</p>
      <h1 className="font-serif text-[44px] leading-[1.05] tracking-[-0.02em] text-neutral-950 text-balance sm:text-6xl">
        This page could not be found
      </h1>
      <p className="max-w-[520px] text-base leading-[1.75] text-neutral-600 text-pretty sm:text-lg">
        The link may be old, or the page may have moved. Head back to the homepage or browse our work.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button variant="primary" href="/">
          Back to home
        </Button>
        <Button variant="outline" href="/works">
          See our works
        </Button>
      </div>
    </section>
  );
}
