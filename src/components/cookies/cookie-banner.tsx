"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CookiePreferencesModal from "./cookie-preferences-modal";
import { usePostHog } from "posthog-js/react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
}

export function analyticsConsentGiven() {
  const storedPreferences = localStorage.getItem("cookiePreferences");
  if (storedPreferences) {
    const preferences = JSON.parse(storedPreferences);
    return preferences.analytics;
  }
  return false;
}

export default function CookieBanner() {
  const posthog = usePostHog();

  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    const storedPreferences = localStorage.getItem("cookiePreferences");
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences));
    }
  }, []);
  useEffect(() => {
    posthog.set_config({
      persistence: analyticsConsentGiven() ? "localStorage+cookie" : "memory",
    });
  }, [preferences]);

  const acceptAll = () => {
    const allAccepted = { necessary: true, analytics: true };
    localStorage.setItem("cookieConsent", "all");
    localStorage.setItem("cookiePreferences", JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setIsVisible(false);
  };
  const rejectAll = () => {
    const allRejected = { necessary: true, analytics: false };
    localStorage.setItem("cookieConsent", "custom");
    localStorage.setItem("cookiePreferences", JSON.stringify(allRejected));
    setPreferences(allRejected);
    setIsVisible(false);
  };

  const openPreferences = () => {
    setIsModalOpen(true);
  };

  const closePreferences = () => {
    setIsModalOpen(false);
  };

  const savePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem("cookieConsent", "custom");
    localStorage.setItem("cookiePreferences", JSON.stringify(newPreferences));
    setIsVisible(false);
  };

  const dismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 max-w-sm bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg p-4 animate-fade-in">
        <div className="flex items-start gap-3">
          <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-grow">
            <h2 className="text-sm font-medium mb-2">Cookie preferences</h2>
            <p className="text-xs text-muted-foreground mb-3">
              Hi there! We use cookies to make our site work and to understand
              how you use it.
            </p>
            <div className="flex gap-2">
              <Button onClick={acceptAll} size="sm" className="text-xs">
                Accept all
              </Button>
              <Button onClick={rejectAll} size="sm" className="text-xs">
                Reject all
              </Button>
              <Button
                onClick={openPreferences}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Preferences
              </Button>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss cookie banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <CookiePreferencesModal
        isOpen={isModalOpen}
        onClose={closePreferences}
        onSave={savePreferences}
      />
    </>
  );
}
