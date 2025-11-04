import React, { createContext, useContext, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }){
  const [toasts, setToasts] = useState([])
  const pushToast = (msg, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg, type }])
  }
  const removeToast = (id) => setToasts((t) => t.filter(x => x.id !== id))
  return <UIContext.Provider value={{ toasts, pushToast, removeToast }}>{children}</UIContext.Provider>
}

export default function useUI(){ return useContext(UIContext) }
