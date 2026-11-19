import type { Metadata } from "next";
import { BlogList } from "@/components/blogs/BlogList";
import { SectionHeading } from "@/components/ui";
import { getPublishedPosts } from "@/db/queries";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Articles from Sach Studio on design, development, marketing and building high-performing digital products.",
};

export default async function BlogsPage() {
  const posts = await getPublishedPosts();
  return (
    <section className="px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-16">
        <SectionHeading as="h1" size="hero" title="Blogs" />
        <BlogList
          posts={posts.map((p) => ({
            slug: p.slug,
            title: p.title,
            coverImageUrl: p.coverImageUrl,
            displayDate: p.displayDate,
          }))}
        />
      </div>
    </section>
  );
}
