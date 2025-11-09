import React from 'react'
import { Outlet } from 'react-router-dom'
import SideNav from './SideNavInner.jsx'

export default function AppShell(){
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'auto', borderRight: '1px solid var(--ds-border-bold, rgba(9, 30, 66, 0.28))' }}>
        <SideNav />
      </aside>
      <main data-testid="content" style={{ height: '100vh', overflow: 'auto' }}>
        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  )
}