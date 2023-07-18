import { LoadingButton } from '@mui/lab'
import { Alert, AlertTitle, Autocomplete, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { skipToken } from '@reduxjs/toolkit/query'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { useValidationRules } from '~/hooks/use-validation-rules'
import { PhoneField } from '~components/Form/PhoneField/phone-field'
import { VirtualizedListBox } from '~components/VirtualizedListBox/virtualized-list-box'
import { NURSE_SPECIALITY_OPTIONS } from '~constants/constants'
import { deleteKeysFormObject } from '~helpers/delete-keys-form-object'
import { getErrorMessage } from '~helpers/get-error-message'
import { trimValues } from '~helpers/trim-values'
import { IErrorRequest } from '~models/error-request.model'
import { IUpdateDoctorProfile, UpdateDoctorProfileKeys } from '~models/profie.model'
import { usePatchMyDoctorProfileMutation } from '~stores/services/profile.api'
import { useGetSpecialtyQuery } from '~stores/services/specialty.api'

interface EditDoctorProfilePopupProps {
  doctorData: IUpdateDoctorProfile
  open: boolean
  handleClose: () => void
}

export const EditDoctorProfilePopup: FC<EditDoctorProfilePopupProps> = ({ doctorData, open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { validationRules } = useValidationRules()

  const [specialityOptions, setSpecialityOptions] = useState<string[]>([])
  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const { data: specialtyData, isLoading: specialtyIsLoading } = useGetSpecialtyQuery(
    doctorData.roleLabel === 'Doctor' ? undefined : skipToken,
  )
  const [updateDoctorProfile, { isLoading: updateDoctorProfileIsLoading }] = usePatchMyDoctorProfileMutation()

  const doctorDefaultValues = useMemo(() => deleteKeysFormObject({ ...doctorData }, ['email', 'avatar']), [doctorData])

  useEffect(() => {
    if (doctorData.roleLabel === 'Doctor') {
      if (specialtyData && !specialtyIsLoading) {
        setSpecialityOptions([...specialtyData.specialtyNames])
      }

      return
    }

    if (doctorData.roleLabel === 'Nurse') {
      setSpecialityOptions(NURSE_SPECIALITY_OPTIONS)
    }
  }, [doctorData.roleLabel, specialtyData, specialtyIsLoading])

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
      await updateDoctorProfile(trimValues(data)).unwrap()

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
              render={({ field }) => <PhoneField field={field} fieldValidation={fieldValidation(field.name)} />}
              rules={validationRules.phone}
            />
            <Controller
              control={control}
              defaultValue=""
              name="specialty"
              render={({ field }) => (
                <Autocomplete
                  ListboxComponent={VirtualizedListBox}
                  disableClearable
                  disablePortal
                  fullWidth
                  getOptionLabel={(option) => option}
                  onChange={(event, data): void => {
                    field.onChange(data)
                  }}
                  options={specialityOptions}
                  renderInput={(params) => <TextField {...params} {...fieldValidation(field.name)} label="Specialty" />}
                  value={field.value}
                />
              )}
              rules={validationRules.medicationName}
            />
            <Controller
              control={control}
              defaultValue=""
              name="institution"
              render={({ field }) => (
                <TextField {...field} {...fieldValidation(field.name)} fullWidth label="Institution (optional)" />
              )}
              rules={validationRules.institution}
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
