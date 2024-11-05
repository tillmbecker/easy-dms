import { handleError } from "@/utils/error-handling";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./useQueryKeys";

export function useFiles() {
  return useQuery({
    queryKey: queryKeys.files.all,
    queryFn: async () => {
      try {
        const response = await fetch("/api/files");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      } catch (error) {
        throw handleError(error);
      }
    },
  });
}

export function useFileUrl(fileId: string) {
  return useQuery({
    queryKey: [queryKeys.files.id(fileId)],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/files/${fileId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      } catch (error) {
        throw handleError(error);
      }
    },
  });
}
