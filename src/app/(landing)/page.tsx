import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import Hero from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";

export default async function Index() {
  return (
    <div className="flex flex-col gap-20 max-w-5xl p-5">
      <main className="flex-1 flex flex-col gap-6 px-4">
        <Hero />
      </main>
    </div>
  );
}
