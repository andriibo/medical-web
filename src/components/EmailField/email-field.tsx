import { TextField } from '@mui/material'
import React, { FC } from 'react'
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller'

interface EmailFieldProps {
  disabled?: boolean
  label?: string
  field: ControllerRenderProps<any, any>
  fieldValidation: {
    error: boolean
    helperText: string | boolean
  }
}

export const EmailField: FC<EmailFieldProps> = ({ label = 'Email', fieldValidation, field, disabled }) => (
  <TextField
    {...field}
    disabled={disabled}
    error={fieldValidation.error}
    fullWidth
    helperText={fieldValidation.helperText}
    label={label}
    placeholder="e.g. johndoe@example.com"
  />
)
