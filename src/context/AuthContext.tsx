"use client";

import { createContext, useContext } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/useQueryKeys";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUserData: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const userQuery = useUser();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const router = useRouter();

  const refreshUserData = async () => {
    userQuery.refetch();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // setUser(null);
    // queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    queryClient.removeQueries({ queryKey: queryKeys.user.profile });
    router.push("/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{
        user: userQuery.data ?? null,
        loading: userQuery.isLoading,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
