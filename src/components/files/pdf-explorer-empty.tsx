"use client";

import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { TableBody, TableCell, TableRow } from "../ui/table";
import Link from "next/link";

export default function PdfExplorerEmpty() {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={4} className="h-96 text-center">
          <div className="flex flex-col items-center justify-center h-full gap-10">
            <p className="text-gray-500 text-lg font-semibold">
              No files found. Upload a file to get started.
            </p>
            <Link href="/dashboard/documents/upload">
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload file
              </Button>
            </Link>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
