import { createClient } from "@/lib/supabase/server";
const MIME_TYPES: { [key: string]: string } = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  txt: "text/plain",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // Add more as needed
};

export async function GET(
  request: Request,
  { params }: { params: { fileName: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get file extension
    const fileExtension = params.fileName.split(".").pop()?.toLowerCase() || "";

    // Get corresponding MIME type or fallback to octet-stream
    const contentType = MIME_TYPES[fileExtension] || "application/octet-stream";

    const { data, error } = await supabase.storage
      .from("files")
      .download(`${user?.id}/${params.fileName}`);

    if (error) {
      console.error("Error downloading file:", error);
      return new Response(JSON.stringify({ error: "Error downloading file" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return file data with correct content type
    return new Response(data, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${params.fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
