import React from 'react'
import Button from '@atlaskit/button'

export default function ErrorBoundary({ error, resetError }) {
  return (
    <div className="center">
      <div style={{ textAlign: 'center', padding: 40 }}>
        <h2>Something went wrong</h2>
        <p style={{ color: '#666', marginBottom: 20 }}>
          {error?.message || 'An unexpected error occurred'}
        </p>
        <Button appearance="primary" onClick={resetError}>
          Try Again
        </Button>
      </div>
    </div>
  )
}
