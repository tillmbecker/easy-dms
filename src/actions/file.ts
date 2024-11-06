"use server";

import { createClient } from "@/lib/supabase/server";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
};

export async function deleteFile(fileName: string): Promise<ApiResponse<any>> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized: User is not logged in",
        status: 401,
      };
    }

    const { data, error } = await supabase.storage
      .from("files")
      .remove([`${user.id}/${fileName}`]);

    if (error) {
      return {
        success: false,
        error: error.message,
        status: 400,
      };
    }

    return {
      success: true,
      data,
      status: 200,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
      status: 500,
    };
  }
}

export async function renameFile(
  fileName: string,
  newFileName: string
): Promise<ApiResponse<any>> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized: User is not logged in",
        status: 401,
      };
    }

    const { data, error } = await supabase.storage
      .from("files")
      .move(`${user.id}/${fileName}`, `${user.id}/${newFileName}`);

    if (error) {
      return {
        success: false,
        error: error.message,
        status: 400,
      };
    }

    return {
      success: true,
      data,
      status: 200,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
      status: 500,
    };
  }
}
