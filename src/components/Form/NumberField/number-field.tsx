import { InputAdornment, TextField } from '@mui/material'
import { InputProps as StandardInputProps } from '@mui/material/Input/Input'
import React, { FC, KeyboardEvent } from 'react'
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller'

import { ValidationPropsItemType } from '~/hooks/use-validation-rules'

interface NumberFieldProps {
  label: string
  field: ControllerRenderProps<any, any>
  fieldValidation: {
    error: boolean
    helperText: string | boolean
  }
  inputProps?: Partial<StandardInputProps>
  validationProps?: ValidationPropsItemType
  helperText?: string
}

export const NumberField: FC<NumberFieldProps> = ({
  field,
  fieldValidation,
  inputProps,
  helperText,
  validationProps,
  ...other
}) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const regex = /(?<numbers>^\d*$)|(?<actions>Backspace|Tab|Delete|ArrowLeft|ArrowRight)/

    if (!event.key.match(regex)) {
      event.preventDefault()
    }
  }

  const inputPropsSetting: Partial<StandardInputProps> = {
    ...inputProps,
    inputProps: {
      ...(validationProps && {
        min: validationProps.min,
        max: validationProps.max,
      }),
      step: 1,
      ...inputProps?.inputProps,
    },
    ...(validationProps && { endAdornment: <InputAdornment position="end">{validationProps.unit}</InputAdornment> }),
  }

  return (
    <TextField
      {...field}
      InputProps={inputPropsSetting}
      error={fieldValidation.error}
      fullWidth
      helperText={helperText || fieldValidation.helperText}
      onKeyDown={handleKeyDown}
      type="number"
      {...other}
    />
  )
}
