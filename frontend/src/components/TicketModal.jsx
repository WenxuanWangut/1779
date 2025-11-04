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

export default function TicketModal({ isOpen, initial={}, onClose, onSubmit }){
  if(!isOpen) return null
  
  const isEdit = !!initial.id

  return (
    <ModalDialog onClose={onClose}>
      <ModalHeader>{isEdit ? 'Edit Ticket' : 'Create Ticket'}</ModalHeader>
      <Form onSubmit={(values)=> {
        onSubmit && onSubmit({
          ticket_number: values.ticket_number || '',
          description: values.description || '',
          status: values.status?.value || initial.status || 'TODO'
        })
      }}>
        {({ formProps, submitting }) => (
          <form {...formProps}>
            <ModalBody>
              <Field 
                name="ticket_number" 
                label="Ticket Number" 
                defaultValue={initial.ticket_number || initial.name || ''} 
                isRequired
              >
                {({ fieldProps }) => <Textfield {...fieldProps} placeholder="Enter ticket number" />}
              </Field>
              <Field name="description" label="Description" defaultValue={initial.description || ''}>
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
                  defaultValue={STATUS_OPTIONS.find(opt => opt.value === initial.status) || STATUS_OPTIONS[0]}
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
                <button type="button" onClick={onClose} disabled={submitting}>Cancel</button>
                <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
              </FormFooter>
            </ModalFooter>
          </form>
        )}
      </Form>
    </ModalDialog>
  )
}
