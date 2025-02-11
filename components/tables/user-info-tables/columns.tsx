'use client';
import { ColumnDef, TableMeta } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// import { User } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/types/User';


export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'name'
  },
  {
    accessorKey: 'username',
    header: 'username'
  },
  {
    accessorKey: 'role',
    header: 'role'
  },
  {
    accessorFn: (row) => row.user_type ?? 'N/A',
    header: 'user type'
  },
  {
    accessorKey: 'phone',
    header: 'phone'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
    
  }
];
