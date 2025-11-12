import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getComments, createComment, updateComment, deleteComment } from '../api/comments.js'
import Button from '@atlaskit/button/new'
import Textarea from '@atlaskit/textarea'
import Avatar from '@atlaskit/avatar'
import useUI from '../context/UIContext.jsx'
import useAuth from '../hooks/useAuth.js'
import { formatDate, formatRelativeTime } from '../utils/formatters.js'
import { ConfirmDialog } from './Dialogs.jsx'

export default function CommentSection({ ticketId }) {
  const { user } = useAuth()
  const { pushToast } = useUI()
  const qc = useQueryClient()
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({ open: false, commentId: null })

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', ticketId],
    queryFn: () => getComments(ticketId),
    onError: (err) => pushToast(`Failed to load comments: ${err.message}`, 'error')
  })

  const createMut = useMutation({
    mutationFn: (content) => createComment(ticketId, content),
    onSuccess: () => {
      qc.invalidateQueries(['comments', ticketId])
      qc.invalidateQueries(['ticket', ticketId])
      setNewComment('')
      pushToast('Comment added successfully!')
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create comment'
      pushToast(errorMsg, 'error')
    }
  })

  const updateMut = useMutation({
    mutationFn: ({ commentId, content }) => updateComment(commentId, content),
    onSuccess: () => {
      qc.invalidateQueries(['comments', ticketId])
      setEditingCommentId(null)
      setEditContent('')
      pushToast('Comment updated successfully!')
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to update comment'
      pushToast(errorMsg, 'error')
    }
  })

  const deleteMut = useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      qc.invalidateQueries(['comments', ticketId])
      qc.invalidateQueries(['ticket', ticketId])
      setDeleteDialog({ open: false, commentId: null })
      pushToast('Comment deleted successfully!')
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to delete comment'
      pushToast(errorMsg, 'error')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newComment.trim()) {
      pushToast('Comment cannot be empty', 'error')
      return
    }
    createMut.mutate(newComment.trim())
  }

  const handleEdit = (comment) => {
    setEditingCommentId(comment.id)
    setEditContent(comment.content)
  }

  const handleUpdate = (commentId) => {
    if (!editContent.trim()) {
      pushToast('Comment cannot be empty', 'error')
      return
    }
    updateMut.mutate({ commentId, content: editContent.trim() })
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditContent('')
  }

  const handleDelete = (commentId) => {
    setDeleteDialog({ open: true, commentId })
  }

  const confirmDelete = () => {
    if (deleteDialog.commentId) {
      deleteMut.mutate(deleteDialog.commentId)
    }
  }

  const isOwnComment = (comment) => {
    return user && comment.commentor && (comment.commentor.id === user.id || comment.commentor.email === user.email)
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 24,
      border: '1px solid #e1e5e9'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Comments ({comments.length})</h3>

      {/* Add new comment form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          minimumRows={3}
          isDisabled={createMut.isPending}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, gap: 8 }}>
          <Button
            type="submit"
            appearance="primary"
            isDisabled={!newComment.trim() || createMut.isPending}
          >
            {createMut.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </form>

      {/* Comments list */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 20 }}>
          <p>Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                padding: 16,
                backgroundColor: '#f7f8f9',
                borderRadius: 8,
                border: '1px solid #e1e5e9'
              }}
            >
              {editingCommentId === comment.id ? (
                // Edit mode
                <div>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    minimumRows={3}
                    isDisabled={updateMut.isPending}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, gap: 8 }}>
                    <Button
                      appearance="subtle"
                      onClick={handleCancelEdit}
                      isDisabled={updateMut.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      appearance="primary"
                      onClick={() => handleUpdate(comment.id)}
                      isDisabled={!editContent.trim() || updateMut.isPending}
                    >
                      {updateMut.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : (
                // View mode
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                    <Avatar
                      name={comment.commentor?.name || comment.commentor?.email || 'User'}
                      size="medium"
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <strong style={{ fontSize: 14 }}>
                          {comment.commentor?.name || comment.commentor?.email || 'Unknown User'}
                        </strong>
                        <span style={{ fontSize: 12, color: '#666' }}>
                          {formatRelativeTime(comment.created_at) || formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                  {isOwnComment(comment) && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                      <Button
                        appearance="subtle"
                        spacing="compact"
                        onClick={() => handleEdit(comment)}
                      >
                        Edit
                      </Button>
                      <Button
                        appearance="danger"
                        spacing="compact"
                        onClick={() => handleDelete(comment.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, commentId: null })}
        confirmLabel="Delete"
        appearance="danger"
      />
    </div>
  )
}

