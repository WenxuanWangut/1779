import client from './client.js'
export const login = (email, password) => client.post('/login', { email, password }).then(r=>r.data)
export const logout = () => client.post('/logout').then(r=>r.data)
export const signup = (email, password, name, signup_token) => {
  const payload = { email, password, name, signup_token }
  // Debug log in development
  if (import.meta.env.DEV) {
    console.log('Signup API call with payload:', { ...payload, password: '[REDACTED]' })
  }
  return client.post('/signup', payload).then(r=>r.data)
}
