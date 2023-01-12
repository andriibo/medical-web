import { Visibility, VisibilityOff } from '@mui/icons-material'
import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, AlertTitle, Box, Button, IconButton, TextField, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { useCallback, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { VerificationCodeField } from '~components/VerificationCodeField/verification-code-field'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { AuthForgotPasswordConfirmFormKeys, IAuthForgotPasswordConfirmForm } from '~models/auth.model'
import { IErrorRequest } from '~models/error-request.model'
import { usePostAuthForgotPasswordConfirmMutation, usePostAuthForgotPasswordMutation } from '~stores/services/auth.api'

import styles from './auth.module.scss'

interface LocationState {
  email?: string
}

export const ForgotPasswordConfirm = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const [forgotPasswordConfirm, { isLoading: forgotPasswordConfirmIsLoading }] =
    usePostAuthForgotPasswordConfirmMutation()
  const [resendCode, { isLoading: resendCodeIsLoading }] = usePostAuthForgotPasswordMutation()

  const email = useMemo(() => (location.state as LocationState)?.email || '', [location])

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleResendCode = useCallback(async () => {
    try {
      await resendCode({ email }).unwrap()

      enqueueSnackbar('Confirmation code was sent to your email')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }, [email, enqueueSnackbar, resendCode])

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAuthForgotPasswordConfirmForm>()

  const onSubmit: SubmitHandler<IAuthForgotPasswordConfirmForm> = async ({ code, newPassword }) => {
    try {
      await forgotPasswordConfirm({
        email,
        code,
        newPassword,
      }).unwrap()

      setFormErrors(null)
      navigate(PageUrls.ForgotPasswordSuccess, { replace: true })
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: AuthForgotPasswordConfirmFormKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  if (!email) {
    return <Navigate replace to={PageUrls.SignIn} />
  }

  return (
    <>
      <div className={styles.authHeader}>
        <Typography variant="h6">Reset password</Typography>
      </div>
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
          Enter the confirmation that we sent to your email.
        </Typography>
        <Controller
          control={control}
          defaultValue=""
          name="code"
          render={({ field }) => <VerificationCodeField field={field} fieldValidation={fieldValidation(field.name)} />}
          rules={validationRules.code}
        />
        <Box className={styles.authHelperBox} sx={{ textAlign: 'right' }}>
          <Typography component="span" variant="body2">
            Need a new verification code?
          </Typography>
          <LoadingButton loading={resendCodeIsLoading} onClick={handleResendCode} size="small" sx={{ ml: 1 }}>
            Resend
          </LoadingButton>
        </Box>
        <Controller
          control={control}
          defaultValue=""
          name="newPassword"
          render={({ field }) => (
            <TextField
              {...field}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleShowPassword} size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              autoComplete="new-password"
              error={Boolean(errors[field.name])}
              fullWidth
              helperText={
                getErrorMessage(errors, field.name) || 'At least 8 characters, at least one number and one symbol.'
              }
              label="New Password"
              type={showPassword ? 'text' : 'password'}
            />
          )}
          rules={validationRules.password}
        />
        <LoadingButton
          fullWidth
          loading={forgotPasswordConfirmIsLoading}
          size="large"
          type="submit"
          variant="contained"
        >
          Reset Password
        </LoadingButton>
        <Button
          component={NavLink}
          fullWidth
          size="large"
          sx={{ mt: 2 }}
          to={PageUrls.SignIn}
          type="button"
          variant="outlined"
        >
          Cancel
        </Button>
      </form>
    </>
  )
}
