import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, AlertTitle, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { EmailField } from '~components/EmailField/email-field'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { AuthEmailKeys, IAuthEmail } from '~models/auth.model'
import { IErrorRequest } from '~models/error-request.model'
import { usePostAuthForgotPasswordMutation } from '~stores/services/auth.api'

import styles from './auth.module.scss'

export const ForgotPassword = () => {
  const navigate = useNavigate()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const [forgotPassword, { isLoading: forgotPasswordIsLoading }] = usePostAuthForgotPasswordMutation()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAuthEmail>()

  const onSubmit: SubmitHandler<IAuthEmail> = async ({ email }) => {
    try {
      await forgotPassword({ email }).unwrap()

      navigate(PageUrls.ForgotPasswordConfirm, { state: { email } })
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
    <>
      <div className={styles.authHeader}>
        <Typography variant="h6">Receive confirmation code</Typography>
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
          Enter your email and we’ll send you a confirmation code to reset your password.
        </Typography>
        <Controller
          control={control}
          defaultValue=""
          name="email"
          render={({ field }) => <EmailField field={field} fieldValidation={fieldValidation(field.name)} />}
          rules={validationRules.email}
        />
        <LoadingButton fullWidth loading={forgotPasswordIsLoading} size="large" type="submit" variant="contained">
          Send Code
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
