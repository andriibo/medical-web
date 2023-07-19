import 'react-phone-input-2/lib/material.css'

import { FormControl, FormHelperText } from '@mui/material'
import React, { FC } from 'react'
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller'
import PhoneInput from 'react-phone-input-2'

interface PhoneFieldProps {
  label?: string
  field: ControllerRenderProps<any, any>
  fieldValidation: {
    error: boolean
    helperText: string | boolean
  }
}

export const PhoneField: FC<PhoneFieldProps> = ({
  label = 'Phone number',
  field,
  fieldValidation: { error, helperText },
}) => (
  <FormControl error={error} fullWidth>
    <PhoneInput
      country="ca"
      enableSearch
      inputProps={{
        name: field.name,
      }}
      isValid={!error}
      onChange={(phone) => field.onChange(phone ? `+${phone}` : null)}
      specialLabel={label}
      value={field.value}
    />
    {error && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
)
