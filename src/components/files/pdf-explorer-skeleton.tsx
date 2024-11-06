"use client";

import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function PdfExplorerSkeleton() {
  return (
    <TableBody>
      <TableRow>
        <TableCell>
          <Skeleton className="rounded-full w-1/2 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/3 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/3 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-full h-4" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Skeleton className="rounded-full w-1/4 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/2 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/4 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/2 h-4" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Skeleton className="rounded-full w-1/3 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/4 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/2 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/3 h-4" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Skeleton className="rounded-full w-1/2 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/3 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/3 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-full h-4" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Skeleton className="rounded-full w-1/4 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/2 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/4 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/2 h-4" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Skeleton className="rounded-full w-1/3 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/4 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/2 h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="rounded-full w-1/3 h-4" />
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
