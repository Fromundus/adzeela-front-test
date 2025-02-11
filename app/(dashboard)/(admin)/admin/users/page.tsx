'use client';
import { fetchUsers } from '@/app/api/userApi';
import { UserClient } from '@/components/tables/user-info-tables/client';
import { User } from '@/types/User';
import React, { useState, useEffect } from 'react';

export default function page() {
 
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetchUsers();
          console.log(response.data);
          setData(response.data);
        } catch (err) {
          console.error('Error fetching userss:', err);
          setError('Failed to load data');
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <UserClient data={data} />
      </div>
    </>
  );
}
