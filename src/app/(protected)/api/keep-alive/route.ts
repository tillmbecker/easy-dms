import { createClient as createUserContextClient } from "@/lib/supabase/server";
import { createClient as createServiceRoleClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const serverCronSecret = process.env.CRON_SECRET;
    const authorizationHeader = request.headers.get("Authorization");
    let supabase; // Declare supabase client variable

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let isAuthorizedByCron = false;
    if (serverCronSecret && authorizationHeader) {
      const token = authorizationHeader.replace("Bearer ", "");
      if (token === serverCronSecret) {
        isAuthorizedByCron = true;
      }
    }

    if (isAuthorizedByCron) {
      console.log(
        "Authorized by Vercel Cron Job secret. Using service role key."
      );
      if (!supabaseUrl || !supabaseServiceKey) {
        console.error(
          "Supabase URL or Service Role Key is not configured for cron job."
        );
        return NextResponse.json(
          { error: "Internal server error - service client misconfigured" },
          { status: 500 }
        );
      }
      supabase = createServiceRoleClient(supabaseUrl, supabaseServiceKey);
    } else {
      console.log("Not authorized by cron. Attempting user authentication.");
      supabase = await createUserContextClient(); // Use the existing client for user auth
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log(
          "Unauthorized: No user session and no (or invalid) cron secret."
        );
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      console.log("Authorized by user session.");
    }

    // Ensure supabase is initialized
    if (!supabase) {
      // This case should ideally not be reached if logic above is correct
      console.error("Error: Supabase client failed to initialize.");
      return NextResponse.json(
        { error: "Internal server error - client initialization failed" },
        { status: 500 }
      );
    }

    // Insert a dummy item
    const { data: insertData, error: insertError } = await supabase
      .from("keep_alive")
      .insert({ content: 1 })
      .select();

    if (insertError) throw insertError;

    console.log("Item inserted:", insertData);

    // Delete the dummy item immediately
    const { data: deleteData, error: deleteError } = await supabase
      .from("keep_alive")
      .delete()
      .eq("content", 1)
      .select();

    if (deleteError) throw deleteError;
    console.log("Item deleted:", deleteData);

    return NextResponse.json({ message: "Job completed successfully" });
  } catch (error) {
    console.error("Error running job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
