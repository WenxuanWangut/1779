import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@atlaskit/button/new'
import Form, { Field } from '@atlaskit/form'
import Textfield from '@atlaskit/textfield'
import useAuth from '../../hooks/useAuth.js'
import useUI from '../../context/UIContext.jsx'

export default function UserSettings(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pushToast } = useUI()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    pushToast('Logged out successfully')
  }

  return (
    <div>
      <div style={{marginBottom: 24}}>
        <h2 style={{margin: 0}}>User Settings</h2>
        <p style={{color: '#666', margin: '8px 0 0 0'}}>Manage your account and preferences</p>
      </div>

      <div style={{
        backgroundColor: '#f7f8f9',
        borderRadius: 8,
        padding: 24,
        border: '1px solid #e1e5e9',
        marginBottom: 16
      }}>
        <h3 style={{margin: '0 0 16px 0', fontSize: 16}}>Profile Information</h3>
        
        <div style={{marginBottom: 16}}>
          <strong>Name:</strong> {user?.name || 'Not set'}
        </div>
        
        <div style={{marginBottom: 16}}>
          <strong>Email:</strong> {user?.email || 'Not set'}
        </div>

        <div style={{marginBottom: 16}}>
          <strong>User ID:</strong> {user?.id || 'Not available'}
        </div>

        <p style={{color: '#666', fontSize: 14, marginTop: 16}}>
          Note: Profile editing is not available yet. The backend API doesn't support user profile updates.
        </p>
      </div>

      <div style={{
        backgroundColor: '#fff4e6',
        borderRadius: 8,
        padding: 24,
        border: '1px solid #ffc400',
        marginBottom: 16
      }}>
        <h3 style={{margin: '0 0 8px 0', fontSize: 16, color: '#b25900'}}>Account Actions</h3>
        <p style={{margin: '0 0 16px 0', color: '#666', fontSize: 14}}>
          Sign out of your account
        </p>
        <Button appearance="warning" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div style={{
        backgroundColor: '#f7f8f9',
        borderRadius: 8,
        padding: 24,
        border: '1px solid #e1e5e9'
      }}>
        <h3 style={{margin: '0 0 16px 0', fontSize: 16}}>About CloudCollab</h3>
        <p style={{color: '#666', fontSize: 14, margin: 0}}>
          CloudCollab is a cloud-native task management platform designed for small, agile teams.
          Built with React, Django, and real-time collaboration features.
        </p>
      </div>
    </div>
  )
}

