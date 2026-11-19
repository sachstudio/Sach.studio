import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PostForm } from "@/components/admin/PostForm";
import { getRepo } from "@/db";
import { isUuid, postToInput } from "@/lib/admin-forms";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const post = await (await getRepo()).adminGetPost(id);
  if (!post) notFound();
  return <PostForm key={`${id}-${post.updatedAt.getTime()}`} id={id} initial={postToInput(post)} />;
}
