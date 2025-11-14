// frontend/src/pages/projects/ProjectBoard.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '@atlaskit/button/new'
import TicketBoard from '../../components/TicketBoard.jsx'
import TicketModal from '../../components/TicketModal.jsx'
import TicketFilters from '../../components/TicketFilters.jsx'
import { listTickets, createTicket, updateTicket, reorderTickets, deleteTicket } from '../../api/tickets.js'
import { getProject } from '../../api/projects.js'
import useSocket from '../../hooks/useSocket.js'
import useUI from '../../context/UIContext.jsx'
import { ConfirmDialog } from '../../components/Dialogs.jsx'

export default function ProjectBoard(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [project, setProject] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [socketConnected, setSocketConnected] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, ticketId: null })
  const [filters, setFilters] = useState({ search: '', status: null, assignee: null })
  const { pushToast } = useUI()

  const refresh = useCallback(async (opts = { loading: true }) => {
    try {
      if (opts.loading) setLoading(true)
      const [ticketsData, projectData] = await Promise.all([
        listTickets(id),
        getProject(id)
      ])
      setTickets(ticketsData)
      setProject(projectData)
    } catch (error) {
      pushToast(`Failed to load data: ${error.response?.data?.message || error.message}`, 'error')
    } finally {
      if (opts.loading) setLoading(false)
    }
  }, [id, pushToast])

  useEffect(() => {
    refresh()
  }, [refresh])

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = !filters.search || 
        ticket.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.ticket_number?.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(filters.search.toLowerCase())
      const matchesStatus = !filters.status || ticket.status === filters.status
      const matchesAssignee = !filters.assignee || ticket.assignee?.id === filters.assignee
      return matchesSearch && matchesStatus && matchesAssignee
    })
  }, [tickets, filters])

  useSocket(id, (event) => {
    if (event.type === 'connect') {
      setSocketConnected(true)
      pushToast('Connected to real-time updates')
    } else if (event.type === 'disconnect') {
      setSocketConnected(false)
      pushToast('Disconnected from real-time updates', 'error')
    } else if (event.type === 'error') {
      pushToast(`Socket error: ${event.error}`, 'error')
    } else if (event.type === 'ticket.created') {
      setTickets(prev => [...prev, event.payload])
      pushToast('New ticket created')
    } else if (event.type === 'ticket.updated') {
      setTickets(prev => prev.map(t => t.id === event.payload.id ? event.payload : t))
      pushToast('Ticket updated')
    } else if (event.type === 'ticket.deleted') {
      setTickets(prev => prev.filter(t => t.id !== event.payload))
      pushToast('Ticket deleted')
    }
  })

  useEffect(() => {
    setSocketConnected(true)
  }, [])

  function applyLocalMove(prev, { id: ticketId, from, to, oldStatus, newStatus }) {
    const norm = (s) => s || 'TODO'
    const groups = { TODO: [], IN_PROGRESS: [], DONE: [], WONT_DO: [] }
    prev.forEach(t => {
      const key = norm(t.status)
      groups[key].push(t)
    })
    const fromList = groups[norm(oldStatus)]
    const idx = fromList.findIndex(t => t.id === ticketId)
    if (idx === -1) return prev
    let moving = fromList.splice(idx, 1)[0]
    if (norm(oldStatus) !== norm(newStatus)) moving = { ...moving, status: newStatus }
    const toList = groups[norm(newStatus)]
    const insert = Math.min(Math.max(to, 0), toList.length)
    toList.splice(insert, 0, moving)
    return [...groups.TODO, ...groups.IN_PROGRESS, ...groups.DONE, ...groups.WONT_DO]
  }

  async function onReorder({ id: ticketId, from, to, oldStatus, newStatus }){
    const snapshot = tickets
    setTickets(prev => applyLocalMove(prev, { id: ticketId, from, to, oldStatus, newStatus }))
    try {
      if (oldStatus !== newStatus) {
        await updateTicket(ticketId, { status: newStatus })
      }
      await reorderTickets(id, { start: from, end: to, status: newStatus })
    } catch (error) {
      setTickets(snapshot)
      pushToast(`Failed to reorder ticket: ${error.response?.data?.message || error.message}`, 'error')
    }
  }

  async function onCreate(values){
    try {
      // Convert status from lowercase to uppercase (todo -> TODO)
      const statusMap = {
        'todo': 'TODO',
        'in_progress': 'IN_PROGRESS',
        'done': 'DONE',
        'wont_do': 'WONT_DO'
      }
      const statusValue = statusMap[values.status?.toLowerCase()] || 'TODO'
      
      // Ensure name is not empty
      const ticketName = values.ticket_number || values.name || 'Untitled Ticket'
      
      // Description is optional (backend allows blank)
      const ticketDescription = values.description?.trim() || ''
      
      await createTicket(id, {
        name: ticketName,
        description: ticketDescription,
        status: statusValue
      })
      setModalOpen(false)
      pushToast('Ticket created successfully')
      refresh()
    } catch (error) {
      // Show detailed error message from backend
      const errorMsg = error.response?.data?.error || 
                      error.response?.data?.message || 
                      error.message || 
                      'Failed to create ticket'
      pushToast(errorMsg, 'error')
      console.error('Create ticket error:', error.response?.data || error)
    }
  }

  function handleTicketClick(ticket){
    navigate(`/tickets/${ticket.id}`, { state: { from: 'project', projectId: id } })
  }

  async function onEdit(ticket){
    setEditingTicket(ticket)
    setModalOpen(true)
  }

  async function onUpdate(values){
    try {
      const statusValue = typeof values.status === 'object' && values.status?.value 
        ? values.status.value 
        : values.status || editingTicket.status
      await updateTicket(editingTicket.id, {
        name: values.ticket_number || editingTicket.name,
        description: values.description || editingTicket.description || '',
        status: statusValue
      })
      setModalOpen(false)
      setEditingTicket(null)
      pushToast('Ticket updated successfully')
      refresh()
    } catch (error) {
      pushToast(`Failed to update ticket: ${error.response?.data?.message || error.message}`, 'error')
    }
  }

  function handleDeleteClick(ticketId){
    setDeleteDialog({ open: true, ticketId })
  }

  async function confirmDelete(){
    try {
      await deleteTicket(deleteDialog.ticketId)
      pushToast('Ticket deleted successfully')
      setDeleteDialog({ open: false, ticketId: null })
      refresh()
    } catch (error) {
      pushToast(`Failed to delete ticket: ${error.response?.data?.message || error.message}`, 'error')
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingTicket(null)
  }

  const handleModalSubmit = editingTicket ? onUpdate : onCreate

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 4}}>
            <Button appearance="subtle" onClick={() => navigate('/projects')}>← Back to projects</Button>
            <h3 style={{ margin: 0 }}>{project ? project.name : 'Loading...'}</h3>
          </div>
          <div style={{ fontSize: 12, color: socketConnected ? '#0E8750' : '#999', marginLeft: 40 }}>
            {socketConnected ? '● Real-time updates active' : '○ Connecting...'}
          </div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <Button appearance="primary" onClick={() => setModalOpen(true)}>New Ticket</Button>
        </div>
      </div>
      {tickets.length > 0 && (
        <TicketFilters 
          tickets={tickets} 
          onFilterChange={setFilters}
          filters={filters}
        />
      )}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p>Loading tickets...</p>
        </div>
      ) : (
        <TicketBoard 
          tickets={filteredTickets} 
          onReorder={onReorder}
          onTicketClick={handleTicketClick}
        />
      )}
      {modalOpen && (
        <TicketModal 
          isOpen={modalOpen} 
          onClose={handleModalClose} 
          onSubmit={handleModalSubmit}
          initial={editingTicket || {}}
        />
      )}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete Ticket"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, ticketId: null })}
        confirmLabel="Delete"
        appearance="danger"
      />
    </div>
  )
}