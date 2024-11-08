import UploadFile from "@/components/upload/upload-file";
import PostHogClient from "@/lib/posthog/posthog";

export default async function UploadDocumentPage() {
  const posthog = PostHogClient();
  await posthog.shutdown();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload document</h1>

      <UploadFile />
    </div>
  );
}
