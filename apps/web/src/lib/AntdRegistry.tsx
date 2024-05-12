'use client';
import React, { ReactNode } from 'react';
import { LightTheme, DarkTheme } from '@/config/themeConfig';
import { ConfigProvider, theme as AntdTheme } from 'antd';
import { useTheme } from 'next-themes';

interface AntdThemeModeProps {
  children: ReactNode;
}

const AntdThemeMode = ({ children }: AntdThemeModeProps) => {
  const { theme: currentTheme, setTheme } = useTheme();
  // // Detect system preference
  // React.useEffect(() => {
  //   const systemThemePreference = window.matchMedia(
  //     '(prefers-color-scheme: dark)',
  //   ).matches
  //     ? 'dark'
  //     : 'light';

  //   if (currentTheme !== 'dark' && currentTheme !== 'light') {
  //     setTheme(systemThemePreference);
  //   }
  //   if (typeof localStorage !== 'undefined') {
  //     const storedTheme = localStorage.getItem('theme');
  //     setTheme(storedTheme as string);
  //   }
  //   const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  //   const handleChange = (e: MediaQueryListEvent) => {
  //     setTheme(e.matches ? 'dark' : 'light');
  //   };

  //   mediaQueryList.addEventListener('change', handleChange);

  //   return () => {
  //     mediaQueryList.removeEventListener('change', handleChange);
  //   };
  // }, [currentTheme, setTheme]);

  return (
    <ConfigProvider
      theme={
        currentTheme === 'dark'
          ? { algorithm: AntdTheme.darkAlgorithm, ...DarkTheme }
          : LightTheme
      }
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdThemeMode;
