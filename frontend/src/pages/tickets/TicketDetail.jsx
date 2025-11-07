import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '@atlaskit/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTicket, updateTicket, deleteTicket } from '../../api/tickets.js'
import SimpleTicketModal from '../../components/SimpleTicketModal.jsx'
import useUI from '../../context/UIContext.jsx'
import SimpleModal from '../../components/SimpleModal.jsx'
import Lozenge from '@atlaskit/lozenge'
import Avatar from '@atlaskit/avatar'

const STATUS_COLORS = {
  TODO: 'default',
  IN_PROGRESS: 'inprogress',
  DONE: 'success',
  WONT_DO: 'moved'
}

const STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  WONT_DO: "Won't Do"
}

export default function TicketDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const { pushToast } = useUI()
  const qc = useQueryClient()
  const [activeModal, setActiveModal] = useState(null) // 'edit', 'delete', or null
  const [isClosing, setIsClosing] = useState(false)

  // Debug: Log state changes
  useEffect(() => {
    console.log('activeModal changed:', activeModal)
    console.log('isClosing changed:', isClosing)
  }, [activeModal, isClosing])

  // Handle modal closing with delay to ensure Portal cleanup
  const closeModal = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setActiveModal(null)
      setIsClosing(false)
    }, 200) // Increased delay for Portal cleanup
  }, [])

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicket(id),
    onError: (err) => pushToast(`Failed to load ticket: ${err.message}`, 'error')
  })

  const updateMut = useMutation({
    mutationFn: (data) => updateTicket(id, data),
    onSuccess: () => {
      qc.invalidateQueries(['ticket', id])
      qc.invalidateQueries(['tickets'])
      pushToast('Ticket updated successfully!')
      setShowEditModal(false)
    },
    onError: (err) => pushToast(`Failed to update ticket: ${err.message}`, 'error')
  })

  const deleteMut = useMutation({
    mutationFn: () => deleteTicket(id),
    onSuccess: () => {
      qc.invalidateQueries(['tickets'])
      pushToast('Ticket deleted successfully!')
      navigate('/')
    },
    onError: (err) => pushToast(`Failed to delete ticket: ${err.message}`, 'error')
  })

  if (isLoading) {
    return <div className="center"><p>Loading ticket...</p></div>
  }

  if (error || !ticket) {
    return (
      <div className="center">
        <div style={{textAlign: 'center'}}>
          <h2>Ticket Not Found</h2>
          <p style={{color: '#666', marginBottom: 16}}>The ticket you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{marginBottom: 24}}>
        <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
          <Button appearance="subtle" onClick={() => navigate('/')}>← Back</Button>
          <h2 style={{margin: 0}}>Ticket #{ticket.id}</h2>
          <Lozenge appearance={STATUS_COLORS[ticket.status] || 'default'}>
            {STATUS_LABELS[ticket.status] || ticket.status}
          </Lozenge>
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 24,
        border: '1px solid #e1e5e9',
        marginBottom: 16
      }}>
        <div style={{marginBottom: 24}}>
          <h3 style={{margin: '0 0 8px 0', fontSize: 14, color: '#666'}}>Name</h3>
          <p style={{margin: 0, fontSize: 18, fontWeight: 600}}>{ticket.name}</p>
        </div>

        {ticket.description && (
          <div style={{marginBottom: 24}}>
            <h3 style={{margin: '0 0 8px 0', fontSize: 14, color: '#666'}}>Description</h3>
            <p style={{margin: 0, whiteSpace: 'pre-wrap'}}>{ticket.description}</p>
          </div>
        )}

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24}}>
          <div>
            <h3 style={{margin: '0 0 8px 0', fontSize: 14, color: '#666'}}>Status</h3>
            <Lozenge appearance={STATUS_COLORS[ticket.status] || 'default'}>
              {STATUS_LABELS[ticket.status] || ticket.status}
            </Lozenge>
          </div>

          {ticket.assignee && (
            <div>
              <h3 style={{margin: '0 0 8px 0', fontSize: 14, color: '#666'}}>Assignee</h3>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <Avatar
                  name={ticket.assignee.name || ticket.assignee.email}
                  size="small"
                />
                <span>{ticket.assignee.name || ticket.assignee.email}</span>
              </div>
            </div>
          )}

          <div>
            <h3 style={{margin: '0 0 8px 0', fontSize: 14, color: '#666'}}>Ticket ID</h3>
            <p style={{margin: 0}}>#{ticket.id}</p>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end', position: 'relative', zIndex: 1000, pointerEvents: 'auto'}}>
        <Button 
          appearance="subtle" 
          onClick={() => {
            console.log('Edit button clicked')
            if (activeModal === 'delete') {
              closeModal()
              setTimeout(() => {
                setActiveModal('edit')
              }, 250)
            } else {
              setActiveModal('edit')
            }
          }}
          disabled={isClosing}
        >
          Edit Ticket
        </Button>
        <Button 
          appearance="danger" 
          onClick={() => {
            console.log('Delete button clicked')
            if (activeModal === 'edit') {
              closeModal()
              setTimeout(() => {
                setActiveModal('delete')
              }, 250)
            } else {
              setActiveModal('delete')
            }
          }}
          disabled={isClosing}
        >
          Delete Ticket
        </Button>
      </div>

      {/* Only render one modal at a time */}
      {activeModal === 'edit' && !isClosing && ticket && (
        <SimpleTicketModal
          key={`edit-modal-${ticket.id}`}
          isOpen={true}
          onClose={closeModal}
          onSubmit={async (values) => {
            try {
              if (!ticket) {
                console.error('No ticket data available')
                return
              }
              
              console.log('Submitting ticket update:', values)
              
              // Extract status value if it's an object from Select component
              const statusValue = typeof values.status === 'object' && values.status?.value 
                ? values.status.value 
                : values.status || ticket.status
              
              await updateMut.mutateAsync({
                name: values.ticket_number || ticket.name,
                description: values.description || ticket.description || '',
                status: statusValue
              })
            } catch (error) {
              console.error('Error updating ticket:', error)
              // Error is already handled by mutation
            }
          }}
          initial={ticket || {}}
        />
      )}

      {activeModal === 'delete' && !isClosing && ticket && (
        <SimpleModal
          isOpen={true}
          title="Delete Ticket"
          onClose={closeModal}
          footer={
            <>
              <Button appearance="subtle" onClick={closeModal}>
                Cancel
              </Button>
              <Button 
                appearance="danger" 
                onClick={async () => {
                  try {
                    await deleteMut.mutateAsync()
                  } catch (error) {
                    console.error('Error deleting ticket:', error)
                    // Error is already handled by mutation
                  } finally {
                    closeModal()
                  }
                }}
              >
                Delete
              </Button>
            </>
          }
        >
          <p>Are you sure you want to delete "{ticket.name || 'this ticket'}"? This action cannot be undone.</p>
        </SimpleModal>
      )}
    </div>
  )
}

