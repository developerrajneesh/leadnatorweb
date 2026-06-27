import { notFound } from "next/navigation";
import StudioShell from "@/components/studio/StudioShell";
import PostEditorForm from "@/components/studio/PostEditorForm";
import { getPostById } from "@/lib/blog/store";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);
  return { title: post ? `Edit: ${post.title}` : "Edit post", robots: { index: false } };
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <StudioShell title="Edit post" subtitle={post.title}>
      <PostEditorForm mode="edit" post={post} />
    </StudioShell>
  );
}
