"use client"
import { useQuery } from 'convex/react';
import { columns } from './columns'
import { DataTable } from '@/components/data-table'
import { api } from '../../../../../convex/_generated/api';

const CategoriesTable = () => {
  const categories = useQuery(api.categories.list);

  if (categories === undefined) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={categories}
        showPagination
      />
    </div>
  )
}

export default CategoriesTable