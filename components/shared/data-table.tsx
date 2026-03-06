"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  /** Pagination */
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  emptyMessage = "Aucun résultat.",
  page = 1,
  totalPages = 1,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={`text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 ${col.className ?? ""}`}
                  >
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-slate-100">
                    {columns.map((col) => (
                      <TableCell key={col.key} className="py-3">
                        <Skeleton className="h-4 w-28 rounded-md" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-16">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Inbox className="h-10 w-10 opacity-40" />
                      <p className="text-sm font-medium">{emptyMessage}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, i) => (
                  <TableRow
                    key={i}
                    className={`border-b border-slate-100 transition-colors hover:bg-primary/5 ${
                      i % 2 === 1 ? "bg-slate-50/50" : "bg-white"
                    }`}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={`py-3 text-sm ${col.className ?? ""}`}
                      >
                        {col.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-500">
            Page <span className="font-semibold text-slate-700">{page}</span>{" "}
            sur{" "}
            <span className="font-semibold text-slate-700">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-slate-200 hover:bg-slate-100"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
              const p = idx + 1;
              return (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="icon"
                  className={`h-8 w-8 rounded-lg text-xs ${
                    p === page
                      ? "bg-primary hover:bg-primary/90 border-primary"
                      : "border-slate-200 hover:bg-slate-100"
                  }`}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-slate-200 hover:bg-slate-100"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
