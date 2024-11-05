import { createClient } from "@/lib/supabase/server";
export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase.storage
      .from("files")
      .createSignedUrl(`${user?.id}/${params.fileId}`, 3600);

    console.log(data);
    if (error) {
      console.error("Error creating signed file url:", error);
      return new Response(
        JSON.stringify({ error: "Error creating file url" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing invoice:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process invoice" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
