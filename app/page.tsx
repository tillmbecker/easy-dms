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
    <>
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>{process.env.NEXT_PUBLIC_APP_NAME || ""}</Link>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
          </div>
        </nav>
        <div className="flex flex-col gap-20 max-w-5xl p-5">
          <main className="flex-1 flex flex-col gap-6 px-4">
            <Hero />

            <h2 className="font-medium text-xl mb-4">Next steps</h2>
            {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </>
  );
}
