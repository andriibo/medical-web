import { LoadingButton } from '@mui/lab'
import { Alert, AlertTitle, Button, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { useCallback, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { UpdateEmailStep } from '~/enums/update-email-step.enum'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { AuthEmailKeys, IAuthEmail } from '~models/auth.model'
import { IErrorRequest } from '~models/error-request.model'
import { useAppDispatch } from '~stores/hooks'
import { usePostAuthChangeEmailMutation } from '~stores/services/auth.api'
import { closeEditEmailPopup, setEditEmailStep, setNewEmail } from '~stores/slices/edit-email.slice'

export const NewEmailForm = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const [changeEmail, { isLoading: changeEmailIsLoading }] = usePostAuthChangeEmailMutation()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAuthEmail>({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<IAuthEmail> = async ({ email }) => {
    try {
      await changeEmail({ email }).unwrap()

      dispatch(setEditEmailStep(UpdateEmailStep.code))
      dispatch(setNewEmail(email))
      enqueueSnackbar('Verification code was sent to your email')
    } catch (err) {
      const { data: { message }, } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const onClosePopup = useCallback(() => {
    dispatch(closeEditEmailPopup())
  }, [])

  const fieldValidation = (name: AuthEmailKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <>
      <DialogTitle>Update email address</DialogTitle>
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
          <Typography sx={{ mb: '1.5rem' }} variant="body2">
            Enter your email and we’ll send you a confirmation code to reset your password.
          </Typography>
          <Controller
            control={control}
            defaultValue=""
            name="email"
            render={({ field }) => (
              <TextField {...field} {...fieldValidation(field.name)} fullWidth label="New email" />
            )}
            rules={validationRules.email}
          />
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Button fullWidth onClick={onClosePopup} size="large" variant="outlined">
                Cancel
              </Button>
            </Grid>
            <Grid xs={6}>
              <LoadingButton fullWidth loading={changeEmailIsLoading} size="large" type="submit" variant="contained">
                Update email
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </>
  )
}
