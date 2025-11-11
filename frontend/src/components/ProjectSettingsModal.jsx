import React, { useState } from 'react'
import Button from '@atlaskit/button/new'
import Form, { Field } from '@atlaskit/form'
import Textfield from '@atlaskit/textfield'
import Textarea from '@atlaskit/textarea'
import ModalDialog, { ModalBody, ModalFooter, ModalHeader } from '@atlaskit/modal-dialog'
import { combineValidators, required, minLen, maxLen } from '../utils/validators.js'

export default function ProjectSettingsModal({ isOpen, project, onClose, onSave }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  return (
    <ModalDialog onClose={onClose} width="medium">
      <ModalHeader>Project Settings</ModalHeader>
      <Form onSubmit={async (values) => {
        setIsSubmitting(true)
        try {
          await onSave({
            name: values.name,
            description: values.description || ''
          })
          onClose()
        } catch (error) {
          console.error('Failed to save project settings:', error)
        } finally {
          setIsSubmitting(false)
        }
      }}>
        {({ formProps, submitting }) => (
          <form {...formProps}>
            <ModalBody>
              <Field 
                name="name" 
                label="Project Name" 
                defaultValue={project?.name || ''}
                isRequired
                validate={combineValidators(required, minLen(3), maxLen(100))}
              >
                {({ fieldProps, error }) => (
                  <div>
                    <Textfield {...fieldProps} placeholder="Enter project name" />
                    {error && <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{error}</div>}
                  </div>
                )}
              </Field>
              <Field 
                name="description" 
                label="Description" 
                defaultValue={project?.description || ''}
                validate={maxLen(500)}
              >
                {({ fieldProps, error }) => (
                  <div>
                    <Textarea 
                      {...fieldProps} 
                      placeholder="Enter project description (optional)"
                      minimumRows={4}
                    />
                    {error && <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{error}</div>}
                  </div>
                )}
              </Field>
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" appearance="primary" isLoading={submitting || isSubmitting}>
                Save
              </Button>
            </ModalFooter>
          </form>
        )}
      </Form>
    </ModalDialog>
  )
}
