import { createClient } from "@/lib/supabase/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { InvoiceData } from "@/types/invoice";
import { UploadError } from "@/components/upload/upload-file";

import { StorageError } from "@supabase/storage-js";

const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT || "";
const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY || "";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Types
type DocumentType = "CV" | "INVOICE" | "RECEIPT" | "UNKNOWN";

interface ProcessedDocument {
  type: DocumentType;
  content: string;
  filename: string;
  path?: string;
}

// Create OpenAI client
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    // Check user authentication
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate file type
    if (!file.type.includes("pdf")) {
      return new Response(
        JSON.stringify({
          error: {
            error: "Only PDF files are supported",
            statusCode: "500",
            message: "",
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Convert File to Blob for LangChain
    const blob = new Blob([file], { type: file.type });

    // Extract text using LangChain's PDFLoader
    const loader = new PDFLoader(blob);
    const docs = await loader.load();
    const fileContent = docs.map((doc) => doc.pageContent).join("\n");

    // Check if document is empty
    if (fileContent.length === 0) {
      const error: UploadError = {
        error: "NoContent",
        statusCode: "400",
        message: "",
      };
      return new Response(JSON.stringify({ error: error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from("files")
      .upload(`${user?.id}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: Number((error as unknown as UploadError).statusCode),
        headers: { "Content-Type": "application/json" },
      });
    }

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
    //   invoiceNumber: fields.InvoiceNumber?.content,
    //   invoiceDate: fields.InvoiceDate?.content
    //     ? new Date(fields.InvoiceDate.content)
    //     : undefined,
    //   dueDate: fields.DueDate?.content
    //     ? new Date(fields.DueDate.content)
    //     : undefined,
    //   vendorName: fields.VendorName?.content,
    //   vendorAddress: fields.VendorAddress?.content,
    //   customerName: fields.CustomerName?.content,
    //   customerAddress: fields.CustomerAddress?.content,
    //   totalAmount: parseFloat(fields.TotalAmount?.content || "0"),
    // };

    // // Log the extracted data
    // console.log("Extracted Data:", extractedData);

    // return new Response(JSON.stringify({ extractedData }), {
    //   headers: { "Content-Type": "application/json" },
    // });
    console.log(error, data);
    return new Response(JSON.stringify("Files uploaded"), {
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
