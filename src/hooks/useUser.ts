import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "./useQueryKeys";
import { supabase } from "@/lib/supabase/client";
import { handleError } from "@/utils/error-handling";

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
