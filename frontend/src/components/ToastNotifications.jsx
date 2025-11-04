import React, { useEffect } from 'react'
import Flag, { FlagGroup } from '@atlaskit/flag'
import useUI from '../context/UIContext.jsx'

export default function ToastNotifications() {
  const { toasts, removeToast } = useUI()

  useEffect(() => {
    const timers = toasts.map(toast => {
      return setTimeout(() => {
        removeToast(toast.id)
      }, 5000) // Auto-dismiss after 5 seconds
    })
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [toasts, removeToast])

  return (
    <FlagGroup>
      {toasts.map(toast => (
        <Flag
          key={toast.id}
          id={toast.id}
          title={toast.msg}
          appearance={toast.type === 'error' ? 'error' : 'success'}
          actions={[
            {
              content: 'Dismiss',
              onClick: () => removeToast(toast.id)
            }
          ]}
        />
      ))}
    </FlagGroup>
  )
}
