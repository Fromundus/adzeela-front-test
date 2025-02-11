'use client';
import React from 'react';
import UserForm from '@/components/forms/user/user-info-form';

const AddUserPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-1">
        <UserForm mode="add" />
      </div>
    </>
  );
};

export default AddUserPage;
