import { createClient } from "@/lib/supabase/server";
import { InvoiceData } from "@/types/invoice";
import { createAnthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { generateObject, generateText } from "ai";

const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT || "";
const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY || "";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase.storage
      .from("files")
      .upload(`${user?.id}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return new Response(JSON.stringify({ error: "Failed to upload file" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const arrayBuffer = await file.arrayBuffer();
    const binaryFile = new Uint8Array(arrayBuffer);
    const result = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      messages: [
        {
          role: "user",
          content: JSON.stringify([
            {
              type: "text",
              text: "What type of document is this file? Please classify it as CV, invoice or receipt.",
            },
            {
              type: "file",
              data: binaryFile,
              mimeType: file.type,
            },
          ]),
        },
      ],
    });
    console.log("file", file);

    console.log("Object:", result);

    // const buffer = Buffer.from(await file.arrayBuffer());

    // const client = new DocumentAnalysisClient(
    //   endpoint,
    //   new AzureKeyCredential(key)
    // );

    // const poller = await client.beginAnalyzeDocument(
    //   "prebuilt-invoice",
    //   buffer
    // );
    // const result = await poller.pollUntilDone();

    // // Log the entire result for debugging
    // console.log("Full API Response:", JSON.stringify(result, null, 2));

    // if (!result?.documents?.[0]) {
    //   throw new Error("No results found");
    // }

    // const invoice = result.documents[0];
    // const fields = invoice.fields;

    // // Log the fields object
    // console.log("Fields object:", fields);

    // console.log("items", fields.items);

    // const extractedData: InvoiceData = {
    //   invoiceNumber:
    //     fields.InvoiceNumber?.content || fields.invoiceNumber?.content,
    //   invoiceDate: fields.InvoiceDate?.content
    //     ? new Date(fields.InvoiceDate.content)
    //     : fields.invoiceDate?.content
    //       ? new Date(fields.invoiceDate.content)
    //       : undefined,
    //   dueDate: fields.DueDate?.content
    //     ? new Date(fields.DueDate.content)
    //     : fields.dueDate?.content
    //       ? new Date(fields.dueDate.content)
    //       : undefined,
    //   vendorName: fields.VendorName?.content || fields.vendorName?.content,
    //   vendorAddress:
    //     fields.VendorAddress?.content || fields.vendorAddress?.content,
    //   customerName:
    //     fields.CustomerName?.content || fields.customerName?.content,
    //   customerAddress:
    //     fields.CustomerAddress?.content || fields.customerAddress?.content,
    //   totalAmount: parseFloat(
    //     fields.TotalAmount?.content || fields.totalAmount?.content || "0"
    //   ),
    // };

    // // Log the extracted data
    // console.log("Extracted Data:", extractedData);

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
