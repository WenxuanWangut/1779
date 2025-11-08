import React from 'react'
import Button from '@atlaskit/button'
import Form, { Field } from '@atlaskit/form'
import Textfield from '@atlaskit/textfield'
import useAuth from '../../hooks/useAuth.js'
import { useNavigate, Link } from 'react-router-dom'
import useUI from '../../context/UIContext.jsx'

export default function Login(){
  const nav = useNavigate()
  const { login } = useAuth()
  const { pushToast } = useUI()
  
  return (
    <div className="center">
      <div style={{minWidth:320}}>
        <h2>Login</h2>
        <Form onSubmit={async (values) => {
          try {
            await login(values.email, values.password)
            pushToast('Login successful!')
            nav('/')
          } catch (error) {
            pushToast(`Login failed: ${error.response?.data?.error || error.message}`, 'error')
          }
        }}>
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <Field name="email" label="Email" defaultValue="alice@example.com">
                {({ fieldProps }) => <Textfield {...fieldProps} type="email" autoComplete="username" />}
              </Field>
              <Field name="password" label="Password" defaultValue="password123">
                {({ fieldProps }) => <Textfield type="password" {...fieldProps} autoComplete="current-password" />}
              </Field>
              <Button type="submit" appearance="primary" isDisabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</Button>
            </form>
          )}
        </Form>
        <p style={{marginTop: 16, fontSize: 12, color: '#666'}}>
          Test users: alice@example.com / password123 or bob@example.com / password456
        </p>
        <p style={{marginTop: 8}}>
          <Link to="/register">Register</Link> (Note: Backend doesn't support registration yet)
        </p>
      </div>
    </div>
  )
}