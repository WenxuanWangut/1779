import React from 'react'
import ModalDialog, { ModalBody, ModalFooter, ModalHeader } from '@atlaskit/modal-dialog'
import Form, { Field, FormFooter } from '@atlaskit/form'
import Textfield from '@atlaskit/textfield'
import Textarea from '@atlaskit/textarea'
import Select from '@atlaskit/select'

const STATUS_OPTIONS = [
  { label: 'To Do', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' },
  { label: "Won't Do", value: 'WONT_DO' }
]

export default function TicketModal({ isOpen = false, initial = {}, onClose, onSubmit }) {
  if (!isOpen) return null
  
  // Ensure initial is an object
  const safeInitial = initial || {}
  const isEdit = !!safeInitial.id

  try {
    return (
      <ModalDialog onClose={onClose || (() => {})}>
        <ModalHeader>{isEdit ? 'Edit Ticket' : 'Create Ticket'}</ModalHeader>
        <Form onSubmit={(values) => {
          try {
            if (onSubmit) {
              onSubmit({
                ticket_number: values.ticket_number || '',
                description: values.description || '',
                status: values.status?.value || values.status || safeInitial.status || 'TODO'
              })
            }
          } catch (error) {
            console.error('Error in form submit:', error)
          }
        }}>
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <ModalBody>
                <Field 
                  name="ticket_number" 
                  label="Ticket Number" 
                  defaultValue={safeInitial.ticket_number || safeInitial.name || ''} 
                  isRequired
                >
                  {({ fieldProps }) => <Textfield {...fieldProps} placeholder="Enter ticket number" />}
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
                )}
              </ModalBody>
              <ModalFooter>
                <FormFooter>
                  <button type="button" onClick={onClose || (() => {})} disabled={submitting}>Cancel</button>
                  <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
                </FormFooter>
              </ModalFooter>
            </form>
          )}
        </Form>
      </ModalDialog>
    )
  } catch (error) {
    console.error('Error rendering TicketModal:', error)
    return (
      <ModalDialog onClose={onClose || (() => {})}>
        <ModalHeader>Error</ModalHeader>
        <ModalBody>
          <p>An error occurred while loading the form. Please try again.</p>
        </ModalBody>
        <ModalFooter>
          <button type="button" onClick={onClose || (() => {})}>Close</button>
        </ModalFooter>
      </ModalDialog>
    )
  }
}
