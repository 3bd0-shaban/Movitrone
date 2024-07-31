import React from 'react';
import WebsiteUsers from '../(components)/WebsiteUsers';

export default async function Users() {
  return (
    <>
      <div className="card-shadows-slate-300 flex items-end justify-between pb-5">
        <div className="flex flex-col gap-y-1">
          <span className="text-xl font-semibold">Users</span>
          <p className="text-xs font-medium text-gray-400">{`Home - Users - Customera4s`}</p>
        </div>
        {/* <NewClient /> */}
      </div>
      <WebsiteUsers />
    </>
  );
}
