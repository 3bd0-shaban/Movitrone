'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Layout } from 'antd';
import SideBar from './SideBar';
import { MainDropdown } from './MainDropdown';
import { iAdmin } from '@/types/user/iAdmin';
import Image from 'next/image';
import { FaSearchPlus } from 'react-icons/fa';
import { useGetSelfAccountQuery } from '@/services/APIs/user/AdminApi';
import { RiMenuFold2Fill, RiMenuUnfold2Line } from 'react-icons/ri';

export default function AdminWraper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const { data: user } = useGetSelfAccountQuery();
  const { Header: AntdHeader, Sider, Content } = Layout;

  const sidebarCollapse =
    typeof window !== 'undefined' ? localStorage.getItem('sidebar') : null;
  const isCollapsed = sidebarCollapse === 'true';

  const [collapsed, setCollapsed] = useState<boolean>(isCollapsed);
  const [layoutWidth, setWidth] = useState<number>(isCollapsed ? 110 : 300);
  const [sideWidth, setSideWidth] = useState<number>(80);

  const latestWidthRef = useRef<number>(layoutWidth);

  useEffect(() => {
    if (layoutWidth !== latestWidthRef.current) {
      localStorage.setItem('sidebar', String(collapsed));
      latestWidthRef.current = layoutWidth;
    }
  }, [collapsed, layoutWidth]);

  return (
    <Layout hasSider style={{ minHeight: '100vh', marginRight: 15 }}>
      <Layout.Sider
        trigger={null}
        collapsible
        width={270}
        style={{
          userSelect: 'none',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 1px 10px 7px rgba(0, 0, 255, 0.1)',
          borderRadius: '20px',
          overflow: 'auto',
          height: '95vh',
          position: 'fixed',
          background: 'none',
          left: 15,
          top: 15,
          bottom: 15,
        }}
        breakpoint="lg"
        collapsedWidth={sideWidth}
        onBreakpoint={(broken: any) => {
          if (broken) {
            setCollapsed(true);
            setWidth(0);
            setSideWidth(0);
          }
        }}
        className="hideScrollBare"
        collapsed={collapsed}
      >
        <div className="demo-logo-vertical flex justify-center p-5">
          <Image
            height={80}
            width={200}
            className="h-14 w-44"
            src="/Images/icons/FtlErates-Black.svg"
            priority={true}
            alt="ftlerates"
          />
        </div>
        <SideBar session={session} />
        <div className="pt-20" />
      </Layout.Sider>
      <Layout
        className="site-layout duration-300"
        style={{ marginLeft: layoutWidth, background: 'none' }}
      >
        <Layout.Header style={{ padding: 0, margin: '20px 0 20px 0' }}>
          <div
            style={{
              padding: 0,
              position: 'sticky',
              top: 15,
              zIndex: 5,
              marginBottom: 40,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
            className="card-shadows-slate-300 mb-5 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <Button
                type="text"
                icon={collapsed ? <RiMenuUnfold2Line /> : <RiMenuFold2Fill />}
                onClick={() => {
                  setCollapsed(collapsed === true ? false : true);
                  setWidth(collapsed ? 300 : 110);
                  setSideWidth(80);
                }}
                className="hidden rounded-xl md:block"
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
              <div className="flex items-center">
                <Input
                  size="large"
                  placeholder="Search"
                  className="hidden rounded-lg md:flex"
                  prefix={
                    <span className="text-gray-400">
                      <FaSearchPlus />
                    </span>
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2 px-2">
              <MainDropdown user={user as iAdmin} />
            </div>
          </div>
        </Layout.Header>
        <Layout.Content
          style={{
            minHeight: 280,
          }}
          className="rounded-lg"
        >
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
