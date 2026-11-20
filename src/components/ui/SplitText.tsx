import { Fragment } from "react";

const MAX_STAGGER_STEPS = 10;

/**
 * Splits text into words that rise in one after another on page load (see `.split-word` in globals.css).
 * The text itself is unchanged, so it reads, copies and indexes exactly as written.
 * `startIndex` lets a second phrase continue the stagger of the first.
 */
export function SplitText({ text, startIndex = 0 }: { text: string; startIndex?: number }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${i}-${word}`}>
          <span
            data-word
            className="split-word"
            style={{ "--i": Math.min(startIndex + i, MAX_STAGGER_STEPS) } as React.CSSProperties}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** How many words a heading has, for delaying the text that follows it. */
export function wordCount(...parts: Array<string | undefined>): number {
  return parts.reduce((n, p) => n + (p ? p.split(/\s+/).filter(Boolean).length : 0), 0);
}
