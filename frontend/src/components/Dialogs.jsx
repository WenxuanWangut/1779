import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import '../styles/dialog.css'

function ModalBase({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose()
    }
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = original
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="dlg-root">
          <motion.div
            className="dlg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose && onClose()
            }}
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
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  appearance = 'danger'
}) {
  const confirmClass =
    appearance === 'danger'
      ? 'dlg-btn dlg-btn-danger'
      : 'dlg-btn dlg-btn-primary'

  return (
    <ModalBase open={isOpen} onClose={onCancel}>
      <div className="dlg-header">{title}</div>
      <div className="dlg-body">
        <p className="dlg-text">{message}</p>
      </div>
      <div className="dlg-actions">
        <button className="dlg-btn dlg-btn-subtle" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button className={confirmClass} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </ModalBase>
  )
}

export function PromptDialog({
  isOpen,
  title,
  message,
  onSubmit,
  onCancel,
  submitLabel = 'Create',
  cancelLabel = 'Cancel',
  placeholder = '',
  defaultValue = ''
}) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if (isOpen) setValue(defaultValue || '')
  }, [isOpen, defaultValue])

  return (
    <ModalBase open={isOpen} onClose={onCancel}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (value.trim()) onSubmit && onSubmit(value.trim())
        }}
      >
        <div className="dlg-header">{title}</div>
        <div className="dlg-body">
          <p className="dlg-text">{message}</p>
          <input
            className="dlg-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
        </div>
        <div className="dlg-actions">
          <button type="button" className="dlg-btn dlg-btn-subtle" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="submit" className="dlg-btn dlg-btn-primary" disabled={!value.trim()}>
            {submitLabel}
          </button>
        </div>
      </form>
    </ModalBase>
  )
}