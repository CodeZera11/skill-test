"use client"
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { columns } from './columns'
import { DataTable } from '@/components/data-table'
import { api } from '../../../../../convex/_generated/api';
import { TableSkeleton } from '@/components/skeletons/table-skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

type SortByType = "name" | "createdAt";
type SortOrderType = "asc" | "desc";

const CategoriesTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<SortByType>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrderType>("desc");

  const categories = useQuery(api.categories.list, {
    searchQuery,
    page: currentPage,
    limit: pageSize,
    sortBy,
    sortOrder,
  });

  // if (categories === undefined) {
  //   return <TableSkeleton columnCount={4} />
  // }

  console.log("categories", categories)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={(value: SortByType) => setSortBy(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sortOrder}
          onValueChange={(value: SortOrderType) => setSortOrder(value)}
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

      <DataTable
        columns={columns}
        data={categories?.items || []}
        pageCount={categories?.pageCount || 1}
        currentPage={categories?.currentPage || 1}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  )
}

export default CategoriesTable