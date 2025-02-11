'use client';
import { deleteUser, fetchUsers } from '@/app/api/userApi';
import ConfirmDialog from '@/components/confirm-dialog';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/types/User';
// import { User } from '@/constants/data';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableData, setTableData] = useState(data); // Manage table data


//   useEffect(() => {
//    const loadData = async () => {
//      setLoading(true);
//      try {
//        const users = await fetchUsers();
//        setTableData(data);
//      } catch (err: any) {
//        console.error("Error fetching users:", err);
//      } finally {
//        setLoading(false);
//      }
//    };

//    loadData();
//  }, [fetchUsers]); // Add fetchUsers to the dependency array

  const router = useRouter();

  const onConfirm = async () => {};

  
  const handleDelete = async () => {
    try {
      await deleteUser(data.id!);

      toast({
        title: 'Success',
        description: 'User deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setInterval(() => {
        window.location.reload();
      }, 3000);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/admin/users/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};

