import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, TextField } from '@mui/material'
import React, { FC, useState } from 'react'
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller'

interface PasswordFieldProps {
  label?: string
  field: ControllerRenderProps<any, any>
  fieldValidation: {
    error: boolean
    helperText: string | boolean
  }
}

export const PasswordField: FC<PasswordFieldProps> = ({ label = 'Password', fieldValidation, field }) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <TextField
      {...field}
      InputProps={{
        endAdornment: (
          <IconButton onClick={handleShowPassword} size="small">
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        ),
      }}
      autoComplete="new-password"
      error={fieldValidation.error}
      fullWidth
      helperText={fieldValidation.helperText}
      label={label}
      placeholder="P@S5worD"
      type={showPassword ? 'text' : 'password'}
    />
  )
}
