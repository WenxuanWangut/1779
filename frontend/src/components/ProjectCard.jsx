import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@atlaskit/button/new'

export default function ProjectCard({ project, to, onDelete, isDeleting, showDescription = true }) {
  return (
    <li style={{
      display:'flex',
      alignItems:'center',
      justifyContent:'space-between',
      gap:8,
      padding: '16px',
      marginBottom: 8,
      backgroundColor: '#f7f8f9',
      borderRadius: 4,
      border: '1px solid #e1e5e9',
      transition: 'background-color 0.2s'
    }}>
      <Link to={to} style={{ textDecoration: 'none', flex: 1 }}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <strong style={{fontSize: 16}}>{project.name}</strong>
          {showDescription && project.description && (
            <span style={{color: '#666', fontSize: 14}}>{project.description}</span>
          )}
        </div>
      </Link>
      {onDelete && (
        <Button
          appearance="danger"
          spacing="none"
          onClick={() => onDelete(project)}
          isDisabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      )}
    </li>
  )
}