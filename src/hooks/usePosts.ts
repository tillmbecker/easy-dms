// hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { handleError, showSuccess } from "@/utils/error-handling";
import { supabase } from "@/lib/supabase/client";
import { queryKeys } from "./useQueryKeys";

interface Post {
  id: string;
  title: string;
  content: string;
}

export function usePosts() {
  return useQuery({
    queryKey: queryKeys.posts.all,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        throw handleError(error);
      }
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: Omit<Post, "id">) => {
      const { data, error } = await supabase
        .from("posts")
        .insert(newPost)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      showSuccess.created("Post");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: handleError,
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Post) => {
      const { error } = await supabase.from("posts").update(data).eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess.updated("Post");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: handleError,
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess.deleted("Post");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: handleError,
  });
}
