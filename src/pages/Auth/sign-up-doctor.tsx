import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material'
import { Alert, AlertTitle, Button, IconButton, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useState } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { NavLink } from 'react-router-dom'

import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { IErrorRequest } from '~models/error-request.model'
import { usePostAuthSignUpDoctorMutation } from '~stores/services/auth.api'

import styles from './auth.module.scss'

export const SignUpDoctor = () => {
  const [authSignUpDoctor, { isLoading: authSignUpDoctorIsLoading }] = usePostAuthSignUpDoctorMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  })

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const onSubmit: SubmitHandler<FieldValues> = ({ firstName, lastName, email, phone, institution, password }) => {
    const phoneFormatted = phone.split('-').join('')

    authSignUpDoctor({ firstName, lastName, email, phone: phoneFormatted, institution, password })
      .unwrap()
      .then((response) => {
        console.log(response)
      })
      .catch((err: IErrorRequest) => {
        const {
          data: { message },
        } = err

        console.error(err)
        if (Array.isArray(message)) {
          setFormErrors(message)
        } else {
          setFormErrors([message])
        }
      })
  }

  return (
    <>
      <div className={styles.authHeader}>
        <IconButton component={NavLink} to="/account-type">
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
                <TextField
                  {...field}
                  error={Boolean(errors[field.name])}
                  fullWidth
                  helperText={getErrorMessage(errors, field.name)}
                  label="First name"
                />
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
                <TextField
                  {...field}
                  error={Boolean(errors[field.name])}
                  fullWidth
                  helperText={getErrorMessage(errors, field.name)}
                  label="Last name"
                />
              )}
              rules={validationRules.text}
            />
          </Grid>
        </Grid>
        <Controller
          control={control}
          defaultValue=""
          name="email"
          render={({ field }) => (
            <TextField
              {...field}
              error={Boolean(errors[field.name])}
              fullWidth
              helperText={getErrorMessage(errors, field.name)}
              label="Email"
            />
          )}
          rules={validationRules.email}
        />
        <Controller
          control={control}
          defaultValue=""
          name="phone"
          render={({ field }) => (
            <InputMask
              mask="1-999-999-9999"
              onChange={(value): void => {
                field.onChange(value)
              }}
              value={field.value}
            >
              {
                // @ts-ignore
                () => (
                  <TextField
                    error={Boolean(errors[field.name])}
                    fullWidth
                    helperText={getErrorMessage(errors, field.name)}
                    label="Phone number"
                  />
                )
              }
            </InputMask>
          )}
          rules={validationRules.phone}
        />
        <Controller
          control={control}
          defaultValue=""
          name="institution"
          render={({ field }) => <TextField {...field} fullWidth label="Institution (optional)" />}
        />
        <Controller
          control={control}
          defaultValue=""
          name="password"
          render={({ field }) => (
            <TextField
              type={showPassword ? 'text' : 'password'}
              {...field}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleShowPassword} size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              error={Boolean(errors[field.name])}
              fullWidth
              helperText={getErrorMessage(errors, field.name)}
              label="Password"
            />
          )}
          rules={validationRules.password}
        />
        <Typography sx={{ mb: '1.5rem' }} variant="body2">
          By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.
        </Typography>
        <Button fullWidth size="large" type="submit" variant="contained">
          Sign Up
        </Button>
      </form>
      <div className={styles.authFooter}>
        <span className={styles.authFooterText}>Have an account?</span>
        <Button component={NavLink} size="small" to="/sign-in">
          Sign In
        </Button>
      </div>
    </>
  )
}
