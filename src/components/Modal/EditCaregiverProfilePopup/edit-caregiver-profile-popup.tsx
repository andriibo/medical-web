import { LoadingButton } from '@mui/lab'
import { Alert, AlertTitle, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { PhoneField } from '~components/PhoneField/phone-field'
import { deleteKeysFormObject } from '~helpers/delete-keys-form-object'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { IErrorRequest } from '~models/error-request.model'
import { IUpdateCaregiverProfile, UpdateCaregiverProfileKeys } from '~models/profie.model'
import { usePatchMyCaregiverProfileMutation } from '~stores/services/profile.api'

interface EditCaregiverProfilePopupProps {
  caregiverData: IUpdateCaregiverProfile
  open: boolean
  handleClose: () => void
}

export const EditCaregiverProfilePopup: FC<EditCaregiverProfilePopupProps> = ({ caregiverData, open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [updateCaregiverProfile, { isLoading: updateCaregiverProfileIsLoading }] = usePatchMyCaregiverProfileMutation()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const caregiverDefaultValues = useMemo(
    () => deleteKeysFormObject({ ...caregiverData }, ['email', 'avatar']),
    [caregiverData],
  )

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IUpdateCaregiverProfile>({
    mode: 'onBlur',
    defaultValues: caregiverDefaultValues,
  })

  useEffect(() => {
    if (open) {
      reset(caregiverDefaultValues)
    }
  }, [open, reset, caregiverDefaultValues])

  const onSubmit: SubmitHandler<IUpdateCaregiverProfile> = async (data) => {
    try {
      await updateCaregiverProfile({
        ...data,
      }).unwrap()

      setFormErrors(null)
      handleClose()
      enqueueSnackbar('Profile updated')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: UpdateCaregiverProfileKeys) => ({
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
              render={({ field }) => <PhoneField field={field} fieldValidation={fieldValidation(field.name)} />}
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
                  loading={updateCaregiverProfileIsLoading}
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
