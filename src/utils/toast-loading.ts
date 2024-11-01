import { toast } from "@/components/hooks/use-toast";

/**
 * Displays a loading toast with the given message that won't auto-dismiss.
 *
 * @param message - The message to display in the loading toast.
 * @returns A toast instance that can be manually dismissed.
 *
 * @example
 * // Usage in a mutation
 * const mutation = useMutation({
 *   mutationFn: async (data) => {
 *     const loadingToast = showLoadingToast("Creating post...");
 *     try {
 *       const result = await createPost(data);
 *       loadingToast.dismiss();
 *       showSuccess.created('Post');
 *       return result;
 *     } catch (error) {
 *       loadingToast.dismiss();
 *       throw error;
 *     }
 *   },
 *   onError: handleError
 * });
 */
export function showLoadingToast(message: string) {
  return toast({
    title: "Loading",
    description: message,
    duration: Infinity, // Won't auto-dismiss
  });
}
