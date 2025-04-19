"use client"

import { useQuery } from 'convex/react';
import { columns } from './columns'
import { DataTable } from '@/components/data-table'
import { api } from '../../../../../convex/_generated/api';
import { TableSkeleton } from '@/components/skeletons/table-skeleton';

const SubCategoriesTable = () => {
  const subCategories = useQuery(api.subCategories.listWithTests);

  if (subCategories === undefined) {
    return <TableSkeleton />
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={subCategories}
        showPagination
      />
    </div>
  )
}

export default SubCategoriesTable
