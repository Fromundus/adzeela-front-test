'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
// import { User } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { User } from '@/types/User';
import Filters from '@/components/layout/filters';
import { useEffect, useState } from 'react';
import { fetchCurrentUserId, fetchUserPermissions } from '@/app/api/userApi';
import { PromotersPlanFeatures } from '@/types/Plan';

interface ProductsClientProps {
  data: User[];
}

export const UserClient: React.FC<ProductsClientProps> = ({ data }) => {
  const router = useRouter();
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [permissions, setPermissions] = useState<PromotersPlanFeatures>();
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const handleViewChange = () => {
    setView((prev) => (prev === 'list' ? 'grid' : 'list'));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await fetchCurrentUserId();
        const permissionsResponse = await fetchUserPermissions(
          userId.data?.user_id
        );

        console.log(permissionsResponse.data);
        setPermissions(permissionsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchData();
  }, [data]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Filters
          handleViewChange={handleViewChange}
          search={search}
          view={view}
        />
        {permissions?.additional_users !== 0 ? (
          <Button
            className="text-xs md:text-sm"
            onClick={() => router.push(`/admin/users/add`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        ) : (
          <Button disabled>+ Add New</Button>
        )}
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
