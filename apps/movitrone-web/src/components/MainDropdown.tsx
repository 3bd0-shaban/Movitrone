import { iAdmin } from '@/types/user/iAdmin';
import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import { useLogOutMutation } from '@/services/APIs/AuthApi';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import UserPhoto from './Layouts/parts/UserPhoto';
import { FaCrown, FaUserAstronaut } from 'react-icons/fa';
import { PiShieldCheckLight, PiUserCircleDashed } from 'react-icons/pi';
export function MainDropdown({ user }: { user: iAdmin }) {
  const Admin = user?.role === 'Admin';
  const SuperAdmin = user?.role === 'Super Admin';

  const { setTheme } = useTheme();
  const { mutateAsync, isPending } = useLogOutMutation();
  const HandleLogOut = async () => {
    mutateAsync().then(() => {
      signOut()
        .then(() => {
          toast.success('Logged out');
          // router.push('/auth/signin');
        })
        .catch(() => {
          toast.error('error accoured while log out');
        });
    });
  };
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <>
          <div className="flex gap-4 py-3">
            <UserPhoto user={user as iAdmin} aspect={20} />
            <div className="flex items-center gap-3">
              <div>
                <p>{`${user?.firstname} ${user?.lastname}`}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  SuperAdmin
                    ? 'bg-red-600 text-red-200'
                    : 'bg-violet-600 text-violet-200'
                }`}
              >
                {SuperAdmin ? (
                  <FaCrown size={18} />
                ) : Admin ? (
                  <PiShieldCheckLight size={18} />
                ) : (
                  <FaUserAstronaut size={18} />
                )}
              </span>
            </div>
          </div>
          <hr />
        </>
      ),
    },
    {
      key: '3',
      label: (
        <Link href="/profile/open-tickets" className="p-3">
          My Tickets
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link href="/profile/settings" className="p-3">
          Account Settings
        </Link>
      ),
    },
    {
      key: '9',
      label: (
        <Link href="/profile/change-password" className="p-3">
          Change Password
        </Link>
      ),
    },
    {
      key: '4',
      label: <button className="p-3 py-0.5">Mode</button>,
      children: [
        {
          key: '4-1',
          label: (
            <Button onClick={() => setTheme('light')} type="link">
              Light
            </Button>
          ),
        },
        {
          key: '4-2',
          label: (
            <Button onClick={() => setTheme('dark')} type="link">
              Dark
            </Button>
          ),
        },
      ],
    },

    {
      key: '6',
      label: (
        <Link href="/profile" className="px-3">
          Account Settings
        </Link>
      ),
    },
    {
      key: '7',
      label: (
        <Button
          type="text"
          onClick={HandleLogOut}
          className="h-full w-full !text-start hover:!bg-transparent"
        >
          SignOut
        </Button>
      ),
    },
  ];
  return (
    <Dropdown menu={{ items }} placement="bottomRight" arrow>
      <span className="rounded-full bg-gradient-to-r from-indigo-500 via-red-500 to-pink-500 p-1">
        <div className=" h-12 w-12 rounded-full bg-white">
          <UserPhoto user={user as iAdmin} aspect={12} />
        </div>
      </span>
    </Dropdown>
  );
}
