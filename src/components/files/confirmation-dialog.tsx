"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  // Dialog state
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Content configuration
  title: string;
  description?: string;

  // Custom content options
  children?: React.ReactNode;
  renderContent?: () => React.ReactNode;

  // Action configuration
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";

  // Custom action buttons
  renderActions?: (props: {
    confirmText: string;
    cancelText: string;
    variant: string;
    isLoading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }) => React.ReactNode;

  // Callback functions
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;

  // Optional loading state
  isLoading?: boolean;
}

export default function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  renderContent,

  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  renderActions,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmationDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    // onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const defaultActions = (
    <DialogFooter>
      <DialogClose asChild>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
      </DialogClose>

      <Button
        type="button"
        variant={variant as any}
        onClick={handleConfirm}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : confirmText}
      </Button>
    </DialogFooter>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Custom content area */}
        {renderContent?.()}
        {children}

        {/* Action buttons */}
        {renderActions
          ? renderActions({
              confirmText,
              cancelText,
              variant,
              isLoading,
              onConfirm: handleConfirm,
              onCancel: handleCancel,
            })
          : defaultActions}
      </DialogContent>
    </Dialog>
  );
}
