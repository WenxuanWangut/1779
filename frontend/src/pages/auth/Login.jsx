import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@atlaskit/button/new'
import Textfield from '@atlaskit/textfield'
import useAuth from '../../hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'
import useUI from '../../context/UIContext.jsx'
import { Eye, EyeOff } from 'lucide-react'
import '../../styles/auth.css'

export default function Login(){
  const nav = useNavigate()
  const { login } = useAuth()
  const { pushToast } = useUI()
  const [email, setEmail] = useState('alice@example.com')
  const [password, setPassword] = useState('password123')
  const [showPwd, setShowPwd] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e){
    e.preventDefault()
    if(submitting) return
    try{
      setSubmitting(true)
      await login(email.trim(), password)
      pushToast('Welcome back!')
      nav('/')
    }catch(err){
      pushToast(err.message || 'Login failed', 'error')
    }finally{
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="auth-card"
      >
        <div className="auth-header">
          <h1>Login</h1>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-label">Email</label>
          <div className={emailFocused ? 'focus-spacer active' : 'focus-spacer'} />
          <motion.div
            className="auth-field-wrap"
            animate={emailFocused ? { scale: 1.02 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          >
            <Textfield
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </motion.div>

          <label className="auth-label">Password</label>
          <div className={passwordFocused ? 'focus-spacer active' : 'focus-spacer'} />
          <motion.div
            className="auth-password auth-field-wrap"
            animate={passwordFocused ? { scale: 1.02 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          >
            <Textfield
              name="password"
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <button
              type="button"
              className="auth-eye"
              onClick={() => setShowPwd(v => !v)}
              aria-label={showPwd ? 'Hide password' : 'Show password'}
            >
              {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </motion.div>

          <div className="auth-submit">
            <Button
              type="submit"
              appearance="primary"
              isDisabled={submitting}
            >
              {submitting ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}