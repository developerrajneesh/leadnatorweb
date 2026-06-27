import StudioShell from "@/components/studio/StudioShell";
import PostEditorForm from "@/components/studio/PostEditorForm";

export const metadata = {
  title: "New post — Admin",
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
  return (
    <StudioShell title="New post" subtitle="Draft your vlog — publish when ready">
      <PostEditorForm mode="create" />
    </StudioShell>
  );
}
