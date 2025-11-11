import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Button from '@atlaskit/button/new'
import { listTickets } from '../api/tickets.js'
import useAuth from '../hooks/useAuth.js'
import useUI from '../context/UIContext.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function MainPage(){
  const { user } = useAuth()
  const { pushToast } = useUI()
  const navigate = useNavigate()

  const { data: tickets = [], isLoading } = useQuery({
    queryKey:['tickets'],
    queryFn: async () => {
      const normalize = (d) => Array.isArray(d) ? d : (d?.tickets || d?.results || d?.items || [])
      try {
        const data = await listTickets('default')
        return normalize(data)
      } catch (err) {
        const response = await fetch('http://localhost:8000/tickets', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          return normalize(data)
        }
        throw err
      }
    },
    onError: (err) => pushToast(`Failed to load tickets: ${err.message}`, 'error')
  })

  // Calculate statistics
  const stats = {
    total: tickets.length,
    todo: tickets.filter(t => t.status === 'TODO').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    done: tickets.filter(t => t.status === 'DONE').length
  }

  return (
    <div>
      <div style={{marginBottom: 32}}>
        <h1 style={{margin: 0, marginBottom: 8}}>Welcome, {user?.name || user?.email || 'User'}!</h1>
        <p style={{color: '#666', margin: 0}}>Here's an overview of your tasks</p>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 32
      }}>
        <div style={{
          padding: 20,
          backgroundColor: '#f7f8f9',
          borderRadius: 8,
          border: '1px solid #e1e5e9'
        }}>
          <h3 style={{margin: '0 0 8px 0', fontSize: 14, color: '#666'}}>Total Tickets</h3>
          <div style={{fontSize: 32, fontWeight: 'bold', color: '#0052CC'}}>
            {isLoading ? '...' : stats.total}
          </div>
        </div>

        <div style={{
          padding: 20,
          backgroundColor: '#fff3cd',
          borderRadius: 8,
          border: '1px solid #ffc400'
        }}>
          <h3 style={{margin: '0 0 8px 0', fontSize: 14, color: '#666'}}>To Do</h3>
          <div style={{fontSize: 32, fontWeight: 'bold', color: '#856404'}}>
            {isLoading ? '...' : stats.todo}
          </div>
        </div>

        <div style={{
          padding: 20,
          backgroundColor: '#d1ecf1',
          borderRadius: 8,
          border: '1px solid #17a2b8'
        }}>
          <h3 style={{margin: '0 0 8px 0', fontSize: 14, color: '#666'}}>In Progress</h3>
          <div style={{fontSize: 32, fontWeight: 'bold', color: '#0c5460'}}>
            {isLoading ? '...' : stats.inProgress}
          </div>
        </div>

        <div style={{
          padding: 20,
          backgroundColor: '#d4edda',
          borderRadius: 8,
          border: '1px solid #28a745'
        }}>
          <h3 style={{margin: '0 0 8px 0', fontSize: 14, color: '#666'}}>Done</h3>
          <div style={{fontSize: 32, fontWeight: 'bold', color: '#155724'}}>
            {isLoading ? '...' : stats.done}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{marginBottom: 32}}>
        <h2 style={{margin: '0 0 16px 0'}}>Quick Actions</h2>
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <Button appearance="primary" onClick={() => navigate('/projects')}>
            View All Projects
          </Button>
          <Button appearance="default" onClick={() => navigate('/projects')}>
            Manage Projects
          </Button>
        </div>
      </div>

      {/* Recent Tickets */}
      <div style={{marginBottom: 16}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
          <h2 style={{margin: 0}}>Recent Tickets</h2>
          <Button appearance="subtle" onClick={() => navigate('/projects')}>
            View All
          </Button>
        </div>

        {isLoading ? (
          <div className="center"><p>Loading tickets...</p></div>
        ) : tickets.length === 0 ? (
          <EmptyState
            title="No tickets yet"
            description="Create your first project and ticket to get started"
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16
          }}>
            {tickets.slice(0, 6).map(ticket => (
              <div
                key={ticket.id}
                style={{
                  padding: 16,
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  border: '1px solid #e1e5e9',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
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
    </div>
  )
}

