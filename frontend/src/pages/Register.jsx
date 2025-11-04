import React from 'react'
import Button from '@atlaskit/button'
import Form, { Field } from '@atlaskit/form'
import Textfield from '@atlaskit/textfield'
import { register, me } from '../api/auth.js'
import useAuth from '../hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'
import useUI from '../context/UIContext.jsx'

export default function Register(){
  const nav = useNavigate()
  const { login: setAuth } = useAuth()
  const { pushToast } = useUI()
  
  return (
    <div className="center">
      <div style={{minWidth:320}}>
        <h2>Register</h2>
        <Form onSubmit={async (values) => {
          try {
            const { token } = await register(values.email, values.password, values.name)
            const profile = await me()
            setAuth(token, profile)
            pushToast('Account created successfully!')
            nav('/projects')
          } catch (error) {
            pushToast(`Registration failed: ${error.response?.data?.message || error.message}`, 'error')
          }
        }}>
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <Field name="name" label="Name" defaultValue="">
                {({ fieldProps }) => <Textfield {...fieldProps} />}
              </Field>
              <Field name="email" label="Email" defaultValue="">
                {({ fieldProps }) => <Textfield {...fieldProps} type="email" />}
              </Field>
              <Field name="password" label="Password" defaultValue="">
                {({ fieldProps }) => <Textfield type="password" {...fieldProps} />}
              </Field>
              <Button type="submit" appearance="primary" isLoading={submitting}>Create account</Button>
            </form>
          )}
        </Form>
      </div>
    </div>
  )
}
