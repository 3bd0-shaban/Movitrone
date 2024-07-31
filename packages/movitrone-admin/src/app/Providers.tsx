'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/Contexts/AuthContext';
import Toast from '@/lib/Toast';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import AntdThemeMode from '@/lib/AntdRegistry';

type providersProps = {
  children: React.ReactNode;
  session?: any;
};

export default function Providers({ children, session }: providersProps) {
  const queryClient = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )[0];

  return (
    // <ThemeProvider attribute='class' defaultTheme='LightTheme'>
    <AntdThemeMode>
      <SessionProvider session={session}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <div className="min-h-screen overflow-x-hidden">
              <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/Images/bg/23825.jpg')",
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                }}
              />

              <div className="backdrop-blur-md">
                <Toast />
                {children}
              </div>
            </div>
          </QueryClientProvider>
        </AuthProvider>
      </SessionProvider>
    </AntdThemeMode>
    // </ThemeProvider>
  );
}
