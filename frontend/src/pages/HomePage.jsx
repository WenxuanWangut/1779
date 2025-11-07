import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@atlaskit/button'
import { useQuery } from '@tanstack/react-query'
import { listTickets } from '../api/tickets.js'
import SearchBar from '../components/SearchBar.jsx'
import EmptyState from '../components/EmptyState.jsx'
import useUI from '../context/UIContext.jsx'
import useAuth from '../hooks/useAuth.js'

export default function HomePage(){
  const { user } = useAuth()
  const { pushToast } = useUI()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  
  // Note: Backend currently doesn't have projects, so we'll show all tickets
  // In the future, this can be modified to show projects
  const { data: tickets = [], isLoading, error } = useQuery({ 
    queryKey:['tickets'], 
    queryFn: async () => {
      // Since backend doesn't have projects yet, we'll use a placeholder project ID
      // This will need to be updated when backend adds projects support
      try {
        return await listTickets('default')
      } catch (err) {
        // If projects API doesn't exist, fallback to direct tickets API
        const response = await fetch('http://localhost:8000/tickets', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        })
        if (response.ok) {
          return response.json()
        }
        throw err
      }
    },
    onError: (err) => pushToast(`Failed to load tickets: ${err.message}`, 'error')
  })

  const filteredTickets = tickets.filter(ticket => 
    !searchQuery || 
    ticket.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return <div className="center"><p>Loading...</p></div>
  }

  if (error) {
    return <div className="center"><p>Error loading data. Please try again.</p></div>
  }

  return (
    <div>
      <div style={{marginBottom: 24}}>
        <h1 style={{margin: 0, marginBottom: 8}}>Welcome, {user?.name || user?.email || 'User'}!</h1>
        <p style={{color: '#666', margin: 0}}>All Tickets</p>
      </div>

      <div style={{display:'flex',justifyContent:'center',alignItems:'center', marginBottom:16}}>
        <div style={{width: '100%', maxWidth: 400}}>
          <SearchBar onChange={setSearchQuery} placeholder="Search tickets..." />
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <EmptyState 
          title={searchQuery ? "No tickets found" : "No tickets"} 
          description={searchQuery ? "Try a different search term" : "Tickets will appear here"}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16
        }}>
          {filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              style={{
                padding: 16,
                backgroundColor: '#fff',
                borderRadius: 8,
                border: '1px solid #e1e5e9',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ':hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8}}>
                <h3 style={{margin: 0, fontSize: 16}}>{ticket.name}</h3>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 'bold',
                  backgroundColor: ticket.status === 'DONE' ? '#d4edda' : 
                                   ticket.status === 'IN_PROGRESS' ? '#d1ecf1' :
                                   ticket.status === 'WONT_DO' ? '#e2e3e5' : '#fff3cd',
                  color: ticket.status === 'DONE' ? '#155724' :
                         ticket.status === 'IN_PROGRESS' ? '#0c5460' :
                         ticket.status === 'WONT_DO' ? '#383d41' : '#856404'
                }}>
                  {ticket.status}
                </span>
              </div>
              {ticket.description && (
                <p style={{
                  margin: '8px 0',
                  color: '#666',
                  fontSize: 14,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {ticket.description}
                </p>
              )}
              {ticket.assignee && (
                <div style={{marginTop: 8, fontSize: 12, color: '#666'}}>
                  Assignee: {ticket.assignee.name || ticket.assignee.email}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

