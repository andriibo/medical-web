import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { useCallback, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { useValidationRules } from '~/hooks/use-validation-rules'
import { PasswordField } from '~components/Form/PasswordField/password-field'
import { VerificationCodeField } from '~components/Form/VerificationCodeField/verification-code-field'
import { getErrorMessage } from '~helpers/get-error-message'
import { AuthForgotPasswordConfirmFormKeys, IAuthForgotPasswordConfirmForm } from '~models/auth.model'
import { IErrorRequest } from '~models/error-request.model'
import { usePostAuthForgotPasswordConfirmMutation, usePostAuthForgotPasswordMutation } from '~stores/services/auth.api'

import styles from './auth.module.scss'

interface LocationState {
  email?: string
}

export const ForgotPasswordConfirm = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const location = useLocation()
  const { validationRules } = useValidationRules()

  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const [forgotPasswordConfirm, { isLoading: forgotPasswordConfirmIsLoading }] =
    usePostAuthForgotPasswordConfirmMutation()
  const [resendCode, { isLoading: resendCodeIsLoading }] = usePostAuthForgotPasswordMutation()

  const email = useMemo(() => (location.state as LocationState)?.email || '', [location])

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
          Enter the confirmation that we sent to your email <strong>{email}</strong>
        </Typography>
        <Typography sx={{ mb: '1.5rem' }} variant="body2">
          Didn’t receive the confirmation code? Try RESEND
        </Typography>
        <Controller
          control={control}
          defaultValue=""
          name="code"
          render={({ field }) => (
            <VerificationCodeField
              field={field}
              fieldValidation={fieldValidation(field.name)}
              label="Confirmation code"
            />
          )}
          rules={validationRules.code}
        />
        <Box className={styles.authHelperBox} sx={{ justifyContent: 'flex-end' }}>
          <LoadingButton loading={resendCodeIsLoading} onClick={handleResendCode} size="small">
            Resend Code
          </LoadingButton>
        </Box>
        <Controller
          control={control}
          defaultValue=""
          name="newPassword"
          render={({ field }) => (
            <PasswordField field={field} fieldValidation={fieldValidation(field.name)} label="New password" showRules />
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
