"use client";
import React from "react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  className?: string;
  children?: React.ReactNode;
   headerClassName?: string;
   bodyClassName?:  string;
  /*  striped?: boolean;      // Alternate row colors
  hover?: boolean;        // Highlight rows on hover
  loading?: boolean;      // Show loading state
  emptyMessage?: string;  // Message when no data*/
}

export default function DataTable({
  columns,
  data,
  children,
  className,
   headerClassName,
   bodyClassName
}: DataTableProps) {
  return (
    <div > {children}
    <table className={`min-w-full ${className}`}>
      <thead className={headerClassName}>
        <tr>
          {columns.map((column) => (
            <th key={column.key} className="px-4 py-3 text-left">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className={bodyClassName}>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.key} className="px-4 py-3">
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}