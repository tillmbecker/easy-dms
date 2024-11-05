// PdfViewer.tsx
"use client";

import { useFileUrl } from "@/hooks/useFiles";
import { FileObject } from "@/types/file";
import { formatFileSize } from "@/utils/formatFileSize";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import React from "react";

interface PdfViewerProps {
  file: FileObject;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function PdfViewer({
  file,
  open,
  onOpenChange,
}: PdfViewerProps) {
  const fileUrl = useFileUrl(file.name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-full  w-[800px] [&>button]:hidden aspect-[5/7]">
        <DialogTitle className="sr-only">{file.name}</DialogTitle>
        <div className="flex flex-col h-[90vh]">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">{file.name}</h2>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-6 w-6" />
              </Button>
            </DialogClose>
          </div>
          <div className="flex flex-col h-full p-4 overflow-auto">
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              {fileUrl.isLoading && <p>Loading...</p>}
              {fileUrl.isError && <p>Error loading file</p>}
              {fileUrl.isSuccess && fileUrl.data && (
                <iframe
                  className="w-full h-full"
                  src={fileUrl.data.signedUrl ?? ""}
                />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Size: {formatFileSize(file.metadata.size, 1, false)} • Last
              modified: {file.last_accessed_at}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
