import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import ProjectsList from './pages/projects/ProjectsList.jsx'
import ProjectBoard from './pages/projects/ProjectBoard.jsx'
import TicketDetail from './pages/tickets/TicketDetail.jsx'
import NotFound from './pages/common/NotFound.jsx'
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
      {/* Public routes */}
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />
      
      {/* Protected routes */}
      <Route path="/" element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="projects/:id" element={<ProjectBoard />} />
        <Route path="tickets/:id" element={<TicketDetail />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
