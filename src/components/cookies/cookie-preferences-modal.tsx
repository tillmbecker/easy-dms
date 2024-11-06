"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
}

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
  initialPreferences: CookiePreferences;
}

export default function CookiePreferencesModal({
  isOpen,
  onClose,
  onSave,
  initialPreferences,
}: CookiePreferencesModalProps) {
  const [preferences, setPreferences] =
    useState<CookiePreferences>(initialPreferences);

  useEffect(() => {
    setPreferences(initialPreferences);
  }, [initialPreferences]);

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cookie Preferences</DialogTitle>
          <DialogDescription>
            Manage your cookie preferences. We use cookies to enhance your
            browsing experience and analyze our traffic.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Necessary Cookies</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies are essential for the website to function
                  properly. They cannot be disabled.
                </p>
                <div className="flex items-center space-x-2">
                  <Switch id="necessary-cookies" checked={true} disabled />
                  <Label htmlFor="necessary-cookies">Always enabled</Label>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies help us improve our website by collecting and
                  reporting information on how you use it.
                </p>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="analytics-cookies"
                    checked={preferences.analytics}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, analytics: checked })
                    }
                  />
                  <Label htmlFor="analytics-cookies">
                    Enable analytics cookies
                  </Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Data Processing</h3>
              <p className="text-sm text-muted-foreground">
                We process your data to improve our website's performance and
                your browsing experience. Analytics data is processed by
                PostHog.
              </p>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save preferences</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
