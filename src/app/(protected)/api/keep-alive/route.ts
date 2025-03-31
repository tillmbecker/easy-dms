import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Insert a dummy item
    const { data: insertData, error: insertError } = await supabase
      .from("keep_alive")
      .insert({ content: 1 })
      .select();

    if (insertError) throw insertError;

    console.log("Item inserted:", insertData);

    // Delete the dummy item after 2 seconds
    setTimeout(async () => {
      const { data: deleteData, error: deleteError } = await supabase
        .from("keep_alive")
        .delete()
        .eq("content", "1")
        .select();

      if (deleteError) throw deleteError;
      console.log("Item deleted:", deleteData);
    }, 5000);

    return NextResponse.json({ message: "Job completed successfully" });
  } catch (error) {
    console.error("Error running job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
