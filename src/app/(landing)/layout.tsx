import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import Link from "next/link";
import { hasEnvVars } from "@/lib/supabase/check-env-vars";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>{process.env.NEXT_PUBLIC_APP_NAME || ""}</Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />

              {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
            </div>
          </div>
        </nav>
        <div className="flex flex-col gap-20 max-w-5xl p-5">{children}</div>

        {/* <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
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
        </footer> */}
      </div>
    </main>
  );
}
