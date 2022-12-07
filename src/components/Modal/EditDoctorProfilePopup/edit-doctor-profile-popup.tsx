import { LoadingButton } from '@mui/lab'
import { Alert, AlertTitle, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'

import { deleteKeysFormObject } from '~helpers/delete-keys-form-object'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { IErrorRequest } from '~models/error-request.model'
import { IUpdateDoctorProfile, UpdateDoctorProfileKeys } from '~models/profie.model'
import { usePatchDoctorProfileMutation } from '~stores/services/profile.api'

interface EditDoctorProfilePopupProps {
  doctorData: IUpdateDoctorProfile
  open: boolean
  handleClose: () => void
}

export const EditDoctorProfilePopup: FC<EditDoctorProfilePopupProps> = ({ doctorData, open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [updateDoctorProfile, { isLoading: updateDoctorProfileIsLoading }] = usePatchDoctorProfileMutation()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const doctorDefaultValues = useMemo(() => deleteKeysFormObject({ ...doctorData }, ['email', 'avatar']), [doctorData])

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IUpdateDoctorProfile>({
    mode: 'onBlur',
    defaultValues: doctorDefaultValues,
  })

  useEffect(() => {
    if (open) {
      reset(doctorDefaultValues)
    }
  }, [open, reset, doctorDefaultValues])

  const onSubmit: SubmitHandler<IUpdateDoctorProfile> = async (data) => {
    try {
      await updateDoctorProfile({
        ...data,
      }).unwrap()

      setFormErrors(null)
      handleClose()
      enqueueSnackbar('Profile was updated')
    } catch (err) {
      const { data: { message }, } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: UpdateDoctorProfileKeys) => ({
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
            <Controller
              control={control}
              defaultValue=""
              name="institution"
              render={({ field }) => <TextField {...field} fullWidth label="Institution (optional)" />}
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
                  loading={updateDoctorProfileIsLoading}
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
