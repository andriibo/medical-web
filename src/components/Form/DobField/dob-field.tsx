import { TextField } from '@mui/material'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import React, { FC } from 'react'
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller'

import { DATE_FORMAT } from '~constants/constants'

interface DobFieldProps {
  label?: string
  field: ControllerRenderProps<any, any>
  fieldValidation: {
    error: boolean
    helperText: string | boolean
  }
}

export const DobField: FC<DobFieldProps> = ({ label = 'Date of birth', field, fieldValidation }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DesktopDatePicker
      {...field}
      disableFuture
      inputFormat={DATE_FORMAT}
      minDate={dayjs('1930-01-01')}
      openTo={field.value ? 'day' : 'year'}
      renderInput={(params) => (
        <TextField
          {...params}
          autoComplete="off"
          error={fieldValidation.error}
          fullWidth
          helperText={fieldValidation.helperText}
          label={label}
        />
      )}
      views={['year', 'month', 'day']}
    />
  </LocalizationProvider>
)
