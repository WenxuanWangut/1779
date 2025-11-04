import React from 'react'
import PageLayout, { TopNavigation, Content, LeftSidebar } from '@atlaskit/page-layout'
import { Outlet } from 'react-router-dom'
import TopNav from './TopNavInner.jsx'
import SideNav from './SideNavInner.jsx'

export default function AppShell(){
  return (
    <PageLayout>
      <TopNavigation isFixed><TopNav /></TopNavigation>
      <LeftSidebar isFixed><SideNav /></LeftSidebar>
      <Content><div className="page"><Outlet /></div></Content>
    </PageLayout>
  )
}
