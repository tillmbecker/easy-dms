import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserData } from "@/types/user";

export async function getUserFromServer() {
  const supabase = createServerComponentClient({ cookies });

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return null;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return null;
    }

    const userData: UserData = {
      id: user.id,
      email: user.email!,
      created_at: user.created_at,
      updated_at: user.updated_at,
      ...user.user_metadata,
    };

    return {
      user: session.user,
      userData,
    };
  } catch (error) {
    console.error("Error getting user from server:", error);
    return null;
  }
}
