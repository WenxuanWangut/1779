import React, { createContext, useContext, useEffect, useState } from 'react'
import { me, logout as logoutAPI } from '../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    if(token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  // Load user profile on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const profile = await me()
          setUser(profile)
        } catch (error) {
          // Token might be invalid, clear it
          setToken(null)
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [token])

  const login = async (t, u) => { 
    setToken(t)
    setUser(u)
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
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuthCtx(){ return useContext(AuthContext) }
