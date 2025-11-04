import React from 'react'
import SideNavigation, { Section, HeadingItem, NestableNavigationContent, NavigationFooter, ButtonItem } from '@atlaskit/side-navigation'
import { Link } from 'react-router-dom'

export default function SideNav(){
  return (
    <SideNavigation label="Project Navigation">
      <NestableNavigationContent>
        <Section>
          <HeadingItem>Menu</HeadingItem>
          <ButtonItem component={Link} to="/projects">Projects</ButtonItem>
        </Section>
      </NestableNavigationContent>
      <NavigationFooter>
        <div style={{padding: 8, fontSize: 12}}>© CloudCollab</div>
      </NavigationFooter>
    </SideNavigation>
  )
}
