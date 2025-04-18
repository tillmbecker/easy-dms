import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { TanstackProvider } from "@/providers/TanstackProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

import { PostHogProvider } from "@/providers/post-hog-provider";
import CookieBanner from "@/components/cookies/cookie-banner";
import dynamic from "next/dynamic";

const PostHogPageView = dynamic(
  () => import("@/lib/posthog/post-hog-page-view"),
  {
    ssr: false,
  }
);

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Freelance Docs",
  description: "Your one stop solution for all your freelance needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <PostHogProvider>
        <body className="bg-background text-foreground">
          <TanstackProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <PostHogPageView />
              {children}
              <CookieBanner />
              <Toaster />
              <SonnerToaster closeButton richColors />
            </ThemeProvider>
          </TanstackProvider>
        </body>
      </PostHogProvider>
    </html>
  );
}
