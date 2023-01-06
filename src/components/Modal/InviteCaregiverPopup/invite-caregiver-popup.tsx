import { LoadingButton } from '@mui/lab'
import { Alert, AlertTitle, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { AuthEmailKeys } from '~models/auth.model'
import { IDataAccessEmail } from '~models/data-access.model'
import { IErrorRequest } from '~models/error-request.model'
import { usePostPatientDataAccessInitiateForCaregiverMutation } from '~stores/services/patient-data-access.api'

interface InviteCaregiverPopupProps {
  open: boolean
  handleClose: () => void
}

export const InviteCaregiverPopup: FC<InviteCaregiverPopupProps> = ({ open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const navigate = useNavigate()

  const [initiateCaregiver, { isLoading: initiateCaregiverIsLoading }] =
    usePostPatientDataAccessInitiateForCaregiverMutation()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IDataAccessEmail>({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (open) {
      setFormErrors(null)
      reset()
    }
  }, [open, reset])

  const onSubmit: SubmitHandler<IDataAccessEmail> = async (data) => {
    try {
      await initiateCaregiver(data).unwrap()

      handleClose()
      navigate(PageUrls.Requests)
      enqueueSnackbar('Request sent')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: AuthEmailKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open} scroll="body">
      <DialogTitle>Invite a new Caregiver</DialogTitle>
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
          <Controller
            control={control}
            defaultValue=""
            name="email"
            render={({ field }) => <TextField {...field} {...fieldValidation(field.name)} fullWidth label="Email" />}
            rules={validationRules.email}
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
                loading={initiateCaregiverIsLoading}
                size="large"
                type="submit"
                variant="contained"
              >
                Invite
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}
