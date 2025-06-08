import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const serverCronSecret = process.env.CRON_SECRET;
    const authorizationHeader = request.headers.get("Authorization");

    let isAuthorizedByCron = false;
    if (serverCronSecret && authorizationHeader) {
      const token = authorizationHeader.replace("Bearer ", "");
      if (token === serverCronSecret) {
        isAuthorizedByCron = true;
        console.log("Authorized by Vercel Cron Job secret.");
      }
    }

    const supabase = await createClient();

    if (!isAuthorizedByCron) {
      // Not authorized by cron secret, check for user authentication
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
    // If isAuthorizedByCron is true, we proceed directly to the job logic.
    // The supabase client is already initialized.

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
