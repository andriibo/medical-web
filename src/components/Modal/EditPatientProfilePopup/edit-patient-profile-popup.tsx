import { LoadingButton } from '@mui/lab'
import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'

import { Gender } from '~/enums/gender.emun'
import { deleteKeysFormObject } from '~helpers/delete-keys-form-object'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { IErrorRequest } from '~models/error-request.model'
import { IUpdatePatientProfile, UpdatePatientProfileKeys } from '~models/profie.model'
import { usePatchPatientProfileMutation } from '~stores/services/profile.api'

interface EditPatientProfilePopupProps {
  patientData: IUpdatePatientProfile
  open: boolean
  handleClose: () => void
}

export const EditPatientProfilePopup: FC<EditPatientProfilePopupProps> = ({ patientData, open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [updatePatientProfile, { isLoading: updatePatientProfileIsLoading }] = usePatchPatientProfileMutation()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const patientDefaultValues = useMemo(
    () => deleteKeysFormObject({ ...patientData }, ['email', 'avatar']),
    [patientData],
  )

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IUpdatePatientProfile>({
    mode: 'onBlur',
    defaultValues: patientDefaultValues,
  })

  useEffect(() => {
    if (open) {
      reset(patientDefaultValues)
    }
  }, [open, reset, patientDefaultValues])

  const onSubmit: SubmitHandler<IUpdatePatientProfile> = async (data) => {
    try {
      await updatePatientProfile({
        ...data,
        height: Number(data.height),
        weight: Number(data.weight),
      }).unwrap()

      setFormErrors(null)
      handleClose()
      enqueueSnackbar('Profile was updated')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: UpdatePatientProfileKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <>
      <Dialog onClose={handleClose} open={open} scroll="body">
        <DialogTitle>Personal Info</DialogTitle>
        <DialogContent>
          {formErrors && (
            <Alert className="form-alert" severity="error">
              <AlertTitle>Error</AlertTitle>
              <ul>
                {formErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid xs={6}>
                <Controller
                  control={control}
                  defaultValue=""
                  name="firstName"
                  render={({ field }) => (
                    <TextField {...field} {...fieldValidation(field.name)} fullWidth label="First name" />
                  )}
                  rules={validationRules.text}
                />
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  defaultValue=""
                  name="lastName"
                  render={({ field }) => (
                    <TextField {...field} {...fieldValidation(field.name)} fullWidth label="Last name" />
                  )}
                  rules={validationRules.text}
                />
              </Grid>
            </Grid>
            <Controller
              control={control}
              defaultValue=""
              name="dob"
              render={({ field }) => {
                const currentDate = new Date()
                const yearOffset = 0
                const maxDate = currentDate.setFullYear(currentDate.getFullYear() - yearOffset)

                return (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      {...field}
                      disableFuture
                      inputFormat="YYYY/MM/DD"
                      maxDate={dayjs(maxDate)}
                      minDate={dayjs('1930-01-01')}
                      openTo="year"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...fieldValidation(field.name)}
                          autoComplete="off"
                          fullWidth
                          label="Date of birth"
                        />
                      )}
                      views={['year', 'month', 'day']}
                    />
                  </LocalizationProvider>
                )
              }}
              rules={validationRules.dob}
            />
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <FormControl error={Boolean(errors[field.name])} fullWidth>
                  <InputLabel id="gender-select">Gender</InputLabel>
                  <Select {...field} label="Gender" labelId="gender-select">
                    {Object.values(Gender).map((gender) => (
                      <MenuItem key={gender} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{getErrorMessage(errors, field.name)}</FormHelperText>
                </FormControl>
              )}
              rules={validationRules.gender}
            />
            <Grid container spacing={3}>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="height"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      {...fieldValidation(field.name)}
                      InputProps={{
                        inputProps: { min: 50, max: 250, step: 1 },
                        endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                      }}
                      fullWidth
                      label="Height"
                      type="number"
                    />
                  )}
                  rules={validationRules.height}
                />
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="weight"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      {...fieldValidation(field.name)}
                      InputProps={{
                        inputProps: { min: 10, max: 200, step: 1 },
                        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                      }}
                      fullWidth
                      label="Weight"
                      type="number"
                    />
                  )}
                  rules={validationRules.weight}
                />
              </Grid>
            </Grid>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <InputMask
                  mask="1-999-999-9999"
                  onChange={(event): void => {
                    const value = event.target.value.split('-').join('')

                    field.onChange(value)
                  }}
                  value={field.value}
                >
                  {
                    // @ts-ignore
                    () => <TextField {...fieldValidation(field.name)} fullWidth label="Phone number" />
                  }
                </InputMask>
              )}
              rules={validationRules.phone}
            />
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Button fullWidth onClick={handleClose} size="large" variant="outlined">
                  Cancel
                </Button>
              </Grid>
              <Grid xs={6}>
                <LoadingButton
                  fullWidth
                  loading={updatePatientProfileIsLoading}
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Save
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
