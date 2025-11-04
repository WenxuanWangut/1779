import React from 'react'
import Button from '@atlaskit/button'
import Form, { Field } from '@atlaskit/form'
import Textfield from '@atlaskit/textfield'
import { login, me } from '../api/auth.js'
import useAuth from '../hooks/useAuth.js'
import { useNavigate, Link } from 'react-router-dom'
import useUI from '../context/UIContext.jsx'

export default function Login(){
  const nav = useNavigate()
  const { login: setAuth } = useAuth()
  const { pushToast } = useUI()
  
  return (
    <div className="center">
      <div style={{minWidth:320}}>
        <h2>Login</h2>
        <Form onSubmit={async (values) => {
          try {
            const { token } = await login(values.email, values.password)
            const profile = await me()
            setAuth(token, profile)
            pushToast('Login successful!')
            nav('/projects')
          } catch (error) {
            pushToast(`Login failed: ${error.response?.data?.message || error.message}`, 'error')
          }
        }}>
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <Field name="email" label="Email" defaultValue="">
                {({ fieldProps }) => <Textfield {...fieldProps} type="email" />}
              </Field>
              <Field name="password" label="Password" defaultValue="">
                {({ fieldProps }) => <Textfield type="password" {...fieldProps} />}
              </Field>
              <Button type="submit" appearance="primary" isLoading={submitting}>Login</Button>
            </form>
          )}
        </Form>
        <p><Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}
