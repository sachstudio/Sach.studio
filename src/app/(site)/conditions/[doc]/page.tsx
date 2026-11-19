import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalDocs, type LegalBlock, type LegalSlug } from "@/content/legal";

// Cache Components is on, so `dynamicParams` is unavailable; unknown slugs 404 through notFound() below.
export function generateStaticParams() {
  return (Object.keys(legalDocs) as LegalSlug[]).map((doc) => ({ doc }));
}

type Params = { params: Promise<{ doc: string }> };

function getDoc(slug: string) {
  return slug in legalDocs ? legalDocs[slug as LegalSlug] : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const doc = getDoc((await params).doc);
  if (!doc) return {};
  return { title: doc.title, description: doc.description };
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === "p") return <p>{block.text}</p>;
  if (block.type === "h") return <h3 className="pt-2 font-serif text-2xl text-neutral-900">{block.text}</h3>;
  return (
    <ul className="flex list-disc flex-col gap-2 pl-6 marker:text-blue-400">
      {block.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function LegalPage({ params }: Params) {
  const doc = getDoc((await params).doc);
  if (!doc) notFound();

  return (
    <article className="px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-[860px]">
        <header className="flex flex-col gap-5 text-center">
          <h1 className="font-serif text-5xl leading-tight text-neutral-950 sm:text-6xl">{doc.title}</h1>
          <p className="text-lg leading-[1.75] text-neutral-600">{doc.description}</p>
        </header>

        <div className="mt-16 flex flex-col gap-12 rounded-3xl border border-neutral-200 bg-white p-6 shadow-card sm:p-12">
          {doc.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-4 text-[16px] leading-[1.8] text-neutral-600">
              <h2 className="font-serif text-3xl text-neutral-950">{section.heading}</h2>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </section>
          ))}
          <p className="border-t border-neutral-200 pt-6 text-sm text-neutral-500">Last updated: {doc.updated}</p>
        </div>
      </div>
    </article>
  );
}
