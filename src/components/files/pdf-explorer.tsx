"use client";

import * as React from "react";
import { File } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useFiles, useFileUrl } from "@/hooks/useFiles";

// Simulated PDF files data
const pdfFiles = [
  {
    id: 1,
    name: "Document1.pdf",
    size: "2.5 MB",
    last_accessed_at: "2023-11-01",
  },
  {
    id: 2,
    name: "Report2023.pdf",
    size: "5.1 MB",
    last_accessed_at: "2023-10-28",
  },
  {
    id: 3,
    name: "Presentation.pdf",
    size: "3.7 MB",
    last_accessed_at: "2023-11-03",
  },
  {
    id: 4,
    name: "UserManual.pdf",
    size: "8.2 MB",
    last_accessed_at: "2023-09-15",
  },
  {
    id: 5,
    name: "FinancialStatement.pdf",
    size: "1.8 MB",
    last_accessed_at: "2023-11-05",
  },
];

type PdfFile = {
  name: string;
  id: number;
  metadata: { size: number };
  last_accessed_at: string;
};

export default function PdfExplorer() {
  const [selectedFile, setSelectedFile] = React.useState<PdfFile | null>(null);

  const files = useFiles();
  const fileUrl = useFileUrl(selectedFile?.name ?? "");
  console.log(files.data);
  console.log("fileURL", fileUrl.data);
  return (
    <div className="flex h-screen bg-gray-100">
      {/* File Explorer */}
      <div className="w-1/3 bg-white shadow-md">
        <h2 className="p-4 text-lg font-semibold">PDF Files</h2>
        <Separator />
        <ScrollArea className="h-[calc(100vh-60px)]">
          {!files.isLoading &&
            files.data.map((file: PdfFile) => (
              <div
                key={file.id}
                className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer ${
                  selectedFile?.id === file.id ? "bg-blue-100" : ""
                }`}
                onClick={() => {
                  setSelectedFile(file);
                }}
              >
                <File className="mr-2 h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {file.metadata.size / 1000} KB • Last accessed:{" "}
                    {file.last_accessed_at}
                  </p>
                </div>
              </div>
            ))}
        </ScrollArea>
      </div>

      {/* PDF Preview */}
      <div className="flex-1 p-6">
        {selectedFile ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedFile.name}</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
              {/* Placeholder for PDF preview */}
              <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center">
                <iframe
                  src={fileUrl.data?.signedUrl ?? ""}
                  className="w-full h-full"
                ></iframe>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Size: {selectedFile.metadata.size} • Last modified:{" "}
                {selectedFile.last_accessed_at}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a PDF file to preview
          </div>
        )}
      </div>
    </div>
  );
}
