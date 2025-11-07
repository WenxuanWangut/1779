import React from 'react'
import { SideNavigation, Section, HeadingItem, NestableNavigationContent, NavigationFooter, ButtonItem } from '@atlaskit/side-navigation'
import { Link, useLocation } from 'react-router-dom'

export default function SideNav(){
  const location = useLocation()
  
  return (
    <SideNavigation label="CloudCollab Navigation">
      <NestableNavigationContent>
        <Section>
          <HeadingItem>Main</HeadingItem>
          <ButtonItem 
            component={Link} 
            to="/"
            isSelected={location.pathname === '/'}
          >
            Dashboard
          </ButtonItem>
          <ButtonItem 
            component={Link} 
            to="/projects"
            isSelected={location.pathname === '/projects' || location.pathname.startsWith('/projects/')}
          >
            Projects
          </ButtonItem>
        </Section>
      </NestableNavigationContent>
      <NavigationFooter>
        <div style={{padding: 8, fontSize: 12}}>© CloudCollab</div>
      </NavigationFooter>
    </SideNavigation>
  )
}
