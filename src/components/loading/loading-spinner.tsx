import { cn } from "@/utils/shadcn";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
}
export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return <Loader2 className={cn("animate-spin h-4 w-4", className)} />;
}
