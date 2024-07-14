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
import { iAdmin } from '@/types/user/iAdmin';

interface AuthContextProps {
  access_token?: string;
  user?: iAdmin;
}

const AuthContext = createContext<AuthContextProps>({});

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthContextProps>({});
  const hasRefreshTokenBeenCalled = useRef(false);
  const { data: session } = useSession();
  useEffect(() => {
    if (!hasRefreshTokenBeenCalled.current && session) {
      hasRefreshTokenBeenCalled.current = true;

      const refreshAndHandleLoading = async () => {
        await refreshToken()
          .then(({ access_token, user }) => {
            setAuthState({ access_token, user });
            setCookie('access_token', access_token, { secure: true });
          })
          .catch((error) => {
            deleteCookie('access_token');
            if (session) {
              signOut();
            }
          });
      };

      refreshAndHandleLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const authState = useContext(AuthContext);
  return authState;
};

export default useAuth;
