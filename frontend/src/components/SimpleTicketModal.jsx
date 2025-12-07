import React, { useRef, useState, useEffect } from 'react'
import Form, { Field } from '@atlaskit/form'
import Textfield from '@atlaskit/textfield'
import Textarea from '@atlaskit/textarea'
import Select from '@atlaskit/select'
import SimpleModal from './SimpleModal.jsx'
import Button from '@atlaskit/button/new'
import { searchAssignees } from '../api/auth.js'

const STATUS_OPTIONS = [
  { label: 'To Do', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' },
  { label: "Won't Do", value: 'WONT_DO' }
]

export default function SimpleTicketModal({ isOpen = false, initial = {}, onClose, onSubmit }) {
  if (!isOpen) return null
  
  const safeInitial = initial || {}
  const isEdit = !!safeInitial.id
  const formRef = useRef(null)
  const [assigneeOptions, setAssigneeOptions] = useState([])
  const [isLoadingAssignees, setIsLoadingAssignees] = useState(false)

  // Load assignees when modal opens
  useEffect(() => {
    if (isOpen && isEdit) {
      setIsLoadingAssignees(true)
      // Search with common prefixes to get a list of users
      // Using multiple single-character prefixes to get more users
      const prefixes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
      Promise.all(prefixes.map(prefix => searchAssignees(prefix)))
        .then(results => {
          // Combine and deduplicate users
          const allUsers = []
          const seenIds = new Set()
          results.flat().forEach(user => {
            if (!seenIds.has(user.id)) {
              seenIds.add(user.id)
              allUsers.push({
                label: user.name || user.email,
                value: user.id
              })
            }
          })
          // Sort by label
          allUsers.sort((a, b) => a.label.localeCompare(b.label))
          setAssigneeOptions([
            { label: 'Unassigned', value: null },
            ...allUsers
          ])
        })
        .catch(err => {
          console.error('Failed to load assignees:', err)
          setAssigneeOptions([{ label: 'Unassigned', value: null }])
        })
        .finally(() => {
          setIsLoadingAssignees(false)
        })
    }
  }, [isOpen, isEdit])

  return (
    <Form onSubmit={(values) => {
      try {
        if (onSubmit) {
          onSubmit({
            ticket_number: values.ticket_number || '',
            description: values.description || '',
            status: values.status?.value || values.status || safeInitial.status || 'TODO',
            assignee_id: values.assignee?.value !== undefined ? values.assignee.value : (safeInitial.assignee?.id || null)
          })
        }
      } catch (error) {
        console.error('Error in form submit:', error)
      }
    }}>
      {({ formProps, submitting }) => {
        formRef.current = formProps
        return (
          <SimpleModal
            isOpen={isOpen}
            title={isEdit ? 'Edit Ticket' : 'Create Ticket'}
            onClose={onClose || (() => {})}
            footer={
              <>
                <Button appearance="subtle" onClick={onClose || (() => {})} disabled={submitting}>
                  Cancel
                </Button>
                <Button 
                  appearance="primary" 
                  onClick={() => {
                    const form = formRef.current
                    if (form && form.onSubmit) {
                      // Get form values and submit
                      const formElement = document.querySelector(`form[data-ticket-form]`)
                      if (formElement) {
                        formElement.requestSubmit()
                      }
                    }
                  }}
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save'}
                </Button>
              </>
            }
          >
            <form {...formProps} data-ticket-form>
              <Field 
                name="ticket_number" 
                label="Ticket Name" 
                defaultValue={safeInitial.ticket_number || safeInitial.name || ''} 
                isRequired
              >
                {({ fieldProps }) => <Textfield {...fieldProps} placeholder="Enter ticket name" />}
              </Field>
              <Field name="description" label="Description" defaultValue={safeInitial.description || ''}>
                {({ fieldProps }) => (
                  <Textarea 
                    {...fieldProps} 
                    placeholder="Enter ticket description"
                    minimumRows={3}
                  />
                )}
              </Field>
              {isEdit && (
                <>
                  <Field 
                    name="status" 
                    label="Status" 
                    defaultValue={STATUS_OPTIONS.find(opt => opt.value === safeInitial.status) || STATUS_OPTIONS[0]}
                  >
                    {({ fieldProps }) => (
                      <Select 
                        {...fieldProps}
                        options={STATUS_OPTIONS}
                        placeholder="Select status"
                      />
                    )}
                  </Field>
                  <Field 
                    name="assignee" 
                    label="Assignee" 
                    defaultValue={
                      safeInitial.assignee 
                        ? { label: safeInitial.assignee.name || safeInitial.assignee.email, value: safeInitial.assignee.id }
                        : { label: 'Unassigned', value: null }
                    }
                  >
                    {({ fieldProps }) => (
                      <Select 
                        {...fieldProps}
                        options={assigneeOptions}
                        placeholder="Select assignee"
                        isSearchable={true}
                        isLoading={isLoadingAssignees}
                      />
                    )}
                  </Field>
                </>
              )}
            </form>
          </SimpleModal>
        )
      }}
    </Form>
  )
}

