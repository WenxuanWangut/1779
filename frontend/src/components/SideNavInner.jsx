import React from 'react'
import { SideNavigation, Section, HeadingItem, NestableNavigationContent, NavigationFooter, ButtonItem } from '@atlaskit/side-navigation'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from "@atlaskit/button";
import useAuth from "../hooks/useAuth.js";

export default function SideNav(){
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <SideNavigation label="CloudCollab Navigation">
      <NestableNavigationContent>
        <Section>
          <HeadingItem>
            <span style={{fontSize: 16}}>{user?.name || user?.email || 'User'}</span>
          </HeadingItem>
          <ButtonItem 
            onClick={() => navigate('/')}
            isSelected={location.pathname === '/'}
          >
            Dashboard
          </ButtonItem>
          <ButtonItem 
            onClick={() => navigate('/projects')}
            isSelected={location.pathname === '/projects' || location.pathname.startsWith('/projects/')}
          >
            Projects
          </ButtonItem>
        </Section>
      </NestableNavigationContent>
      <NavigationFooter>
        <Button appearance="primary" onClick={handleLogout} shouldFitContainer>Logout</Button>
      </NavigationFooter>
    </SideNavigation>
  )
}
