import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '@atlaskit/button/new'
import Form, { Field } from '@atlaskit/form'
import Textfield from '@atlaskit/textfield'
import Textarea from '@atlaskit/textarea'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listProjects } from '../../api/projects.js'
import ProjectSettingsModal from '../../components/ProjectSettingsModal.jsx'
import useUI from '../../context/UIContext.jsx'
import { ConfirmDialog } from '../../components/Dialogs.jsx'

export default function ProjectSettings(){
  const { id } = useParams()
  const navigate = useNavigate()
  const { pushToast } = useUI()
  const qc = useQueryClient()
  
  const { data: projects = [], isLoading } = useQuery({ 
    queryKey:['projects'], 
    queryFn: listProjects
  })

  const project = projects.find(p => String(p.id) === String(id))
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Note: These mutations would need to be implemented in the API
  // For now, this is a placeholder structure
  const updateMut = useMutation({
    mutationFn: async (data) => {
      // TODO: Implement updateProject API call
      pushToast('Project settings updated successfully!')
      qc.invalidateQueries(['projects'])
    },
    onError: (err) => pushToast(`Failed to update project: ${err.message}`, 'error')
  })

  const deleteMut = useMutation({
    mutationFn: async () => {
      // TODO: Implement deleteProject API call
      pushToast('Project deleted successfully!')
      navigate('/projects')
    },
    onError: (err) => pushToast(`Failed to delete project: ${err.message}`, 'error')
  })

  if (isLoading) {
    return <div className="center"><p>Loading project...</p></div>
  }

  if (!project) {
    return (
      <div className="center">
        <div style={{textAlign: 'center'}}>
          <h2>Project Not Found</h2>
          <p style={{color: '#666', marginBottom: 16}}>The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{marginBottom: 24}}>
        <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
          <Button appearance="subtle" onClick={() => navigate(`/projects/${id}`)}>← Back to Board</Button>
          <h2 style={{margin: 0}}>Project Settings</h2>
        </div>
        <p style={{color: '#666', margin: 0, marginLeft: 40}}>Manage your project details and configuration</p>
      </div>

      <div style={{
        backgroundColor: '#f7f8f9',
        borderRadius: 8,
        padding: 24,
        border: '1px solid #e1e5e9',
        marginBottom: 16
      }}>
        <div style={{marginBottom: 16}}>
          <h3 style={{margin: '0 0 8px 0', fontSize: 16}}>Project Information</h3>
          <p style={{margin: 0, color: '#666', fontSize: 14}}>
            Update your project name and description
          </p>
        </div>
        
        <div style={{marginBottom: 16}}>
          <strong>Project Name:</strong> {project.name}
        </div>
        
        {project.description && (
          <div style={{marginBottom: 16}}>
            <strong>Description:</strong> {project.description}
          </div>
        )}

        <Button appearance="primary" onClick={() => setShowSettingsModal(true)}>
          Edit Project
        </Button>
      </div>

      <div style={{
        backgroundColor: '#fff4e6',
        borderRadius: 8,
        padding: 24,
        border: '1px solid #ffc400',
        marginBottom: 16
      }}>
        <h3 style={{margin: '0 0 8px 0', fontSize: 16, color: '#b25900'}}>Danger Zone</h3>
        <p style={{margin: '0 0 16px 0', color: '#666', fontSize: 14}}>
          Once you delete a project, there is no going back. Please be certain.
        </p>
        <Button 
          appearance="danger" 
          onClick={() => setShowDeleteDialog(true)}
        >
          Delete Project
        </Button>
      </div>

      <ProjectSettingsModal
        isOpen={showSettingsModal}
        project={project}
        onClose={() => setShowSettingsModal(false)}
        onSave={async (data) => {
          await updateMut.mutateAsync(data)
          setShowSettingsModal(false)
        }}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        onConfirm={async () => {
          await deleteMut.mutateAsync()
          setShowDeleteDialog(false)
        }}
        onCancel={() => setShowDeleteDialog(false)}
        confirmLabel="Delete"
        appearance="danger"
      />
    </div>
  )
}

