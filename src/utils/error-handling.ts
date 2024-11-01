// utils/error-handling.ts

import { toast } from "@/components/hooks/use-toast";

interface SupabaseError {
  code: string;
  message?: string;
}

export function handleError(error: unknown) {
  // Handle Supabase errors
  if (typeof error === "object" && error !== null && "code" in error) {
    const supaError = error as SupabaseError;

    switch (supaError.code) {
      case "23505":
        toast({
          variant: "destructive",
          title: "Error",
          description: "This record already exists",
        });
        break;
      case "23503":
        toast({
          variant: "destructive",
          title: "Error",
          description: "Referenced record not found",
        });
        break;
      case "PGRST301":
        toast({
          variant: "destructive",
          title: "Error",
          description: "Record not found",
        });
        break;
      case "AUTH_INVALID_CREDENTIALS":
        toast({
          variant: "destructive",
          title: "Invalid credentials",
          description: "Please check your email and password",
        });
        break;
      default:
        toast({
          variant: "destructive",
          title: "Error",
          description: supaError.message || "An error occurred",
        });
    }
    return;
  }

  // Handle standard errors
  if (error instanceof Error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message,
    });
    return;
  }

  // Handle unknown errors
  toast({
    variant: "destructive",
    title: "Error",
    description: "An unexpected error occurred",
  });
}

// Common success messages
export const showSuccess = {
  created: (item: string) =>
    toast({
      title: "Success",
      description: `${item} created successfully`,
    }),
  updated: (item: string) =>
    toast({
      title: "Success",
      description: `${item} updated successfully`,
    }),
  deleted: (item: string) =>
    toast({
      title: "Success",
      description: `${item} deleted successfully`,
    }),
  saved: () =>
    toast({
      title: "Success",
      description: "Changes saved successfully",
    }),
  login: () =>
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in",
    }),
  logout: () =>
    toast({
      title: "Goodbye!",
      description: "You have been logged out",
    }),
};
