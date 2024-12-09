import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./useQueryKeys";
import { handleError } from "@/utils/error-handling";
import { createProject, deleteProject } from "@/actions/projects";
import { CreateProjectInput } from "@/types/project";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const formData = new FormData();

      // Add all non-null values to FormData
      Object.entries(input).forEach(([key, value]) => {
        if (value != null) {
          formData.append(key, value);
        }
      });

      const { data, error } = await createProject(formData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all,
      });
    },
    onError: handleError,
  });
}
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectName: string) => {
      const { data, error } = await deleteProject(projectName);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all,
      });
    },
    onError: handleError,
  });
}
