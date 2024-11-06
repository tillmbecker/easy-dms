"use client";

import * as React from "react";
import {
  File,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Download,
  Loader2,
  Trash,
  Pencil,
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

import { useDeleteFile, useFiles, useRenameFile } from "@/hooks/useFiles";
import { useMemo, useState } from "react";
import { formatFileSize } from "@/utils/formatFileSize";
import { FileObject } from "@/types/file";
import PdfViewer from "./pdf-viewer";
import ConfirmationDialog from "./confirmation-dialog";
import { DialogFooter } from "../ui/dialog";

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

// Type for tracking confirmation state
interface ConfirmationState {
  open: boolean;
  file: FileObject | null;
  action: "delete" | "rename" | null;
}

export default function PdfExplorer(): JSX.Element {
  const files = useFiles();
  const deleteFile = useDeleteFile();
  const renameFile = useRenameFile();
  const [selectedFile, setSelectedFile] = useState<FileObject | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [renamingFile, setRenamingFile] = useState<FileObject | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  // State for tracking which file is being acted upon
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>(
    {
      open: false,
      file: null,
      action: null,
    }
  );
  const handleDeleteClick = (file: FileObject) => {
    setConfirmationState({
      open: true,
      file,
      action: "delete",
    });
  };

  const handleDeleteConfirm = async () => {
    if (confirmationState.file) {
      await deleteFile.mutate(confirmationState.file.name);

      // // Reset confirmation state after deletion
      setConfirmationState({
        open: false,
        file: null,
        action: null,
      });
    }
  };

  const handleRenameClick = (file: FileObject) => {
    setNewFileName(file.name);
    setConfirmationState({
      open: true,
      file,
      action: "rename",
    });
  };

  const handleRenameConfirm = async () => {
    if (!confirmationState.file) return;
    if (newFileName.trim() !== "" && confirmationState.file) {
      // Rename file
      await renameFile.mutate({
        fileName: confirmationState.file.name,
        newFileName,
      });
      setConfirmationState({
        open: false,
        file: null,
        action: null,
      });
      setNewFileName("");
    }
  };
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

  const handleDownload = (file: FileObject): void => {
    // setActionConfirmationOpen(true);

    console.log(`Downloading file: ${file.name}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF File Explorer</h1>
      <div className="bg-white border  rounded-lg overflow-hidden">
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
              <TableHead className="w-[15%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFiles.map((file: FileObject) => (
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
                  <DropdownMenu modal>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          handleDownload(file);
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRenameClick(file)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(file)}>
                        <Trash className="mr-2 h-4 w-4" />
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

      <PdfViewer
        file={selectedFile}
        open={selectedFile !== null}
        onOpenChange={(open) => !open && setSelectedFile(null)}
      />
      <ConfirmationDialog
        open={confirmationState.open && confirmationState.action === "delete"}
        onOpenChange={(open) =>
          setConfirmationState((prev) => ({ ...prev, open }))
        }
        title="Delete file"
        variant="destructive"
        description={
          confirmationState.file
            ? `Are you sure you want to delete "${confirmationState.file.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this file? This action cannot be undone."
        }
        onConfirm={handleDeleteConfirm}
        renderActions={({ onConfirm, onCancel, isLoading }) => (
          <DialogFooter>
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <span>Delete File</span>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash className="w-4 h-4" />
              )}
            </Button>
          </DialogFooter>
        )}
      />

      <ConfirmationDialog
        open={confirmationState.open && confirmationState.action === "rename"}
        onOpenChange={(open) =>
          setConfirmationState((prev) => ({ ...prev, open }))
        }
        title="Rename File"
        onConfirm={handleRenameConfirm}
        renderContent={() => (
          <div className="py-4">
            <Input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Enter new file name"
            />
          </div>
        )}
      />
    </div>
  );
}
