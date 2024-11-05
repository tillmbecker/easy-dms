"use client";

import * as React from "react";
import {
  File,
  X,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Download,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useFiles, useFileUrl } from "@/hooks/useFiles";
import { useMemo, useState } from "react";
import { formatFileSize } from "@/utils/formatFileSize";
import { PdfFile } from "@/types/file";
import PdfViewer from "./pdf-viewer";

type SortKey = "name" | "size" | "lastModified" | "client";

// Simulated client list
const initialClients: string[] = [
  "Client A",
  "Client B",
  "Client C",
  "Client D",
  "Client E",
];

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
  const [clients, setClients] = useState<string[]>(initialClients);
  const [selectedFile, setSelectedFile] = useState<PdfFile | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [renamingFile, setRenamingFile] = useState<PdfFile | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  const fileUrl = useFileUrl(selectedFile?.name ?? "");

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

  const handleDelete = (id: string): void => {
    console.log(`Deleting file with id: ${id}`);
    console.log("Implement delete functionality here");
  };

  const handleRename = (id: string): void => {
    const fileToRename = files.data.find((file: PdfFile) => file.id === id);
    if (fileToRename) {
      setRenamingFile(fileToRename);
      setNewFileName(fileToRename.name);
    }
  };

  const confirmRename = (): void => {
    if (newFileName.trim() !== "" && renamingFile) {
      files.data.map((file: PdfFile) =>
        file.id === renamingFile.id
          ? { ...file, name: newFileName.trim() }
          : file
      );
      setRenamingFile(null);
      setNewFileName("");
    }
  };

  const handleDownload = (file: PdfFile): void => {
    console.log(`Downloading file: ${file.name}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF File Explorer</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                onClick={() => handleSort("size")}
              >
                <div className="flex items-center">
                  Size
                  <SortIcon
                    columnKey="size"
                    currentSortKey={sortKey}
                    currentSortOrder={sortOrder}
                  />
                </div>
              </TableHead>
              <TableHead
                className="w-[20%] cursor-pointer"
                onClick={() => handleSort("lastModified")}
              >
                <div className="flex items-center">
                  Last Modified
                  <SortIcon
                    columnKey="lastModified"
                    currentSortKey={sortKey}
                    currentSortOrder={sortOrder}
                  />
                </div>
              </TableHead>
              <TableHead className="w-[15%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFiles.map((file: PdfFile) => (
              <TableRow key={file.id} className="hover:bg-gray-100">
                <TableCell
                  className="font-medium cursor-pointer"
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="flex items-center">
                    <File className="mr-2 h-5 w-5 text-blue-500" />
                    {file.name}
                  </div>
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => setSelectedFile(file)}
                >
                  {formatFileSize(file.metadata.size, 1, false)}
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => setSelectedFile(file)}
                >
                  {file.last_accessed_at}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(file)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRename(file.id)}>
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(file.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedFile && (
        <PdfViewer
          file={selectedFile}
          open={selectedFile !== null}
          onOpenChange={(open) => !open && setSelectedFile(null)}
        />
      )}

      {renamingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Rename File</h2>
            <Input
              type="text"
              value={newFileName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewFileName(e.target.value)
              }
              className="mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setRenamingFile(null)}>
                Cancel
              </Button>
              <Button onClick={confirmRename}>Rename</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
