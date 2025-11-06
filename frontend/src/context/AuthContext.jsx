import React, { createContext, useContext, useEffect, useState } from 'react'
import { me, logout as logoutAPI } from '../api/auth.js'
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

//  const login = (t, u) => { 
//    setToken(t)
//    setUser(u)
//  }
  const login = async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password })
    // save token so the interceptor can attach it on subsequent requests
    setToken(data.token)
    localStorage.setItem('token', data.token)        // <-- THIS is missing on your side
    setUser(data.user)
    return data.user
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

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) return
    client.get('/auth/me').then(r => setUser(r.data)).catch(() => logout())
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuthCtx(){ return useContext(AuthContext) }
