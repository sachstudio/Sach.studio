import Markdown from "react-markdown";

/** Renders a post's Markdown. Raw HTML in the text is never rendered (react-markdown escapes it). */
export function PostBody({ markdown }: { markdown: string }) {
  return (
    <div className="flex flex-col gap-5 text-[17px] leading-[1.85] text-neutral-700">
      <Markdown
        components={{
          h1: ({ children }) => <h2 className="pt-6 font-serif text-4xl leading-tight text-neutral-950">{children}</h2>,
          h2: ({ children }) => <h2 className="pt-6 font-serif text-4xl leading-tight text-neutral-950">{children}</h2>,
          h3: ({ children }) => <h3 className="pt-4 font-serif text-3xl leading-tight text-neutral-950">{children}</h3>,
          ul: ({ children }) => <ul className="flex list-disc flex-col gap-2 pl-6 marker:text-blue-400">{children}</ul>,
          ol: ({ children }) => <ol className="flex list-decimal flex-col gap-2 pl-6 marker:text-blue-400">{children}</ol>,
          a: ({ href, children }) => {
            const external = /^https?:\/\//.test(href ?? "");
            return (
              <a
                href={href}
                className="text-blue-500 underline underline-offset-4 hover:text-blue-700"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {children}
              </a>
            );
          },
          // eslint-disable-next-line @next/next/no-img-element
          img: ({ src, alt }) => <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" className="w-full rounded-2xl" />,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-blue-300 pl-5 font-serif text-2xl text-neutral-800">{children}</blockquote>
          ),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
