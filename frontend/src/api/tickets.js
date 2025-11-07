import client from './client.js'

// Since backend doesn't have projects yet, we'll adapt the API calls
// Backend has: GET /tickets (all tickets)
export const listTickets = async (projectId) => {
  // For now, ignore projectId and get all tickets
  return client.get('/tickets').then(r => r.data)
}

export const getTicket = async (id) => {
  // Backend doesn't have GET /tickets/:id, so we'll get all and filter
  // In the future, backend should add this endpoint
  const tickets = await client.get('/tickets').then(r => r.data)
  return tickets.find(t => t.id === parseInt(id)) || null
}

export const createTicket = async (projectId, payload) => {
  // Backend endpoint: POST /tickets/create
  return client.post('/tickets/create', payload).then(r => r.data)
}

export const updateTicket = (id, patch) => client.patch(`/tickets/${id}`, patch).then(r => r.data)

export const deleteTicket = (id) => client.delete(`/tickets/${id}/delete`).then(r => r.data)

// Note: Backend doesn't support reorder yet
export const reorderTickets = async (projectId, payload) => {
  // Placeholder - would need backend support
  return Promise.resolve()
}
