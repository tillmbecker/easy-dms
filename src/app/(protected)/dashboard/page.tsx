import PostHogClient from "@/lib/posthog/posthog";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const posthog = PostHogClient();
  const flags = await posthog.getAllFlags(
    user?.id ?? "" // replace with a user's distinct ID
  );
  await posthog.shutdown();

  return (
    <>
      {flags["main-cta"] && (
        <Link href="http://posthog.com/">Go to PostHog</Link>
      )}
      <div className="flex flex-1 flex-col gap-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
}
