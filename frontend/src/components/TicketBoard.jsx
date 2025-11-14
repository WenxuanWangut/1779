import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { AnimatePresence, motion } from 'framer-motion'
import Badge from '@atlaskit/badge'
import Button from '@atlaskit/button/new'
import EmptyState from './EmptyState.jsx'

const STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  WONT_DO: "Won't Do"
}

const STATUS_UI = {
  TODO: { bg: '#f3f4f6', fg: '#111827', border: '#e5e7eb' },
  IN_PROGRESS: { bg: '#dbeafe', fg: '#1e3a8a', border: '#bfdbfe' },
  DONE: { bg: '#dcfce7', fg: '#065f46', border: '#bbf7d0' },
  WONT_DO: { bg: '#f5f3ff', fg: '#5b21b6', border: '#ddd6fe' }
}

function StatusPill({ status }) {
  const ui = STATUS_UI[status] || STATUS_UI.TODO
  return (
    <div style={{ position: 'relative', height: 24, display: 'inline-flex', alignItems: 'center' }}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={status}
          initial={{ y: 10, opacity: 0, scale: 0.9, filter: 'blur(2px)' }}
          animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', backgroundColor: ui.bg, color: ui.fg, borderColor: ui.border }}
          exit={{ y: -10, opacity: 0, scale: 0.9, filter: 'blur(2px)' }}
          transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 10px',
            borderRadius: 9999,
            border: '1px solid',
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1,
            overflow: 'hidden'
          }}
        >
          <motion.span
            key={'text-'+status}
            initial={{ x: 8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -8, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ position: 'relative', zIndex: 2, whiteSpace: 'nowrap' }}
          >
            {STATUS_LABELS[status] || status}
          </motion.span>
          <motion.span
            key={'shine-'+status}
            initial={{ x: '-120%' }}
            animate={{ x: '140%' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '40%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.35) 50%, rgba(255,255,255,0) 100%)',
              zIndex: 1,
              pointerEvents: 'none'
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function AnimatedCount({ count }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={count}
        initial={{ y: -6, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 6, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        style={{ display: 'inline-block' }}
      >
        <Badge>{count}</Badge>
      </motion.div>
    </AnimatePresence>
  )
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
          <div style={{ fontSize: 12, color: '#666', marginTop: 8, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
            Assignee: {ticket.assignee ? (ticket.assignee.name || ticket.assignee.email) : <span style={{color: '#999'}}>Unassigned</span>}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <StatusPill status={ticket.status} />
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
    const count = ticketsList.length
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
            <AnimatedCount count={count} />
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