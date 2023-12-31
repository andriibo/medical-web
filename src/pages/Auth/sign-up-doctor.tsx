import { ArrowBack } from '@mui/icons-material'
import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, AlertTitle, Button, IconButton, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { useEmailParam } from '~/hooks/use-email-param'
import { EmailField } from '~components/EmailField/email-field'
import { PasswordField } from '~components/PasswordField/password-field'
import { PhoneField } from '~components/PhoneField/phone-field'
import { getErrorMessage } from '~helpers/get-error-message'
import { getUrlWithParams } from '~helpers/get-url-with-params'
import { trimValues } from '~helpers/trim-values'
import { validationRules } from '~helpers/validation-rules'
import { AuthSignUpDoctorKeys, IAuthSignUpDoctor } from '~models/auth.model'
import { IErrorRequest } from '~models/error-request.model'
import { usePostAuthSignUpDoctorMutation } from '~stores/services/auth.api'

import styles from './auth.module.scss'

export const SignUpDoctor = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [authSignUpDoctor, { isLoading: authSignUpDoctorIsLoading }] = usePostAuthSignUpDoctorMutation()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const emailParam = useEmailParam()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAuthSignUpDoctor>({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<IAuthSignUpDoctor> = async (data) => {
    try {
      await authSignUpDoctor({ ...trimValues(data), email: emailParam || data.email }).unwrap()

      setFormErrors(null)
      navigate(PageUrls.EmailVerification, { state: { email: emailParam || data.email } })
      enqueueSnackbar('Account created')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: AuthSignUpDoctorKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <>
      <div className={styles.authHeader}>
        <IconButton component={NavLink} to={getUrlWithParams(PageUrls.AccountType)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">Create an MD account</Typography>
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
          defaultValue=""
          name="phone"
          render={({ field }) => <PhoneField field={field} fieldValidation={fieldValidation(field.name)} />}
          rules={validationRules.phone}
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
        <Controller
          control={control}
          defaultValue={emailParam}
          name="email"
          render={({ field }) => (
            <EmailField disabled={Boolean(emailParam)} field={field} fieldValidation={fieldValidation(field.name)} />
          )}
          rules={validationRules.email}
        />
        <Controller
          control={control}
          defaultValue=""
          name="password"
          render={({ field }) => (
            <PasswordField field={field} fieldValidation={fieldValidation(field.name)} showRules />
          )}
          rules={validationRules.password}
        />
        <Typography sx={{ mb: '1.5rem' }} variant="body2">
          By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.
        </Typography>
        <LoadingButton fullWidth loading={authSignUpDoctorIsLoading} size="large" type="submit" variant="contained">
          Sign Up
        </LoadingButton>
      </form>
      <div className={styles.authFooter}>
        <span className={styles.authFooterText}>Have an account?</span>
        <Button component={NavLink} size="small" sx={{ ml: 1 }} to={PageUrls.SignIn}>
          Sign In
        </Button>
      </div>
    </>
  )
}
