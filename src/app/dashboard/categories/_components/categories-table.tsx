"use client"
import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { columns } from './columns'
import { DataTable } from '@/components/data-table'
import { api } from '../../../../../convex/_generated/api';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { TableSkeleton } from '@/components/skeletons/table-skeleton';
import { TSortOrder } from '@/types';

const CategoriesTable = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const categories = useQuery(api.categories.list, {
    searchQuery,
    sortOrder,
  })

  useEffect(() => {
    if (inputValue.length === 0) {
      setSearchQuery("");
      return;
    }

    if (inputValue.length > 0) {
      const timeoutId = setTimeout(() => {
        setSearchQuery(inputValue);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [inputValue])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={sortOrder}
          onValueChange={(value: TSortOrder) => setSortOrder(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {categories === undefined ? (<TableSkeleton columnCount={4} />) : (
        <DataTable
          columns={columns}
          data={categories?.slice((currentPage - 1) * pageSize, currentPage * pageSize) || []}
          pageCount={Math.ceil((categories?.length || 0) / pageSize)}
          currentPage={currentPage || 1}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  )
}

export default CategoriesTable