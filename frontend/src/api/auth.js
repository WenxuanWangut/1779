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

/**
 * Search for users/assignees by name prefix
 * @param {string} prefix - Name prefix to search for (minimum 1 character)
 * @returns {Promise<Array>} Array of user objects
 */
export const searchAssignees = (prefix) => {
  if (!prefix || prefix.trim().length === 0) {
    // If no prefix, use a common character to get some users
    // This is a workaround since the API requires a prefix
    prefix = 'a'
  }
  return client.get(`/assignees?prefix=${encodeURIComponent(prefix.trim())}`).then(r => r.data)
}