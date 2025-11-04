import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ProjectsList from './pages/ProjectsList.jsx'
import ProjectBoard from './pages/ProjectBoard.jsx'
import NotFound from './pages/NotFound.jsx'
import AppShell from './components/Navbar.jsx'
import useAuth from './hooks/useAuth.js'

function PrivateRoute({ children }){
  const { token, loading } = useAuth()
  if (loading) return <div className="center"><p>Loading...</p></div>
  if(!token) return <Navigate to="/login" replace />
  return children
}

export default function App(){
  const { token, loading } = useAuth()
  
  if (loading) {
    return <div className="center"><p>Loading...</p></div>
  }
  
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/projects" replace /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route index element={<Navigate to="/projects" replace />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="projects/:id" element={<ProjectBoard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
