import React from 'react'
import ModalDialog, { ModalBody, ModalFooter, ModalHeader } from '@atlaskit/modal-dialog'
import Button from '@atlaskit/button'
import Lozenge from '@atlaskit/lozenge'
import Avatar from '@atlaskit/avatar'
import { formatDate, formatRelativeTime } from '../utils/formatters.js'

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

export default function TicketDetailModal({ isOpen, ticket, onClose, onEdit, onDelete }) {
  if (!isOpen || !ticket) return null

  return (
    <ModalDialog onClose={onClose} width="large">
      <ModalHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>{ticket.ticket_number || ticket.name || `Ticket #${ticket.id}`}</span>
          <Lozenge appearance={STATUS_COLORS[ticket.status] || 'default'}>
            {STATUS_LABELS[ticket.status] || ticket.status}
          </Lozenge>
        </div>
      </ModalHeader>
      <ModalBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ticket.name && ticket.name !== ticket.ticket_number && (
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Name</h4>
              <p style={{ margin: 0 }}>{ticket.name}</p>
            </div>
          )}

          {ticket.description && (
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Description</h4>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
            </div>
          )}

          {ticket.assignee && (
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Assignee</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar
                  name={ticket.assignee.name || ticket.assignee.email}
                  size="small"
                />
                <span>{ticket.assignee.name || ticket.assignee.email}</span>
              </div>
            </div>
          )}

          {ticket.created_at && (
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Created</h4>
              <p style={{ margin: 0 }}>
                {formatDate(ticket.created_at)}
                {formatRelativeTime(ticket.created_at) && (
                  <span style={{ color: '#999', marginLeft: 8 }}>
                    ({formatRelativeTime(ticket.created_at)})
                  </span>
                )}
              </p>
            </div>
          )}

          {ticket.updated_at && ticket.updated_at !== ticket.created_at && (
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Last Updated</h4>
              <p style={{ margin: 0 }}>
                {formatDate(ticket.updated_at)}
                {formatRelativeTime(ticket.updated_at) && (
                  <span style={{ color: '#999', marginLeft: 8 }}>
                    ({formatRelativeTime(ticket.updated_at)})
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div>
            {onDelete && (
              <Button appearance="danger" onClick={() => onDelete(ticket.id)}>
                Delete
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button appearance="subtle" onClick={onClose}>Close</Button>
            {onEdit && (
              <Button appearance="primary" onClick={() => onEdit(ticket)}>
                Edit
              </Button>
            )}
          </div>
        </div>
      </ModalFooter>
    </ModalDialog>
  )
}
