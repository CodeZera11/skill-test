"use client"

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { api } from "../../../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

const TickerTapeTable = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const items = useQuery(api.tickerTape.getAllTickerTapeItems, {
    searchQuery,
  });

  useEffect(() => {
    if (inputValue.length === 0) {
      setSearchQuery("");
      return;
    }

    const timeoutId = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ticker items..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {items === undefined ? (
        <TableSkeleton columnCount={5} />
      ) : (
        <DataTable
          columns={columns}
          data={items.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          pageCount={Math.ceil((items.length || 0) / pageSize)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
};

export default TickerTapeTable;
