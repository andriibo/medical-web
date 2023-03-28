import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, AlertTitle, Button, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { useValidationRules } from '~/hooks/use-validation-rules'
import { VerificationCodeField } from '~components/Form/VerificationCodeField/verification-code-field'
import { getErrorMessage } from '~helpers/get-error-message'
import { AuthSignUpConfirmKeys, IAuthSignUpConfirm } from '~models/auth.model'
import { IErrorRequest } from '~models/error-request.model'
import { usePostAuthSignUpConfirmMutation, usePostAuthSignUpResendCodeMutation } from '~stores/services/auth.api'

import styles from './auth.module.scss'

interface LocationState {
  email?: string
}

export const EmailVerification = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const location = useLocation()
  const { validationRules } = useValidationRules()

  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const [authConfirmSignUp, { isLoading: authConfirmSignUpIsLoading }] = usePostAuthSignUpConfirmMutation()
  const [resendCode, { isLoading: resendCodeIsLoading }] = usePostAuthSignUpResendCodeMutation()

  const email = useMemo(() => (location.state as LocationState)?.email || '', [location])

  const handleResendCode = useCallback(async () => {
    try {
      await resendCode({ email }).unwrap()

      enqueueSnackbar('Verification code was sent to your email')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }, [email, enqueueSnackbar, resendCode])

  useEffect(() => {
    if (!email) {
      navigate(PageUrls.SignIn)
    }
  }, [email, navigate])

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAuthSignUpConfirm>()

  const onSubmit: SubmitHandler<IAuthSignUpConfirm> = async ({ code }) => {
    try {
      await authConfirmSignUp({
        email,
        code,
      }).unwrap()

      setFormErrors(null)
      navigate(PageUrls.SignIn, { replace: true })
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: AuthSignUpConfirmKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  if (!email) {
    return null
  }

  return (
    <>
      <div className={styles.authHeader}>
        <Typography variant="h6">Verify your email address</Typography>
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
          Please enter a verification code that we sent to you by email to verify your email address.
        </Typography>
        <Controller
          control={control}
          defaultValue=""
          name="code"
          render={({ field }) => <VerificationCodeField field={field} fieldValidation={fieldValidation(field.name)} />}
          rules={validationRules.code}
        />
        <LoadingButton fullWidth loading={authConfirmSignUpIsLoading} size="large" type="submit" variant="contained">
          verify
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
      <div className={styles.authFooter}>
        <span className={styles.authFooterText}>Need a new verification code?</span>
        <LoadingButton loading={resendCodeIsLoading} onClick={handleResendCode} size="small" sx={{ ml: 1 }}>
          Resend
        </LoadingButton>
      </div>
    </>
  )
}
