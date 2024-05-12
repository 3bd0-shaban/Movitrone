'use client';
import { createContext, FC, useContext } from 'react';
import { iAdmin } from '@/types/user/iAdmin';
import { useSession } from 'next-auth/react';

type Roles =
  | 'Employee'
  | 'Manager'
  | 'Customer'
  | 'Admin'
  | 'Super Admin'
  | 'Raya';
interface AuthContextProps {
  access_token?: string;
  user?: iAdmin;
  checkRole?: (roles: Roles[]) => boolean;
}

const UserContext = createContext<AuthContextProps>({});

export const UseProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { data: session } = useSession();
  const checkRole = (roles: Roles[]): boolean => {
    return roles.some((role) => role === session?.role);
  };
  const contextValue = { checkRole };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = (): AuthContextProps => {
  const userState = useContext(UserContext);
  if (!userState) {
    throw new Error('useAuth must be used within a userProvider');
  }
  const checkRole = userState.checkRole || (() => false);
  return { checkRole };
};

export default useUser;
