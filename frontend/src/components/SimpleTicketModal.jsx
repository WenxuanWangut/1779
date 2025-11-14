import React, { useRef } from 'react'
import Form, { Field } from '@atlaskit/form'
import Textfield from '@atlaskit/textfield'
import Textarea from '@atlaskit/textarea'
import Select from '@atlaskit/select'
import SimpleModal from './SimpleModal.jsx'
import Button from '@atlaskit/button/new'

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

  return (
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
            </form>
          </SimpleModal>
        )
      }}
    </Form>
  )
}

