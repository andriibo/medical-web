import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, AlertTitle, Button, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { NavLink, useSearchParams } from 'react-router-dom'

import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { IErrorRequest } from '~models/error-request.model'
import { usePostAuthConfirmSignUpMutation } from '~stores/services/auth.api'

import styles from './auth.module.scss'

export const EmailVerification = () => {
  const [authConfirmSignUp, { isLoading: authConfirmSignUpIsLoading }] = usePostAuthConfirmSignUpMutation()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')?.replace(' ', '+') || ''

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const onSubmit: SubmitHandler<FieldValues> = ({ code }) => {
    authConfirmSignUp({
      email,
      code,
    })
      .unwrap()
      .then(() => {
        setFormErrors(null)
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

  const fieldValidation = (name: string) => ({
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
                  <TextField {...fieldValidation(field.name)} autoComplete="off" fullWidth label="Verification code" />
                )
              }
            </InputMask>
          )}
          rules={validationRules.code}
        />
        <LoadingButton fullWidth loading={authConfirmSignUpIsLoading} size="large" type="submit" variant="contained">
          verify
        </LoadingButton>
        <Button fullWidth size="large" sx={{ mt: 2 }} type="button" variant="outlined">
          Cancel
        </Button>
      </form>
      <div className={styles.authFooter}>
        <span className={styles.authFooterText}>Need a new verification code?</span>
        <Button component={NavLink} disabled size="small" to="/sign-in">
          Resend
        </Button>
      </div>
    </>
  )
}
