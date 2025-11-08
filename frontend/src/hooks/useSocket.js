import { useEffect, useRef } from 'react'
// import { io } from 'socket.io-client'
import useAuth from './useAuth.js'
// import { API_BASE } from '../utils/constants.js'

/**
 * WebSocket hook - DISABLED
 * Backend does not currently support WebSocket connections.
 * This hook is stubbed out to prevent connection errors.
 * 
 * To enable real-time updates:
 * 1. Add WebSocket support to Django backend (using channels/daphne)
 * 2. Uncomment the socket.io-client code below
 */
export default function useSocket(projectId, onEvent){
  const { token } = useAuth()
  const socketRef = useRef(null)
  const onEventRef = useRef(onEvent)
  
  // Keep event handler ref updated
  useEffect(() => {
    onEventRef.current = onEvent
  }, [onEvent])

  useEffect(() => {
    // WebSocket functionality is disabled
    // The backend does not support WebSockets yet
    console.debug('WebSocket is disabled - backend does not support real-time connections')
    
    // Return cleanup function (does nothing)
    return () => {
      // No socket to disconnect
    }
  }, [token, projectId])

  return socketRef.current
}

/* ORIGINAL WEBSOCKET CODE - COMMENTED OUT
export default function useSocket(projectId, onEvent){
  const { token } = useAuth()
  const socketRef = useRef(null)
  const onEventRef = useRef(onEvent)
  
  useEffect(() => {
    onEventRef.current = onEvent
  }, [onEvent])

  useEffect(() => {
    if(!token || !projectId) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      return
    }

    let socketUrl
    if (typeof window !== 'undefined') {
      socketUrl = API_BASE.replace('/api', '') || window.location.origin
    } else {
      socketUrl = API_BASE.replace('/api', '') || 'http://localhost:3000'
    }
    
    const socket = io(socketUrl, { 
      auth: { token }, 
      query: { projectId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    socketRef.current = socket

    socket.on('connect', () => {
      onEventRef.current?.({ type: 'connect' })
    })

    socket.on('disconnect', (reason) => {
      onEventRef.current?.({ type: 'disconnect', reason })
    })

    socket.on('connect_error', (error) => {
      onEventRef.current?.({ type: 'error', error: error.message })
    })

    socket.on('ticket.updated', (payload) => {
      onEventRef.current?.({ type: 'ticket.updated', payload })
    })

    socket.on('ticket.created', (payload) => {
      onEventRef.current?.({ type: 'ticket.created', payload })
    })

    socket.on('ticket.deleted', (payload) => {
      onEventRef.current?.({ type: 'ticket.deleted', payload })
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [token, projectId])

  return socketRef.current
}
*/
