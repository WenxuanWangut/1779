import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Lozenge from '@atlaskit/lozenge'
import Badge from '@atlaskit/badge'
import Button from '@atlaskit/button/new'
import EmptyState from './EmptyState.jsx'

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
  const [activeDropId, setActiveDropId] = useState(null)
  const [sourceDropId, setSourceDropId] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const ticketsByStatus = {
    TODO: tickets.filter(t => t.status === 'TODO' || !t.status),
    IN_PROGRESS: tickets.filter(t => t.status === 'IN_PROGRESS'),
    DONE: tickets.filter(t => t.status === 'DONE'),
    WONT_DO: tickets.filter(t => t.status === 'WONT_DO')
  }

  const handleDragStart = (start) => {
    setIsDragging(true)
    setSourceDropId(start.source.droppableId)
    setActiveDropId(start.source.droppableId)
  }

  const handleDragEnd = (result) => {
    if (result.destination && onReorder) {
      const { source, destination, draggableId } = result
      const ticket = tickets.find(t => String(t.id) === draggableId)
      if (ticket) {
        const newStatus = destination.droppableId
        const oldStatus = source.droppableId
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
    }
    setIsDragging(false)
    setActiveDropId(null)
    setSourceDropId(null)
  }

  const handleDragUpdate = (update) => {
    setActiveDropId(update.destination ? update.destination.droppableId : null)
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
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
            cursor: 'grab',
            boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0
          }}
          onClick={() => onTicketClick && onTicketClick(ticket)}
        >
          <div style={{ fontWeight: 600, marginBottom: 4, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
            {ticket.ticket_number || ticket.name || `Ticket #${ticket.id}`}
          </div>
          {ticket.name && ticket.name !== ticket.ticket_number && (
            <div style={{ fontSize: 14, color: '#666', marginBottom: 4, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              {ticket.name}
            </div>
          )}
          {ticket.description && (
            <div style={{ fontSize: 12, color: '#888', marginTop: 4, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              {ticket.description.length > 100 ? `${ticket.description.substring(0, 100)}...` : ticket.description}
            </div>
          )}
          {ticket.assignee && (
            <div style={{ fontSize: 12, color: '#666', marginTop: 8, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              Assignee: {ticket.assignee.name || ticket.assignee.email}
            </div>
          )}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <Lozenge appearance={STATUS_COLORS[ticket.status] || 'default'}>
              {STATUS_LABELS[ticket.status] || ticket.status}
            </Lozenge>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {onEdit && (
                <Button
                  appearance="subtle"
                  spacing="none"
                  onClick={(e) => { e.stopPropagation(); onEdit(ticket) }}
                  style={{ padding: 4 }}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  appearance="danger"
                  spacing="none"
                  onClick={(e) => { e.stopPropagation(); onDelete(ticket.id) }}
                  style={{ padding: 4 }}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )

  const renderColumn = (status, ticketsList) => {
    const isActive = activeDropId === status
    return (
      <div key={status} style={{ width: '100%', minWidth: 0 }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: 12,
            boxShadow: '0 4px 10px rgba(2,6,23,0.04)',
            transition: 'box-shadow 0.18s ease, border-color 0.18s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: 16 }}>{STATUS_LABELS[status]}</h4>
            <Badge>{ticketsList.length}</Badge>
          </div>
          <Droppable droppableId={status}>
            {(provided) => {
              const isSource = sourceDropId === status
              const hideSourcePlaceholder = isSource && isDragging && (activeDropId === null || activeDropId !== status)
              return (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minHeight: 200,
                    backgroundColor: isActive ? '#e8f4f8' : '#f7f8f9',
                    borderRadius: 6,
                    padding: 8,
                    transition: 'background-color 0.18s ease, outline-color 0.18s ease',
                    outline: isActive ? '2px solid rgba(59,130,246,0.35)' : '2px solid transparent',
                    outlineOffset: 0
                  }}
                >
                  {ticketsList.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#999', padding: 20, fontSize: 14 }}>
                      No tickets
                    </div>
                  ) : (
                    ticketsList.map((ticket, index) => renderTicket(ticket, index))
                  )}
                  {!hideSourcePlaceholder && provided.placeholder}
                </div>
              )
            }}
          </Droppable>
        </div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return <EmptyState title="No tickets yet" description="Create your first ticket to get started" />
  }

  return (
    <DragDropContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragUpdate={handleDragUpdate}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 12,
          alignItems: 'start',
          padding: '8px 0'
        }}
      >
        {renderColumn('TODO', ticketsByStatus.TODO)}
        {renderColumn('IN_PROGRESS', ticketsByStatus.IN_PROGRESS)}
        {renderColumn('DONE', ticketsByStatus.DONE)}
        {renderColumn('WONT_DO', ticketsByStatus.WONT_DO)}
      </div>
    </DragDropContext>
  )
}