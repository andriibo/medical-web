import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, TextField } from '@mui/material'
import React, { FC, useState } from 'react'
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller'

import { PasswordRules } from '~components/Form/PasswordRules/password-rules'

interface PasswordFieldProps {
  label?: string
  field: ControllerRenderProps<any, any>
  fieldValidation: {
    error: boolean
    helperText: string | boolean
  }
  showRules?: boolean
  autoComplete?: boolean
}

export const PasswordField: FC<PasswordFieldProps> = ({
  label = 'Password',
  fieldValidation,
  field,
  showRules,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <TextField
        {...field}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleShowPassword} sx={{ mr: '-0.75rem' }}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
        autoComplete={autoComplete ? '' : 'new-password'}
        error={fieldValidation.error}
        fullWidth
        helperText={!showRules && fieldValidation.helperText}
        label={label}
        placeholder="e.g. P@S5worD"
        type={showPassword ? 'text' : 'password'}
      />
      {showRules && <PasswordRules error={fieldValidation.error} value={field.value} />}
    </>
  )
}
