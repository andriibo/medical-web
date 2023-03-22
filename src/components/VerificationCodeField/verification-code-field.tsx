import { TextField } from '@mui/material'
import React, { FC } from 'react'
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller'
import InputMask from 'react-input-mask'

interface VerificationCodeFieldProps {
  label?: string
  field: ControllerRenderProps<any, any>
  fieldValidation: {
    error: boolean
    helperText: string | boolean
  }
}

export const VerificationCodeField: FC<VerificationCodeFieldProps> = ({
  label = 'Verification code',
  field,
  fieldValidation,
}) => (
  <InputMask
    mask="999999"
    maskChar=""
    onChange={(value): void => {
      field.onChange(value)
    }}
    value={field.value}
  >
    {
      // @ts-ignore
      () => (
        <TextField
          {...fieldValidation}
          autoComplete="off"
          className="verification-control"
          data-mask="______"
          fullWidth
          label={label}
        />
      )
    }
  </InputMask>
)
