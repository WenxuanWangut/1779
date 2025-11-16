import React, { createContext, useContext, useEffect, useState } from 'react'
import { logout as logoutAPI, signup as signupAPI } from '../api/auth.js'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    if(token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  // Load user from localStorage on mount if token exists
  // Note: Backend doesn't have /me endpoint, so we store user data in localStorage
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error('Failed to parse stored user:', error)
        }
      }
    }
    setLoading(false)
  }, [token])

  const login = async (email, password) => {
    const response = await client.post('/login', { email, password })
    // Backend returns {token, user} directly in response.data
    const { token: newToken, user: userData } = response.data
    setToken(newToken)
    setUser(userData)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    return userData
  }

  const signup = async (email, password, name, signup_token) => {
    const response = await signupAPI(email, password, name, signup_token)
    // signupAPI already returns {token, user} from .then(r=>r.data)
    const { token: newToken, user: userData } = response
    setToken(newToken)
    setUser(userData)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    return userData
  }
  
  const logout = async () => {
    try {
      await logoutAPI()
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error)
    } finally {
      setToken(null)
      setUser(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuthCtx(){ return useContext(AuthContext) }
