import React from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Lozenge from '@atlaskit/lozenge'
import Badge from '@atlaskit/badge'
import Button from '@atlaskit/button/new'
import EmptyState from './EmptyState.jsx'

// Ticket status colors
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

export default function TicketBoard({ tickets = [], onReorder, onEdit, onDelete, onTicketClick }) {
  // Group tickets by status
  const ticketsByStatus = {
    TODO: tickets.filter(t => t.status === 'TODO' || !t.status),
    IN_PROGRESS: tickets.filter(t => t.status === 'IN_PROGRESS'),
    DONE: tickets.filter(t => t.status === 'DONE'),
    WONT_DO: tickets.filter(t => t.status === 'WONT_DO')
  }

  const handleDragEnd = (result) => {
    if (!result.destination || !onReorder) return
    
    const { source, destination, draggableId } = result
    
    // Find the ticket that was dragged
    const ticket = tickets.find(t => String(t.id) === draggableId)
    if (!ticket) return

    // Determine new status based on destination droppable
    const newStatus = destination.droppableId
    const oldStatus = source.droppableId

    // Only trigger reorder if status changed or position changed
    if (oldStatus !== newStatus || source.index !== destination.index) {
      onReorder({
        id: ticket.id,
        from: source.index,
        to: destination.index,
        oldStatus,
        newStatus
      })
    }
  }

  const renderTicket = (ticket, index) => (
    <Draggable key={ticket.id} draggableId={String(ticket.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            backgroundColor: snapshot.isDragging ? '#f4f4f5' : 'white',
            border: '1px solid #e1e5e9',
            borderRadius: 4,
            padding: 12,
            marginBottom: 8,
            cursor: 'grab',
            boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'
          }}
          onClick={() => onTicketClick && onTicketClick(ticket)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                {ticket.ticket_number || ticket.name || `Ticket #${ticket.id}`}
              </div>
              {ticket.name && ticket.name !== ticket.ticket_number && (
                <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
                  {ticket.name}
                </div>
              )}
              {ticket.description && (
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  {ticket.description.length > 100 
                    ? `${ticket.description.substring(0, 100)}...` 
                    : ticket.description}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {onEdit && (
                <Button 
                  appearance="subtle" 
                  spacing="none"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(ticket)
                  }}
                  style={{ padding: 4 }}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button 
                  appearance="subtle" 
                  spacing="none"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(ticket.id)
                  }}
                  style={{ padding: 4 }}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
          {ticket.assignee && (
            <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              Assignee: {ticket.assignee.name || ticket.assignee.email}
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <Lozenge appearance={STATUS_COLORS[ticket.status] || 'default'}>
              {STATUS_LABELS[ticket.status] || ticket.status}
            </Lozenge>
          </div>
        </div>
      )}
    </Draggable>
  )

  const renderColumn = (status, ticketsList) => (
    <div
      key={status}
      style={{
        flex: 1,
        minWidth: 280,
        margin: '0 8px',
        backgroundColor: '#f7f8f9',
        borderRadius: 8,
        padding: 12
      }}
    >
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: 200,
              backgroundColor: snapshot.isDraggingOver ? '#e8f4f8' : 'transparent',
              borderRadius: 4,
              padding: 8,
              transition: 'background-color 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ margin: 0, fontSize: 16 }}>
                {STATUS_LABELS[status]}
              </h4>
              <Badge>{ticketsList.length}</Badge>
            </div>
            {ticketsList.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#999', 
                padding: 20,
                fontSize: 14
              }}>
                No tickets
              </div>
            ) : (
              ticketsList.map((ticket, index) => renderTicket(ticket, index))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )

  // Show empty state if no tickets at all
  if (tickets.length === 0) {
    return (
      <EmptyState 
        title="No tickets yet" 
        description="Create your first ticket to get started"
      />
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', overflowX: 'auto', padding: '8px 0' }}>
        {renderColumn('TODO', ticketsByStatus.TODO)}
        {renderColumn('IN_PROGRESS', ticketsByStatus.IN_PROGRESS)}
        {renderColumn('DONE', ticketsByStatus.DONE)}
        {renderColumn('WONT_DO', ticketsByStatus.WONT_DO)}
      </div>
    </DragDropContext>
  )
}