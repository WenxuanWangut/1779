import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@atlaskit/button/new'
import Textfield from '@atlaskit/textfield'
import useAuth from '../../hooks/useAuth.js'
import { useNavigate, Link } from 'react-router-dom'
import useUI from '../../context/UIContext.jsx'
import { Eye, EyeOff } from 'lucide-react'
import '../../styles/auth.css'

export default function Register(){
  const nav = useNavigate()
  const { signup } = useAuth()
  const { pushToast } = useUI()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [signupToken, setSignupToken] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [nameFocused, setNameFocused] = useState(false)
  const [tokenFocused, setTokenFocused] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e){
    e.preventDefault()
    if(submitting) return
    
    // Validation
    if(!email.trim() || !password.trim() || !name.trim() || !signupToken.trim()){
      pushToast('Please fill in all fields', 'error')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(email.trim())){
      pushToast('Please enter a valid email address', 'error')
      return
    }

    // Password validation
    if(password.length < 6){
      pushToast('Password must be at least 6 characters', 'error')
      return
    }

    try{
      setSubmitting(true)
      // Trim all inputs before sending
      const trimmedToken = signupToken.trim()
      const trimmedEmail = email.trim()
      const trimmedName = name.trim()
      
      // Debug: log what we're sending (remove in production)
      console.log('Signup request:', {
        email: trimmedEmail,
        name: trimmedName,
        signup_token: trimmedToken,
        password_length: password.length
      })
      
      await signup(trimmedEmail, password, trimmedName, trimmedToken)
      pushToast('Registration successful! Welcome!')
      nav('/')
    }catch(err){
      console.error('Signup error:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Registration failed'
      pushToast(errorMsg, 'error')
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
          <h1>Register New User</h1>
          <p style={{marginTop: 8, fontSize: 14, color: '#666'}}>
            Create a new account to get started
          </p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-label">Name</label>
          <div className={nameFocused ? 'focus-spacer active' : 'focus-spacer'} />
          <motion.div
            className="auth-field-wrap"
            animate={nameFocused ? { scale: 1.02 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          >
            <Textfield
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              placeholder="Enter your full name"
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
            />
          </motion.div>

          <label className="auth-label">Email</label>
          <div className={emailFocused ? 'focus-spacer active' : 'focus-spacer'} />
          <motion.div
            className="auth-field-wrap"
            animate={emailFocused ? { scale: 1.02 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          >
            <Textfield
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Enter your email"
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
              autoComplete="new-password"
              placeholder="Enter your password (min 6 characters)"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => {
                setPasswordFocused(false)
              }}
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

          <label className="auth-label">Signup Token</label>
          <div className={tokenFocused ? 'focus-spacer active' : 'focus-spacer'} />
          <motion.div
            className="auth-field-wrap"
            animate={tokenFocused ? { scale: 1.02 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          >
            <Textfield
              name="signup_token"
              type="text"
              value={signupToken}
              onChange={e => setSignupToken(e.target.value)}
              placeholder="Enter signup token"
              onFocus={() => setTokenFocused(true)}
              onBlur={() => setTokenFocused(false)}
            />
          </motion.div>
          <div style={{fontSize: 12, color: '#666', marginTop: 4, marginBottom: 8}}>
            <p style={{margin: 0}}>Contact your administrator for the signup token</p>
            {/* Development helper - show the correct token */}
            {import.meta.env.DEV && (
              <p style={{margin: '4px 0 0 0', color: '#2563eb', fontWeight: 500}}>
                Dev: Use token: <code style={{background: '#f0f0f0', padding: '2px 4px', borderRadius: 3}}>ECE1779-2025</code>
              </p>
            )}
          </div>

          <div className="auth-submit">
            <Button
              type="submit"
              appearance="primary"
              isDisabled={submitting}
            >
              {submitting ? 'Registering...' : 'Register'}
            </Button>
          </div>

          <div style={{textAlign: 'center', marginTop: 16}}>
            <p style={{fontSize: 14, color: '#666', margin: 0}}>
              Already have an account?{' '}
              <Link to="/login" style={{color: '#2563eb', textDecoration: 'none'}}>
                Login here
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
