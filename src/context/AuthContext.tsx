"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { UserData } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signOut: async () => {},
  refreshUserData: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const router = useRouter();

  const fetchUserData = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Error fetching user data:", error);
      return null;
    }

    const userData: UserData = {
      id: user.id,
      email: user.email!,
      created_at: user.created_at,
      updated_at: user.updated_at,
      // Add any additional user metadata you need
      ...user.user_metadata,
    };

    return userData;
  };

  const refreshUserData = async () => {
    const data = await fetchUserData();
    if (data) {
      setUser(data as unknown as User);
      setUserData(data);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser(user);
        const data = await fetchUserData();
        setUserData(data);
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);

      if (session?.user) {
        setUser(session.user);
        const data = await fetchUserData();
        setUserData(data);
      } else {
        setUser(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserData(null);
    router.push("/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, signOut, refreshUserData }}
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
