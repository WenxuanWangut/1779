import React, { useState } from 'react'
import ModalDialog, { ModalBody, ModalFooter, ModalHeader } from '@atlaskit/modal-dialog'
import Button from '@atlaskit/button'
import Form, { Field } from '@atlaskit/form'
import Textfield from '@atlaskit/textfield'

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', cancelLabel = 'Cancel', appearance = 'danger' }) {
  if (!isOpen) return null

  return (
    <ModalDialog onClose={onCancel}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <p>{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button appearance="subtle" onClick={onCancel}>{cancelLabel}</Button>
        <Button appearance={appearance} onClick={onConfirm}>{confirmLabel}</Button>
      </ModalFooter>
    </ModalDialog>
  )
}

export function PromptDialog({ isOpen, title, message, onSubmit, onCancel, submitLabel = 'Submit', cancelLabel = 'Cancel', placeholder = '', defaultValue = '' }) {
  const [value, setValue] = useState(defaultValue)

  if (!isOpen) return null

  return (
    <ModalDialog onClose={onCancel}>
      <ModalHeader>{title}</ModalHeader>
      <Form onSubmit={(values) => {
        onSubmit && onSubmit(values.input)
        setValue('')
      }}>
        {({ formProps, submitting }) => (
          <form {...formProps}>
            <ModalBody>
              <p>{message}</p>
              <Field name="input" defaultValue={defaultValue} isRequired>
                {({ fieldProps }) => (
                  <Textfield 
                    {...fieldProps} 
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                )}
              </Field>
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle" onClick={onCancel} disabled={submitting}>{cancelLabel}</Button>
              <Button type="submit" appearance="primary" disabled={submitting || !value.trim()}>{submitLabel}</Button>
            </ModalFooter>
          </form>
        )}
      </Form>
    </ModalDialog>
  )
}
