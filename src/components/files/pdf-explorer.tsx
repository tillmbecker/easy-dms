"use client";

import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useFiles } from "@/hooks/useFiles";
import { useMemo, useState } from "react";
import { FileObject } from "@/types/file";
import PdfViewer from "./pdf-viewer";
import FileRow from "./file-row";
import PdfExplorerSkeleton from "./pdf-explorer-skeleton";

type SortKey = "name" | "metadata.size" | "last_accessed_at";

interface SortIconProps {
  columnKey: SortKey;
  currentSortKey: SortKey;
  currentSortOrder: "asc" | "desc";
}

const SortIcon: React.FC<SortIconProps> = ({
  columnKey,
  currentSortKey,
  currentSortOrder,
}) => {
  if (columnKey !== currentSortKey) return null;
  return currentSortOrder === "asc" ? (
    <ChevronUp className="ml-2 h-4 w-4" />
  ) : (
    <ChevronDown className="ml-2 h-4 w-4" />
  );
};

export default function PdfExplorer(): JSX.Element {
  const files = useFiles();
  const [selectedFile, setSelectedFile] = useState<FileObject | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // FIXME: Sorting for sizes does not work
  const sortedFiles = useMemo(() => {
    if (!files.data) return [];
    return [...files.data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (!aValue || !bValue) return 0;

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [files.data, sortKey, sortOrder]);

  const handleSort = (key: SortKey): void => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF File Explorer</h1>
      <div className="bg-white border  rounded-lg overflow-hidden">
        {false ? (
          <PdfExplorerSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[30%] cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    File Name
                    <SortIcon
                      columnKey="name"
                      currentSortKey={sortKey}
                      currentSortOrder={sortOrder}
                    />
                  </div>
                </TableHead>
                <TableHead
                  className="w-[15%] cursor-pointer"
                  onClick={() => handleSort("metadata.size")}
                >
                  <div className="flex items-center">
                    Size
                    <SortIcon
                      columnKey="metadata.size"
                      currentSortKey={sortKey}
                      currentSortOrder={sortOrder}
                    />
                  </div>
                </TableHead>
                <TableHead
                  className="w-[20%] cursor-pointer"
                  onClick={() => handleSort("last_accessed_at")}
                >
                  <div className="flex items-center">
                    Last Modified
                    <SortIcon
                      columnKey="last_accessed_at"
                      currentSortKey={sortKey}
                      currentSortOrder={sortOrder}
                    />
                  </div>
                </TableHead>
                <TableHead className="w-[5%] ">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {files.isLoading ? (
              <PdfExplorerSkeleton />
            ) : (
              <TableBody>
                {sortedFiles.map((file: FileObject) => (
                  <FileRow
                    key={file.id}
                    file={file}
                    setSelectedFile={setSelectedFile}
                  />
                ))}
              </TableBody>
            )}
          </Table>
        )}
      </div>

      <PdfViewer
        file={selectedFile}
        open={selectedFile !== null}
        onOpenChange={(open) => !open && setSelectedFile(null)}
      />
    </div>
  );
}
