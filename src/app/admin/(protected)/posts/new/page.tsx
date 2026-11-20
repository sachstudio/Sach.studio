import { connection } from "next/server";
import { PostForm } from "@/components/admin/PostForm";
import { emptyPost } from "@/lib/admin-forms";
import { gateAdmin } from "@/lib/admin-gate";

export default async function NewPostPage() {
  await connection();
  await gateAdmin();
  return <PostForm initial={emptyPost()} />;
}
