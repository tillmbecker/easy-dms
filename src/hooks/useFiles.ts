import { handleError, showSuccess } from "@/utils/error-handling";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./useQueryKeys";
import { deleteFile } from "@/actions/file";
import { FileObject } from "@/types/file";

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

export function useFileUrl(fileName: string) {
  return useQuery({
    queryKey: [queryKeys.files.name(fileName)],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/files/${fileName}`);
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

type DeleteFileResponse = ApiResponse<FileObject[] | null>;

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileName: string): Promise<DeleteFileResponse> => {
      const response = await deleteFile(fileName);

      const previousData = queryClient.getQueryData<FileObject[]>([
        queryKeys.files.all,
      ]);
      queryClient.setQueryData<FileObject[] | null>(
        queryKeys.files.all,
        (old) => old?.filter((file) => file.name !== fileName)
      );
      // Throw error to trigger onError if not successful
      if (!response.success) {
        throw new Error(response.error || "Failed to delete file");
      }

      return response;
    },
    onError: (error: Error) => {
      handleError(error);
    },
    onSettled: (response) => {
      // Invalidate queries regardless of success/failure
      queryClient.invalidateQueries({
        queryKey: queryKeys.files.all,
      });
    },
    onSuccess: (response) => {
      if (response?.data?.[0].name) {
        showSuccess.deleted("File");
      }
    },
  });
}
