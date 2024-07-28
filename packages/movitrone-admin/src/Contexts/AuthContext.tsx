'use client';
import {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { signOut, useSession } from 'next-auth/react';
import { refreshToken } from '@/services/refreshToken';
import { deleteCookie, setCookie } from 'cookies-next';

const AuthContext = createContext<Date | undefined>(undefined);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [refreshExpirationDate, setRefreshExpirationDate] = useState<Date>();
  const { data: session } = useSession();
  const hasRefreshTokenBeenCalled = useRef(false);

  const RefreshTokenHandler = async () => {
    try {
      const { access_token, expires_at } = await refreshToken();
      setRefreshExpirationDate(new Date(expires_at));
      setCookie('access_token', access_token, { secure: true });
    } catch (error) {
      deleteCookie('access_token');
      if (session) {
        signOut();
      }
    }
  };

  useEffect(() => {
    if (session && !hasRefreshTokenBeenCalled.current) {
      hasRefreshTokenBeenCalled.current = true;
      RefreshTokenHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (!refreshExpirationDate) return;
    const now = new Date();

    if (now >= refreshExpirationDate) {
      RefreshTokenHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshExpirationDate]);

  return (
    <AuthContext.Provider value={refreshExpirationDate}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
