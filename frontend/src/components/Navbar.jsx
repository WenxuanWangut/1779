import React from 'react'
import { PageLayout, TopNavigation, Content, LeftSidebar } from '@atlaskit/page-layout'
import { Outlet } from 'react-router-dom'
import SideNav from './SideNavInner.jsx'

export default function AppShell(){
  return (
    <PageLayout>
      <LeftSidebar isFixed width={240}>
        <SideNav />
      </LeftSidebar>
      <Content testId="content">
        <div className="page">
          <Outlet />
        </div>
      </Content>
    </PageLayout>
  )
}
