"use client";

import { InvoiceData } from "@/types/invoice";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import LoadingSpinner from "../loading/loading-spinner";
import { cn } from "@/utils/shadcn";
import { Button } from "../ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export default function UploadFile() {
  const [result, setResult] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [appearLoader, setAppearLoader] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      setLoading(true);
      setError(null);
      if (rejectedFiles.length > 0) {
        setError("Please upload only PDF or image files (PNG, JPG, JPEG)");
        setLoading(false);
        return;
      }
      try {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        const response = await fetch("/api/upload", {
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
      <div className="border border-border rounded-md w-full p-4 mt-4 flex justify-between items-center ">
        Here you will see your uploaded document
        <div className="flex items-center">
          <div
            className={cn(
              "transition-all duration-300 ease-in-out flex-shrink-0 flex items-center justify-center",
              appearLoader ? "w-8 opacity-100" : "w-0 opacity-0"
            )}
          >
            <LoadingSpinner className="h-4 w-4" />
          </div>
          <div
            className={cn(
              "transition-all duration-300 ease-in-out flex-shrink-0 flex items-center justify-center",
              showSuccess ? "w-8 opacity-100" : "w-0 opacity-0"
            )}
          >
            <CheckCircle className="h-5 w-5 stroke-green-700" />
          </div>
          <div
            className={cn(
              "transition-all duration-300 ease-in-out flex-shrink-0 flex items-center justify-center",
              showError ? "w-8 opacity-100" : "w-0 opacity-0"
            )}
          >
            <XCircle className="h-5 w-5 stroke-red-700" />
          </div>
        </div>
      </div>
      <Button
        onClick={() =>
          setAppearLoader((prev) => {
            setShowSuccess(false);
            setShowError(false);
            return !prev;
          })
        }
      >
        Loading state
      </Button>
      <Button
        onClick={() =>
          setShowSuccess((prev) => {
            setAppearLoader(false);
            setShowError(false);
            return !prev;
          })
        }
      >
        Success state
      </Button>
      <Button
        onClick={() =>
          setShowError((prev) => {
            setAppearLoader(false);
            setShowSuccess(false);
            return !prev;
          })
        }
      >
        Error state
      </Button>

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
