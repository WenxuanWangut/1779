import client from './client.js'
// Tickets only have: ticket_number, description
export const listTickets = (projectId) => client.get(`/projects/${projectId}/tickets`).then(r=>r.data)
export const createTicket = (projectId, payload) => client.post(`/projects/${projectId}/tickets`, payload).then(r=>r.data)
export const updateTicket = (id, patch) => client.patch(`/tickets/${id}`, patch).then(r=>r.data)
export const deleteTicket = (id) => client.delete(`/tickets/${id}`).then(r=>r.data)
export const reorderTickets = (projectId, payload) => client.patch(`/projects/${projectId}/tickets/reorder`, payload).then(r=>r.data)
