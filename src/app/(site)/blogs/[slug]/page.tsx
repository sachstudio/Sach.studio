import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blogs/BlogList";
import { PostBody } from "@/components/blogs/PostBody";
import { SectionHeading } from "@/components/ui";
import { getPublishedPost, getPublishedPosts, getRelatedPosts } from "@/db/queries";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) return {};
  const description = post.excerpt || post.body.replace(/[#*_>`\[\]]/g, "").slice(0, 155).trim();
  return {
    title: post.title,
    description,
    openGraph: { title: post.title, description, images: post.coverImageUrl ? [post.coverImageUrl] : undefined },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(slug, 2);

  return (
    <article className="px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-14">
        <header className="flex flex-col gap-6">
          <SectionHeading as="h1" title={post.title} className="mx-auto max-w-[1000px]" />
          {post.displayDate && (
            <p className="text-center text-sm text-neutral-500">Posted on {post.displayDate}</p>
          )}
        </header>

        {post.coverImageUrl && (
          <div className="rounded-3xl border border-neutral-200 bg-white p-2.5 shadow-card">
            <Image
              src={post.coverImageUrl}
              alt=""
              width={1280}
              height={640}
              priority
              sizes="(min-width: 1300px) 1280px, 100vw"
              className="aspect-[2/1] w-full rounded-[20px] object-cover"
            />
          </div>
        )}

        <div className="mx-auto w-full max-w-[800px]">
          <PostBody markdown={post.body} />
        </div>

        {related.length > 0 && (
          <section className="flex flex-col gap-12 pt-10">
            <h2 className="text-center font-serif text-4xl text-neutral-950 sm:text-[44px]">More like this</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {related.map((r) => (
                <PostCard
                  key={r.slug}
                  post={{ slug: r.slug, title: r.title, coverImageUrl: r.coverImageUrl, displayDate: r.displayDate }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
