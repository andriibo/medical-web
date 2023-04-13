import { InputAdornment, TextField } from '@mui/material'
import { InputProps as StandardInputProps } from '@mui/material/Input/Input'
import React, { ChangeEvent, FC, KeyboardEvent, useMemo } from 'react'
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller'

import { ValidationPropsItemType } from '~/hooks/use-validation-rules'

interface NumberFieldProps {
  label: string
  field: ControllerRenderProps<any, any>
  fieldValidation: {
    error: boolean
    helperText: string | boolean
  }
  InputProps?: Partial<StandardInputProps>
  validationProps?: ValidationPropsItemType
  step?: number
  helperText?: string
}

export const NumberField: FC<NumberFieldProps> = ({
  field,
  fieldValidation,
  InputProps,
  step = 1,
  helperText,
  validationProps,
  ...other
}) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const regex = /(?<numbers>^\d*$)|(?<actions>Backspace|Tab|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|\.|,)/

    if (!event.key.match(regex)) {
      event.preventDefault()
    }
  }

  const digitsAfterDecimal = useMemo(() => {
    if (Number.isInteger(step)) {
      return 0
    }

    const arr = step.toString().split('.')

    return arr[1].length
  }, [step])

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, validity } = e.currentTarget

    const regexVar = digitsAfterDecimal ? new RegExp(`^\\d+(?<decimal>\\.\\d{0,${digitsAfterDecimal}})?$`) : /^\d+$/

    if (!validity.badInput && (regexVar.test(value) || !value.length)) {
      field.onChange(e)
    }
  }

  const inputPropsSettings: Partial<StandardInputProps> = {
    ...InputProps,
    inputProps: {
      ...(validationProps && {
        min: validationProps.min,
        max: validationProps.max,
      }),
      step,
      ...InputProps?.inputProps,
    },
    ...(validationProps && { endAdornment: <InputAdornment position="end">{validationProps.unit}</InputAdornment> }),
  }

  return (
    <TextField
      {...field}
      InputProps={inputPropsSettings}
      error={fieldValidation.error}
      fullWidth
      helperText={helperText || fieldValidation.helperText}
      onChange={(e) => onChange(e)}
      onKeyDown={(e) => handleKeyDown(e)}
      type="number"
      {...other}
    />
  )
}
