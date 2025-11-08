import client from './client.js'

/**
 * List all tickets, optionally filtered by project
 * Backend returns tickets grouped by status: { TODO: [...], IN_PROGRESS: [...], DONE: [...], WONT_DO: [...] }
 * This function flattens them into a single array and filters by projectId if provided
 */
export const listTickets = async (projectId) => {
  const groupedTickets = await client.get('/tickets').then(r => r.data)
  
  // Flatten all tickets from grouped response
  const allTickets = Object.values(groupedTickets).flat()
  
  // Filter by project if projectId is provided
  if (projectId) {
    return allTickets.filter(ticket => ticket.project?.id === projectId)
  }
  
  return allTickets
}

/**
 * Get a single ticket by ID
 * Since backend doesn't have a dedicated endpoint, we fetch all and filter
 */
export const getTicket = async (id) => {
  const tickets = await listTickets()
  return tickets.find(t => t.id === parseInt(id)) || null
}

/**
 * Create a new ticket
 * Required: name, description, project_id
 * Optional: status (defaults to TODO), assignee_id
 */
export const createTicket = async (projectId, payload) => {
  // Ensure project_id is included in the payload
  const data = {
    ...payload,
    project_id: projectId || payload.project_id
  }
  return client.post('/tickets/create', data).then(r => r.data)
}

/**
 * Update a ticket
 * Optional fields: name, description, status, project_id, assignee_id
 */
export const updateTicket = (id, patch) => client.patch(`/tickets/${id}`, patch).then(r => r.data)

/**
 * Delete a ticket
 */
export const deleteTicket = (id) => client.delete(`/tickets/${id}/delete`).then(r => r.data)

/**
 * Reorder tickets (not yet supported by backend)
 * This is a placeholder for drag-and-drop functionality
 */
export const reorderTickets = async (projectId, payload) => {
  // TODO: Implement backend support for ticket reordering
  console.warn('Ticket reordering is not yet supported by the backend')
  return Promise.resolve()
}
