"use client";

import { InvoiceData } from "@/types/invoice";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadFile() {
  const [result, setResult] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to process invoice");
        }

        const data = (await response.json()) as InvoiceData;
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <main className="">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the invoice here...</p>
        ) : (
          <p>Drag & drop an invoice, or click to select one</p>
        )}
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <p>Processing invoice...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Extracted Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {(
              Object.entries(result) as [
                keyof InvoiceData,
                InvoiceData[keyof InvoiceData],
              ][]
            ).map(([key, value]) => (
              <div key={key} className="border rounded p-4">
                <p className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="mt-1">
                  {value instanceof Date
                    ? value.toLocaleDateString()
                    : value?.toString() || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
