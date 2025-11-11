import React, { createContext, useContext, useMemo } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UIContext = createContext(null)

export function UIProvider({ children }){
  const value = useMemo(() => ({
    pushToast: (msg, type = 'success') => {
      const fn = type === 'success' ? toast.success
        : type === 'error' ? toast.error
        : type === 'info' ? toast.info
        : type === 'warn' || type === 'warning' ? toast.warn
        : toast
      const id = fn(msg)
      return id
    },
    removeToast: (id) => toast.dismiss(id),
    toasts: []
  }), [])

  return (
    <UIContext.Provider value={value}>
      {children}
      <ToastContainer position="bottom-right" newestOnTop limit={3} closeButton={false} closeOnClick autoClose={2000} />
    </UIContext.Provider>
  )
}

export default function useUI(){ return useContext(UIContext) }