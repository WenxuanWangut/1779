import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import '../styles/dialog.css'

export default function TicketModal({ isOpen, onClose, onSubmit, initial = {} }) {
  const [ticketNumber, setTicketNumber] = useState(initial.ticket_number || initial.name || '')
  const [description, setDescription] = useState(initial.description || '')
  const [status, setStatus] = useState(initial.status || 'todo')
  const [openSelect, setOpenSelect] = useState(false)
  const wrapRef = useRef(null)

  const options = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ]

  useEffect(() => {
    if (isOpen) {
      setTicketNumber(initial.ticket_number || initial.name || '')
      setDescription(initial.description || '')
      setStatus(initial.status || 'todo')
      setOpenSelect(false)
    }
  }, [isOpen, initial])

  useEffect(() => {
    function onDocClick(e){
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target)) setOpenSelect(false)
    }
    if (openSelect) document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [openSelect])

  function handleSubmit(e) {
    e.preventDefault()
    const values = { ticket_number: ticketNumber, description, status }
    onSubmit && onSubmit(values)
  }

  const currentLabel = options.find(o => o.value === status)?.label || 'To Do'

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="dlg-root">
          <motion.div
            className="dlg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose && onClose() }}
          />
          <motion.div
            className="dlg-panel"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <form onSubmit={handleSubmit}>
              <div className="dlg-header">{initial?.id ? 'Edit Ticket' : 'New Ticket'}</div>
              <div className="dlg-body">
                <label className="dlg-label">Ticket Name</label>
                <input
                  className="dlg-input"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  autoFocus
                />

                <label className="dlg-label">Status</label>
                <div ref={wrapRef} className={`dlg-select-wrap ${openSelect ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="dlg-select-display"
                    onClick={() => setOpenSelect(v => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={openSelect}
                  >
                    <span className="dlg-select-text">{currentLabel}</span>
                    <ChevronDown className="dlg-select-icon" size={18} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openSelect && (
                      <motion.div
                        className="dlg-select-menu"
                        role="listbox"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.16 }}
                      >
                        {options.map(o => (
                          <div
                            key={o.value}
                            role="option"
                            aria-selected={status === o.value}
                            className={`dlg-option ${status === o.value ? 'selected' : ''}`}
                            onClick={() => { setStatus(o.value); setOpenSelect(false) }}
                          >
                            {o.label}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <label className="dlg-label">Description</label>
                <textarea
                  className="dlg-textarea"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="dlg-actions">
                <button type="button" className="dlg-btn dlg-btn-subtle" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="dlg-btn dlg-btn-primary" disabled={!ticketNumber.trim()}>
                  {initial?.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}