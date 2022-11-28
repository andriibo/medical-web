import { LoadingButton } from '@mui/lab'
import { Alert, AlertTitle, Box, Button, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'

import { UpdateEmailStep } from '~/enums/update-email-step.enum'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { AuthChangeEmailConfirmKeys, IAuthChangeEmailConfirm } from '~models/auth.model'
import { IErrorRequest } from '~models/error-request.model'
import { useAppDispatch } from '~stores/hooks'
import { usePostAuthChangeEmailConfirmMutation, usePostAuthChangeEmailMutation } from '~stores/services/auth.api'
import { clearPersist } from '~stores/slices/auth.slice'
import { closeEditEmailPopup, setEditEmailStep, useNewEmail } from '~stores/slices/edit-email.slice'

export const VerificationCodeForm = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const newEmail = useNewEmail()

  const [resendCode, { isLoading: resendCodeIsLoading }] = usePostAuthChangeEmailMutation()
  const [changeEmailConfirm, { isLoading: changeEmailConfirmIsLoading }] = usePostAuthChangeEmailConfirmMutation()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IAuthChangeEmailConfirm>({
    mode: 'onBlur',
  })

  useEffect(() => {
    reset()
  }, [reset])

  const onSubmit: SubmitHandler<IAuthChangeEmailConfirm> = async ({ code }) => {
    try {
      await changeEmailConfirm({ code }).unwrap()

      await dispatch(clearPersist())

      enqueueSnackbar('Email updated')
      dispatch(closeEditEmailPopup())
      dispatch(setEditEmailStep(UpdateEmailStep.email))
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      enqueueSnackbar('Verification code was sent to your email')
      console.error(err)
    }
  }

  const handleResendCode = useCallback(async () => {
    try {
      if (newEmail) {
        await resendCode({ email: newEmail }).unwrap()

        enqueueSnackbar('Verification code was sent to your email')
      } else {
        enqueueSnackbar('Verification code was not sent', { variant: 'warning' })
      }
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }, [newEmail])

  const onClosePopup = useCallback(() => {
    dispatch(closeEditEmailPopup())
  }, [])

  const fieldValidation = (name: AuthChangeEmailConfirmKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <>
      <DialogTitle>Verify your email address</DialogTitle>
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
            Please enter a verification code that we sent to you by email to verify your new email address.
          </Typography>
          <Controller
            control={control}
            defaultValue=""
            name="code"
            render={({ field }) => (
              <InputMask
                mask="999999"
                maskChar=""
                onChange={(value): void => {
                  field.onChange(value)
                }}
                value={field.value}
              >
                {
                  // @ts-ignore
                  () => (
                    <TextField
                      {...fieldValidation(field.name)}
                      autoComplete="off"
                      className="verification-control"
                      data-mask="______"
                      fullWidth
                      label="Verification code"
                    />
                  )
                }
              </InputMask>
            )}
            rules={validationRules.code}
          />
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Button fullWidth onClick={onClosePopup} size="large" variant="outlined">
                Cancel
              </Button>
            </Grid>
            <Grid xs={6}>
              <LoadingButton
                fullWidth
                loading={changeEmailConfirmIsLoading}
                size="large"
                type="submit"
                variant="contained"
              >
                Verify
              </LoadingButton>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'right' }} />
        </form>
        <div className="dialog-footer">
          <span className="dialog-footer-text">Need a new verification code?</span>
          <LoadingButton loading={resendCodeIsLoading} onClick={handleResendCode} size="small" sx={{ ml: 1 }}>
            Resend
          </LoadingButton>
        </div>
      </DialogContent>
    </>
  )
}
