import React from 'react'
import Button from '@atlaskit/button/new'
import { useNavigate, Link } from 'react-router-dom'
import useUI from '../../context/UIContext.jsx'

export default function Register(){
  const nav = useNavigate()
  const { pushToast } = useUI()
  
  return (
    <div className="center">
      <div style={{minWidth:320, textAlign: 'center'}}>
        <h2>Registration Not Available</h2>
        <p style={{marginBottom: 20, color: '#666'}}>
          The backend API does not currently support user registration.
          Please use one of the test accounts to login.
        </p>
        <p style={{marginBottom: 20, fontSize: 14}}>
          <strong>Test Accounts:</strong><br/>
          alice@example.com / password123<br/>
          bob@example.com / password456
        </p>
        <Button appearance="primary" onClick={() => nav('/login')}>
          Go to Login
        </Button>
        <p style={{marginTop: 16}}>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  )
}

