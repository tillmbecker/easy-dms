"use client";

import { formatFileSize } from "@/utils/formatFileSize";
import { MoreVertical, Download, Pencil, Trash, File } from "lucide-react";
import { Button } from "../ui/button";
import { TableRow, TableCell } from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FileObject } from "@/types/file";
import {
  useDeleteFile,
  useFileDownloader,
  useRenameFile,
} from "@/hooks/useFiles";
import { useState } from "react";
import ConfirmationDialog from "./confirmation-dialog";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import LoadingSpinner from "../loading/loading-spinner";
import { cn } from "@/utils/shadcn";

interface FileRowProps {
  file: FileObject;
  setSelectedFile: (file: FileObject) => void;
}

// Type for tracking confirmation state
interface ConfirmationState {
  open: boolean;
  file: FileObject | null;
  action: "delete" | "rename" | null;
}

export default function FileRow({ file, setSelectedFile }: FileRowProps) {
  const deleteFile = useDeleteFile();
  const renameFile = useRenameFile();
  const { downloadFile } = useFileDownloader(file.name);
  const isLoading = renameFile.isPending || deleteFile.isPending;
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

      // // Reset confirmation state after rename
      setConfirmationState({
        open: false,
        file: null,
        action: null,
      });
      setNewFileName("");
    }
  };

  const handleDownloadClick = async () => {
    await downloadFile();
  };

  /**
   * Updates the selected file if the application is not currently loading.
   *
   * @param {FileObject} file - The file object to be selected.
   */
  const updateSelectedFile = (file: FileObject) => {
    if (!isLoading) setSelectedFile(file);
  };
  return (
    <>
      <TableRow
        key={file.id}
        className={cn(
          isLoading && "text-gray-400", // Highlight loading state
          "hover:bg-gray-100 cursor-pointer"
        )}
      >
        <TableCell
          className="font-medium"
          onClick={() => updateSelectedFile(file)}
        >
          <div className="flex items-center">
            <File className="mr-2 h-5 w-5 text-blue-500" />
            {file.name}
          </div>
        </TableCell>
        <TableCell className="" onClick={() => updateSelectedFile(file)}>
          {formatFileSize(file.metadata.size, 1, false)}
        </TableCell>
        <TableCell className="" onClick={() => updateSelectedFile(file)}>
          {file.last_accessed_at}
        </TableCell>
        <TableCell className="cursor-default">
          <DropdownMenu modal>
            <DropdownMenuTrigger asChild disabled={isLoading}>
              <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <MoreVertical className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownloadClick()}>
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
              {isLoading ? <LoadingSpinner /> : <Trash className="w-4 h-4" />}
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
    </>
  );
}
