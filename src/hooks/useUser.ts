import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "./useQueryKeys";
import { supabase } from "@/lib/supabase/client";
import { handleError, showSuccess } from "@/utils/error-handling";
import { signOutAction } from "@/app/actions";
import { useRouter } from "next/navigation";

export function useUser() {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
      } catch (error) {
        throw handleError(error);
      }
    },
  });
}

export function useSignOutUser() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const { error } = await signOutAction();
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess.logout();
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile }); // invalidate user query to remove data from cache
      router.push("/sign-in");
    },
    onError: handleError,
  });
}
