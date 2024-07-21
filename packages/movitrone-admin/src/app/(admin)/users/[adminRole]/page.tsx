import React from 'react';
import UsersTable from '../(components)/UsersTable';
import { iRole } from '@/types/user/iAdmin';

export default async function Users({
  params,
}: {
  params: { adminRole: iRole };
}) {
  const roles = [
    { params: 'admins', role: 'Admin' },
    { params: 'super-admins', role: 'Super Admin' },
  ];
  return (
    <>
      <div className='card-shadows-slate-300 flex items-end justify-between pb-5'>
        <div className='flex flex-col gap-y-1'>
          <span className='text-xl font-semibold'>Dashboard Users</span>
          <p className='text-xs font-medium text-gray-400'>{`Home - Users - admin`}</p>
        </div>
        {/* <NewClient /> */}
      </div>
      <UsersTable
        role={roles.find((p) => p.params === params.adminRole)?.role as iRole}
      />
    </>
  );
}
