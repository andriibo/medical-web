import 'react-phone-input-2/lib/material.css'

import { FormControl, FormHelperText } from '@mui/material'
import React, { FC } from 'react'
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller'
import PhoneInput from 'react-phone-input-2'

interface PhoneFieldProps {
  field: ControllerRenderProps<any, any>
  fieldValidation: {
    error: boolean
    helperText: string | boolean
  }
}

export const PhoneField: FC<PhoneFieldProps> = ({ field, fieldValidation: { error, helperText } }) => (
  <FormControl error={error} fullWidth>
    <PhoneInput
      copyNumbersOnly={false}
      country="ca"
      enableSearch
      inputProps={{
        name: field.name,
      }}
      isValid={!error}
      onChange={(phone) => field.onChange(`+${phone}`)}
      specialLabel="Phone number"
      value={field.value}
    />
    {error && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
)
