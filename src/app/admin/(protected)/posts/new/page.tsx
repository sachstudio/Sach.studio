import { PostForm } from "@/components/admin/PostForm";
import { emptyPost } from "@/lib/admin-forms";

export default function NewPostPage() {
  return <PostForm initial={emptyPost()} />;
}
