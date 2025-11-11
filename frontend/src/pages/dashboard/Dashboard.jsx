import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Button from '@atlaskit/button/new'
import { listProjects, deleteProject } from '../../api/projects.js'
import useAuth from '../../hooks/useAuth.js'
import useUI from '../../context/UIContext.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { ConfirmDialog } from '../../components/Dialogs.jsx'
import ProjectCard from '../../components/ProjectCard.jsx'

export default function Dashboard(){
  const { user } = useAuth()
  const { pushToast } = useUI()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, project: null })

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey:['projects'],
    queryFn: listProjects,
    onError: (err) => pushToast(`Failed to load projects: ${err.message}`, 'error')
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

  const recentProjects = projects.slice(0, 5)

  const handleDelete = (project) => {
    setDeleteDialog({ open: true, project })
  }

  const confirmDelete = () => {
    if (deleteDialog.project) {
      delMut.mutate(deleteDialog.project.id)
    }
  }

  return (
    <div>
      <div style={{marginBottom: 24}}>
        <h1 style={{margin: 0, marginBottom: 8}}>Welcome back, {user?.name || user?.email || 'User'}!</h1>
        <p style={{color: '#666', margin: 0}}>Here's an overview of your projects and tasks</p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 32}}>
        <div style={{
          padding: 20,
          backgroundColor: '#f7f8f9',
          borderRadius: 8,
          border: '1px solid #e1e5e9'
        }}>
          <h3 style={{margin: '0 0 8px 0', fontSize: 14, color: '#666'}}>Total Projects</h3>
          <div style={{fontSize: 32, fontWeight: 'bold', color: '#0052CC'}}>
            {projectsLoading ? '...' : projects.length}
          </div>
        </div>

        <div style={{
          padding: 20,
          backgroundColor: '#f7f8f9',
          borderRadius: 8,
          border: '1px solid #e1e5e9'
        }}>
          <h3 style={{margin: '0 0 8px 0', fontSize: 14, color: '#666'}}>Active Projects</h3>
          <div style={{fontSize: 32, fontWeight: 'bold', color: '#0E8750'}}>
            {projectsLoading ? '...' : recentProjects.length}
          </div>
        </div>
      </div>

      <div style={{marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2 style={{margin: 0}}>Recent Projects</h2>
        <Button appearance="primary" onClick={() => navigate('/projects')}>
          View All Projects
        </Button>
      </div>

      {projectsLoading ? (
        <div className="center"><p>Loading projects...</p></div>
      ) : recentProjects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to get started"
        />
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {recentProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              to={`/projects/${project.id}`}
              onDelete={handleDelete}
              isDeleting={delMut.isPending && deleteDialog.project?.id === project.id}
              showDescription
            />
          ))}
        </ul>
      )}

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