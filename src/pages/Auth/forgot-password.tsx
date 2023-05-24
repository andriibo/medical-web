import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, AlertTitle, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { useValidationRules } from '~/hooks/use-validation-rules'
import { EmailField } from '~components/EmailField/email-field'
import { NotificationPopup } from '~components/Modal/NotificationPopup/notification-popup'
import { getErrorMessage } from '~helpers/get-error-message'
import { trimValues } from '~helpers/trim-values'
import { AuthEmailKeys, IAuthEmail } from '~models/auth.model'
import { IErrorRequest } from '~models/error-request.model'
import { usePostAuthForgotPasswordMutation } from '~stores/services/auth.api'

import styles from './auth.module.scss'

export const ForgotPassword = () => {
  const navigate = useNavigate()
  const { validationRules } = useValidationRules()

  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false)

  const [forgotPassword, { isLoading: forgotPasswordIsLoading }] = usePostAuthForgotPasswordMutation()

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<IAuthEmail>()

  const onSubmit: SubmitHandler<IAuthEmail> = async (data) => {
    try {
      const { email } = trimValues(data)

      await forgotPassword({ email }).unwrap()

      navigate(PageUrls.ForgotPasswordConfirm, { state: { email } })
    } catch (err) {
      const {
        data: { message },
        status,
      } = err as IErrorRequest

      console.error(err)

      if (status === 404) {
        setNotificationPopupOpen(true)

        return
      }

      setFormErrors(Array.isArray(message) ? message : [message])
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
          Enter the email address you use to sign in to Zenzers 4Life and we’ll send you a confirmation code to reset
          your password.
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
      <div className={styles.authFooter}>
        <Button component={NavLink} size="large" to={PageUrls.AccountType}>
          Create a new account
        </Button>
      </div>
      <NotificationPopup
        handleClose={() => setNotificationPopupOpen(false)}
        open={notificationPopupOpen}
        title="Account not found"
      >
        No existing account with this email address <strong>{getValues('email')}</strong>
      </NotificationPopup>
    </>
  )
}
