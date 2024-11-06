import PdfExplorer from "@/components/files/pdf-explorer";
import PostHogClient from "@/lib/posthog/posthog";

export default async function DocumentsPage() {
  const posthog = PostHogClient();
  await posthog.shutdown();

  return (
    <div>
      <PdfExplorer />
    </div>
  );
}
