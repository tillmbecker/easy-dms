import { createClient } from "@/lib/supabase/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT || "";
const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY || "";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Types
type DocumentType = "CV" | "INVOICE" | "RECEIPT" | "UNKNOWN";

enum PossibleClassifications {
  CV = "CV",
  INVOICE = "INVOICE",
  RECEIPT = "RECEIPT",
  UNKNOWN = "UNKNOWN",
  ORDER = "ORDER",
}

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
        JSON.stringify({ error: "Only PDF files are supported" }),
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

    // Upload file to Supabase storage
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

    const possibleClassifications = z.nativeEnum(PossibleClassifications);

    // const { object } = await generateObject({
    //   model: openai("gpt-4o"),
    //   schema: z.object({
    //     document: z.object({
    //       classification: possibleClassifications,
    //       summary: z.string().max(80),
    //     }),
    //   }),
    //   prompt:
    //     `You are given a text belonging to a document. Classify this document:` +
    //     fileContent +
    //     `Summarize the document in 80 characters or less.`,
    // });

    // console.log("Object:", object);

    if (fileContent.length === 0) {
      return new Response(
        JSON.stringify({ error: "No content found in document" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const { object: classification } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        document: z.object({
          classification: possibleClassifications,
          summary: z.string().max(80),
          invoice: z
            .object({
              invoiceNumber: z.string(),
              invoiceDate: z.string(),
              dueDate: z.string(),
              vendorName: z.string(),
              vendorAddress: z.string(),
              customerName: z.string(),
              customerAddress: z.string(),
              totalAmount: z.number(),
              items: z.array(
                z.object({
                  name: z.string(),
                  quantity: z.number(),
                  unitPrice: z.number(),
                  total: z.number(),
                })
              ),
            })
            .optional(),
          cv: z
            .object({
              name: z.string(),
              role: z.string(),
              email: z.string(),
              phone: z.string(),
              address: z.string(),
              education: z
                .string()
                .describe("Education history in school and university"),
              experience: z.string().describe("Work experience"),
              skills: z
                .array(
                  z.object({
                    name: z.string().describe("Name of skill"),
                    years: z.number().describe("Years of experience"),
                  })
                )
                .describe("List of skills"),
            })
            .optional(),
        }),
      }),
      prompt:
        `You are given a content belonging to a document. The document is either an invoice or a CV. Return all requested information for the classified document type:` +
        fileContent +
        `You are forbidden to make up new information. Only return the information that is present in the document.`,
    });
    console.log("classification:", classification);

    // const arrayBuffer = await file.arrayBuffer();
    // const binaryFile = new Uint8Array(arrayBuffer);
    // const result = await generateText({
    //   model: anthropic("claude-3-5-sonnet-20241022"),
    //   messages: [
    //     {
    //       role: "user",
    //       content: JSON.stringify([
    //         {
    //           type: "text",
    //           text: "What type of document is this file? Please classify it as CV, invoice or receipt.",
    //         },
    //         {
    //           type: "file",
    //           data: binaryFile,
    //           mimeType: file.type,
    //         },
    //       ]),
    //     },
    //   ],
    // });

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

    return new Response(JSON.stringify({ classification }), {
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
