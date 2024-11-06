import { handleError, showSuccess } from "@/utils/error-handling";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./useQueryKeys";
import { deleteFile, renameFile } from "@/actions/file";
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

export function useFileDownloader(fileName: string) {
  const downloadFile = async () => {
    try {
      const response = await fetch(`/api/files/${fileName}/download`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Get content type from response headers
      const contentType =
        response.headers.get("content-type") || "application/octet-stream";

      // Get the blob with proper content type
      const blob = await response.blob();
      const fileBlob = new Blob([blob], { type: contentType });

      // Create URL and link
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.download = fileName;

      // Handle download
      document.body.appendChild(link);
      link.click();

      // Wait a moment before cleanup to ensure download starts
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      throw handleError(error);
    }
  };

  return { downloadFile };
}

type DeleteFileResponse = ApiResponse<FileObject[] | null>;

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileName: string): Promise<DeleteFileResponse> => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });

      const response = await deleteFile(fileName);

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
    onSettled: () => {
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

type RenameFileResponse = ApiResponse<FileObject[] | null>;
export function useRenameFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileName,
      newFileName,
    }: {
      fileName: string;
      newFileName: string;
    }): Promise<RenameFileResponse> => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });

      const response = await renameFile(fileName, newFileName);

      // Throw error to trigger onError if not successful
      if (!response.success) {
        throw new Error(response.error || "Failed to delete file");
      }

      return response;
    },
    onError: (error: Error) => {
      handleError(error);
    },
    onSettled: () => {
      // Invalidate queries regardless of success/failure
      queryClient.invalidateQueries({
        queryKey: queryKeys.files.all,
      });
    },
    onSuccess: () => {
      showSuccess.updated("File");
    },
  });
}
