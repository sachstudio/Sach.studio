"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui";

export type PostCardData = {
  slug: string;
  title: string;
  coverImageUrl: string;
  displayDate: string | null;
};

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="flex flex-col gap-5 rounded-3xl border border-neutral-200 bg-white p-2.5 shadow-card">
      <Link href={`/blogs/${post.slug}`} tabIndex={-1} aria-hidden className="block overflow-hidden rounded-2xl">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt=""
            width={606}
            height={324}
            sizes="(min-width: 768px) 606px, 100vw"
            className="aspect-[606/324] w-full object-cover"
          />
        ) : (
          <div className="aspect-[606/324] w-full bg-neutral-100" />
        )}
      </Link>
      <div className="flex flex-col gap-3 px-3 pb-4">
        {post.displayDate && <p className="text-xs text-neutral-500">{post.displayDate}</p>}
        <h3 className="font-serif text-[26px] leading-tight text-neutral-950">{post.title}</h3>
        <div>
          <Link
            href={`/blogs/${post.slug}`}
            aria-label={`Read more: ${post.title}`}
            className="inline-block border-b-2 border-blue-500 pb-0.5 text-xs font-semibold uppercase tracking-[0.01em] text-blue-500 hover:border-blue-700 hover:text-blue-700"
          >
            Read more
          </Link>
        </div>
      </div>
    </article>
  );
}

export function BlogList({ posts, pageSize = 4 }: { posts: PostCardData[]; pageSize?: number }) {
  const [visible, setVisible] = useState(pageSize);

  if (posts.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1300px] flex-col items-center gap-2 rounded-3xl border border-dashed border-neutral-300 bg-white/60 px-6 py-16 text-center">
        <p className="font-serif text-3xl text-neutral-900">No posts published yet</p>
        <p className="text-neutral-600">New articles will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="grid w-full max-w-[1300px] gap-8 md:grid-cols-2">
        {posts.slice(0, visible).map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
      {posts.length > visible && (
        <Button variant="outline" onClick={() => setVisible((v) => v + pageSize)} className="h-11 px-6 text-xs">
          Load more
        </Button>
      )}
    </div>
  );
}
