import React, { useEffect, useRef } from 'react'
import Button from '@atlaskit/button/new'

/**
 * Simple Modal component that avoids Portal conflicts
 * Uses a simple overlay approach instead of Atlaskit's Portal-based ModalDialog
 */
export default function SimpleModal({ isOpen, onClose, title, children, footer }) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus trap and escape key handling
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e1e5e9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{title}</h2>
            <Button appearance="subtle" onClick={onClose}>×</Button>
          </div>
        )}
        <div style={{ padding: '20px', flex: 1 }}>
          {children}
        </div>
        {footer && (
          <div style={{
            padding: '20px',
            borderTop: '1px solid #e1e5e9',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

