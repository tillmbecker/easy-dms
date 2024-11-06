"use client";
import { analyticsConsentGiven } from "@/components/cookies/cookie-banner";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      persistence: analyticsConsentGiven() ? "localStorage+cookie" : "memory",
      person_profiles: "identified_only",
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true, // Enable pageleave capture because capture_pageview disables it
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
