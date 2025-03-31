"use client";

import { InvoiceData } from "@/types/invoice";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import LoadingSpinner from "../loading/loading-spinner";
import { cn } from "@/utils/shadcn";
import { Button } from "../ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Progress } from "../ui/progress";
import FileNameGuidePopover from "./file-name-popover";

interface FileUploadStatus {
  progress: number;
  status: "uploading" | "success" | "error";
  name: string;
  error?: UploadError;
}

export interface UploadError {
  statusCode: string;
  error: string;
  message: string;
}

// map error codes to messages
const errorMessages: { [key: string]: string } = {
  InvalidKey: "File name contains unsupported characters",
  Duplicate: "File name already exists",
  NoContent: "Document contains no content",
};

export default function UploadFile() {
  const [result, setResult] = useState<InvoiceData | null>(null);

  const [fileStatuses, setFileStatuses] = useState<
    Map<string, FileUploadStatus>
  >(new Map());

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: {
        "application/pdf": [".pdf"],
        // "image/*": [".png", ".jpg", ".jpeg"],
      },
      onDrop: async (acceptedFiles, rejectedFiles) => {
        // Initialize progress for each file
        const newFileStatuses = new Map<string, FileUploadStatus>();
        acceptedFiles.forEach((file) => {
          newFileStatuses.set(file.name, {
            progress: 0,
            status: "uploading",
            name: file.name,
          });
        });
        setFileStatuses(newFileStatuses);

        // Process each file
        const uploads = acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          try {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/analyze");
            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const percentCompleted = Math.round(
                  (event.loaded * 100) / event.total
                );
                setFileStatuses((prev) => {
                  const updated = new Map(prev);
                  updated.set(file.name, {
                    ...updated.get(file.name)!,
                    progress: percentCompleted,
                  });
                  return updated;
                });
              }
            };
            xhr.send(formData);
            const response = await new Promise<Response>((resolve, reject) => {
              xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  resolve(
                    new Response(xhr.responseText, { status: xhr.status })
                  );
                } else {
                  const errorResponse: UploadError = JSON.parse(
                    xhr.responseText
                  );
                  console.log("errorResponse", errorResponse);
                  reject(errorResponse);
                }
              };
              xhr.onerror = () => reject(new Error("Upload failed"));
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            setFileStatuses((prev) => {
              const updated = new Map(prev);
              updated.set(file.name, {
                ...updated.get(file.name)!,
                status: "success",
              });
              return updated;
            });

            return data;
          } catch (err) {
            const newError = err as unknown as any;
            // Access the nested error object
            const errorData = newError.error || {};

            const errorDetails = {
              error: errorData.error || "Unknown error",
              statusCode: errorData.statusCode || "Unknown status",
              message: errorData.message || "Unknown message",
            };
            setFileStatuses((prev) => {
              const updated = new Map(prev);
              updated.set(file.name, {
                ...updated.get(file.name)!,
                status: "error",
                error: errorDetails,
              });
              return updated;
            });
          }
        });
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
          <p>Drop the PDF file here...</p>
        ) : (
          <p>Drag & drop a PDF file, or click to select one</p>
        )}
      </div>
      {fileRejections.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Rejected Files</h2>
          <ul className="list-disc list-inside">
            {fileRejections.map(({ file, errors }) => (
              <li key={file.name}>
                {file.name} - {errors[0].message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {fileStatuses.size > 0 && (
        <div className="mt-4 space-y-4">
          {Array.from(fileStatuses.entries()).map(([fileName, status]) => (
            <div key={fileName} className="border rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{fileName}</span>
                <span>
                  {status.status === "uploading" && `${status.progress}%`}
                  {status.status === "success" && (
                    <CheckCircle className="h-5 w-5 stroke-green-700" />
                  )}
                  {status.status === "error" && (
                    <XCircle className="h-5 w-5 stroke-red-700" />
                  )}
                </span>
              </div>
              {status.status === "uploading" && (
                <Progress value={status.progress} />
              )}
              {status.error && (
                <div className="flex gap-2">
                  <p className="text-red-600 text-sm mt-2">
                    {errorMessages[status.error.error] || status.error.error}
                  </p>
                  {status.error.error === "InvalidKey" && (
                    <FileNameGuidePopover />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Extracted Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {(Object.entries(result) as any[]).map(([key, value]) => (
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
