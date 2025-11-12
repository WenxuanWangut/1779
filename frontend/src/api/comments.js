import client from './client.js'

/**
 * Get all comments for a specific ticket
 */
export const getComments = (ticketId) => 
  client.get(`/tickets/${ticketId}/comments`).then(r => r.data)

/**
 * Create a new comment on a ticket
 * Required: content
 */
export const createComment = (ticketId, content) => 
  client.post(`/tickets/${ticketId}/comments/create`, { content }).then(r => r.data)

/**
 * Update a comment
 * Only the commentor can update their own comment
 * Required: content
 */
export const updateComment = (commentId, content) => 
  client.patch(`/comments/${commentId}`, { content }).then(r => r.data)

/**
 * Delete a comment
 * Only the commentor can delete their own comment
 */
export const deleteComment = (commentId) => 
  client.delete(`/comments/${commentId}/delete`).then(r => r.data)

