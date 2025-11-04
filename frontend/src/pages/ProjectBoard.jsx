import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Button from '@atlaskit/button'
import TicketBoard from '../components/TicketBoard.jsx'
import TicketModal from '../components/TicketModal.jsx'
import TicketFilters from '../components/TicketFilters.jsx'
import TicketDetailModal from '../components/TicketDetailModal.jsx'
import { listTickets, createTicket, updateTicket, reorderTickets, deleteTicket } from '../api/tickets.js'
import useSocket from '../hooks/useSocket.js'
import useUI from '../context/UIContext.jsx'
import { ConfirmDialog } from '../components/Dialogs.jsx'

export default function ProjectBoard(){
  const { id } = useParams()
  const [tickets, setTickets] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [editingTicket, setEditingTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [socketConnected, setSocketConnected] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, ticketId: null })
  const [filters, setFilters] = useState({ search: '', status: null, assignee: null })
  const { pushToast } = useUI()

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listTickets(id)
      setTickets(data)
    } catch (error) {
      pushToast(`Failed to load tickets: ${error.response?.data?.message || error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }, [id, pushToast])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Filter tickets based on filter state
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

  // Real-time Socket.IO integration
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
      setTickets(prev => prev.map(t => 
        t.id === event.payload.id ? event.payload : t
      ))
      pushToast('Ticket updated')
    } else if (event.type === 'ticket.deleted') {
      setTickets(prev => prev.filter(t => t.id !== event.payload))
      pushToast('Ticket deleted')
    }
  })

  async function onReorder({ id: ticketId, from, to, oldStatus, newStatus }){
    try {
      // Update status if changed
      if (oldStatus !== newStatus) {
        await updateTicket(ticketId, { status: newStatus })
      }
      
      // Reorder within the same column or update position
      await reorderTickets(id, { start: from, end: to })
      
      // Refresh to get latest state
      refresh()
    } catch (error) {
      pushToast(`Failed to reorder ticket: ${error.response?.data?.message || error.message}`, 'error')
      refresh() // Refresh on error to reset UI
    }
  }

  async function onCreate(values){
    try {
      await createTicket(id, {
        ticket_number: values.ticket_number,
        description: values.description || '',
        name: values.ticket_number // Use ticket_number as name if name not provided
      })
      setModalOpen(false)
      pushToast('Ticket created successfully')
      refresh()
    } catch (error) {
      pushToast(`Failed to create ticket: ${error.response?.data?.message || error.message}`, 'error')
    }
  }

  function handleTicketClick(ticket){
    setSelectedTicket(ticket)
    setDetailModalOpen(true)
  }

  function handleEditFromDetail(ticket){
    setDetailModalOpen(false)
    setEditingTicket(ticket)
    setModalOpen(true)
  }

  function handleDeleteFromDetail(ticketId){
    setDetailModalOpen(false)
    setDeleteDialog({ open: true, ticketId })
  }

  async function onEdit(ticket){
    setEditingTicket(ticket)
    setModalOpen(true)
  }

  async function onUpdate(values){
    try {
      await updateTicket(editingTicket.id, {
        ticket_number: values.ticket_number,
        description: values.description || '',
        name: values.ticket_number,
        status: values.status
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
      if (detailModalOpen) {
        setDetailModalOpen(false)
        setSelectedTicket(null)
      }
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
          <h3 style={{ margin: 0 }}>Project #{id}</h3>
          <div style={{ fontSize: 12, color: socketConnected ? '#0E8750' : '#999', marginTop: 4 }}>
            {socketConnected ? '● Real-time updates active' : '○ Connecting...'}
          </div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <Button appearance="primary" onClick={()=>setModalOpen(true)}>New Ticket</Button>
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
          onEdit={onEdit}
          onDelete={handleDeleteClick}
          onTicketClick={handleTicketClick}
        />
      )}
      <TicketModal 
        isOpen={modalOpen} 
        onClose={handleModalClose} 
        onSubmit={handleModalSubmit}
        initial={editingTicket || {}}
      />
      <TicketDetailModal
        isOpen={detailModalOpen}
        ticket={selectedTicket}
        onClose={() => {
          setDetailModalOpen(false)
          setSelectedTicket(null)
        }}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />
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
