import UploadFile from "@/components/upload/upload-file";
import PostHogClient from "@/lib/posthog/posthog";

export default async function UploadDocumentPage() {
  const posthog = PostHogClient();
  await posthog.shutdown();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Invoice Processor</h1>

      <UploadFile />
    </div>
  );
}
