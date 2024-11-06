import { createClient } from "@/lib/supabase/server";
/**
 * Handles the GET request to generate a signed URL for a file.
 *
 * @param {Request} request - The incoming request object.
 * @param {Object} context - The context object containing route parameters.
 * @param {Object} context.params - The route parameters.
 * @param {string} context.params.fileName - The ID of the file for which to generate the signed URL.
 * @returns {Promise<Response>} - A promise that resolves to a Response object containing the signed URL or an error message.
 *
 * @throws {Error} - Throws an error if there is an issue creating the signed URL or processing the request.
 */
export async function GET(
  request: Request,
  { params }: { params: { fileName: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase.storage
      .from("files")
      .createSignedUrl(`${user?.id}/${params.fileName}`, 3600);

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
