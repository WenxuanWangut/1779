import React, { useState } from 'react'
import Button from '@atlaskit/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listProjects, createProject, deleteProject } from '../api/projects.js'
import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar.jsx'
import EmptyState from '../components/EmptyState.jsx'
import useUI from '../context/UIContext.jsx'
import PromptDialog from '../components/Dialogs.jsx'
import ConfirmDialog from '../components/Dialogs.jsx'

export default function ProjectsList(){
  const qc = useQueryClient()
  const [q, setQ] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, project: null })
  const { pushToast } = useUI()
  
  const { data = [], isLoading, error } = useQuery({ 
    queryKey:['projects'], 
    queryFn: listProjects,
    onError: (err) => pushToast(`Failed to load projects: ${err.message}`, 'error')
  })
  
  const filtered = data.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))

  const createMut = useMutation({ 
    mutationFn: (name)=> createProject(name), 
    onSuccess:()=> {
      qc.invalidateQueries(['projects'])
      pushToast('Project created successfully!')
      setShowCreateDialog(false)
    },
    onError: (err) => pushToast(`Failed to create project: ${err.message}`, 'error')
  })
  
  const delMut = useMutation({ 
    mutationFn: (id)=> deleteProject(id), 
    onSuccess:()=> {
      qc.invalidateQueries(['projects'])
      pushToast('Project deleted successfully!')
      setDeleteDialog({ open: false, project: null })
    },
    onError: (err) => pushToast(`Failed to delete project: ${err.message}`, 'error')
  })

  const handleCreate = (name) => {
    if (name && name.trim()) {
      createMut.mutate(name.trim())
    }
  }

  const handleDelete = (project) => {
    setDeleteDialog({ open: true, project })
  }

  const confirmDelete = () => {
    if (deleteDialog.project) {
      delMut.mutate(deleteDialog.project.id)
    }
  }

  if (isLoading) {
    return <div className="center"><p>Loading projects...</p></div>
  }

  if (error) {
    return <div className="center"><p>Error loading projects. Please try again.</p></div>
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center', marginBottom:12}}>
        <SearchBar onChange={setQ} placeholder="Search projects..." />
        <Button onClick={() => setShowCreateDialog(true)} isLoading={createMut.isPending}>New Project</Button>
      </div>
      {filtered.length===0 ? (
        <EmptyState 
          title={q ? "No projects found" : "No projects"} 
          description={q ? "Try a different search term" : "Create your first project to get started"}
        />
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filtered.map(p => (
            <li key={p.id} style={{
              display:'flex',
              alignItems:'center',
              justifyContent:'space-between',
              gap:8,
              padding: '12px',
              marginBottom: 8,
              backgroundColor: '#f7f8f9',
              borderRadius: 4,
              border: '1px solid #e1e5e9'
            }}>
              <Link to={`/projects/${p.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                <strong>{p.name}</strong>
              </Link>
              <Button 
                appearance="subtle" 
                spacing="none" 
                onClick={()=>handleDelete(p)}
                isLoading={delMut.isPending && deleteDialog.project?.id === p.id}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
      
      <PromptDialog
        isOpen={showCreateDialog}
        title="Create New Project"
        message="Enter a name for your new project:"
        placeholder="Project name"
        onSubmit={handleCreate}
        onCancel={() => setShowCreateDialog(false)}
        submitLabel="Create"
      />
      
      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteDialog.project?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, project: null })}
        confirmLabel="Delete"
        appearance="danger"
      />
    </div>
  )
}
