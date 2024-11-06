"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
}

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
}

export default function CookiePreferencesModal({
  isOpen,
  onClose,
  onSave,
}: CookiePreferencesModalProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
  });

  useEffect(() => {
    const storedPreferences = localStorage.getItem("cookiePreferences");
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    onSave(preferences);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cookie Preferences</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="necessary-cookies">Necessary Cookies</Label>
              <p className="text-sm text-muted-foreground">
                These cookies are essential for the website to function
                properly.
              </p>
            </div>
            <Switch
              id="necessary-cookies"
              checked={preferences.necessary}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, necessary: checked })
              }
              disabled
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics-cookies">Analytics Cookies</Label>
              <p className="text-sm text-muted-foreground">
                These cookies help us improve our website by collecting and
                reporting information on its usage.
              </p>
            </div>
            <Switch
              id="analytics-cookies"
              checked={preferences.analytics}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, analytics: checked })
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save preferences</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
