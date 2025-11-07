import client from './client.js'
export const login = (email, password) => client.post('/login', { email, password }).then(r=>r.data)
export const logout = () => client.post('/logout').then(r=>r.data)
