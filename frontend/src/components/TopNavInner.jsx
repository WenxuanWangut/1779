import React from 'react'
import Button from '@atlaskit/button'
import useAuth from '../hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'

export default function TopNav(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between', padding:'8px 12px'}}>
      <strong>CloudCollab</strong>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <span>{user?.name || user?.email || 'User'}</span>
        <Button appearance="warning" onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  )
}