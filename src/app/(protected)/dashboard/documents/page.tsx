import PdfExplorer from "@/components/files/pdf-explorer";
import PostHogClient from "@/lib/posthog/posthog";

export default async function DocumentsPage() {
  const posthog = PostHogClient();
  await posthog.shutdown();

  return (
    <div className="container  p-4">
      <h1 className="text-2xl font-bold mb-4">PDF File Explorer</h1>
      <PdfExplorer />
    </div>
  );
}
