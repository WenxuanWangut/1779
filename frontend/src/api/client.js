import axios from 'axios'
import { API_BASE } from '../utils/constants.js'

const client = axios.create({ 
  baseURL: API_BASE,
  timeout: 30000 // 30 second timeout
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Token ${token}`
  return config
})

client.interceptors.response.use(
  (r) => r,
  (err) => {
    // Handle network errors
    if (!err.response) {
      err.message = err.code === 'ECONNABORTED' 
        ? 'Request timeout. Please try again.' 
        : 'Network error. Please check your connection.'
      return Promise.reject(err)
    }

    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      // Only redirect if we're not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    // Improve error message extraction
    if (err.response?.data?.message) {
      err.message = err.response.data.message
    } else if (err.response?.data?.error) {
      err.message = err.response.data.error
    } else if (err.response?.status) {
      // Provide user-friendly status messages
      const statusMessages = {
        400: 'Bad request. Please check your input.',
        403: 'You do not have permission to perform this action.',
        404: 'Resource not found.',
        500: 'Server error. Please try again later.',
        502: 'Service unavailable. Please try again later.',
        503: 'Service temporarily unavailable.'
      }
      err.message = statusMessages[err.response.status] || `Error ${err.response.status}`
    } else if (err.message) {
      // Keep original message
    } else {
      err.message = 'An unexpected error occurred'
    }
    return Promise.reject(err)
  }
)

export default client
