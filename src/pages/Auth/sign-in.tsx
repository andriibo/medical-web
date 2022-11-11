import { Visibility, VisibilityOff } from '@mui/icons-material'
import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, AlertTitle, Button, IconButton, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'

import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { IErrorRequest } from '~models/error-request.model'
import styles from '~pages/Auth/auth.module.scss'
import { useAppDispatch } from '~stores/hooks'
import { usePostAuthSignInMutation } from '~stores/services/auth.api'
import { signInSuccess } from '~stores/slices/auth.slice'
import { PostAuthSignInRequest, PostAuthSignInRequestKeys } from '~stores/types/auth.types'

export const SignIn = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [authSignIn, { isLoading: authSignInIsLoading }] = usePostAuthSignInMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PostAuthSignInRequest>({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<PostAuthSignInRequest> = (data) => {
    authSignIn(data)
      .unwrap()
      .then((response) => {
        console.log(response)

        dispatch(signInSuccess(response))

        setFormErrors(null)
        navigate('/patient')
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

  const fieldValidation = (name: PostAuthSignInRequestKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <>
      <div className={styles.authHeader}>
        <Typography variant="h6">Sign in to your account</Typography>
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
        <Controller
          control={control}
          defaultValue=""
          name="email"
          render={({ field }) => <TextField {...field} {...fieldValidation(field.name)} fullWidth label="Email" />}
          rules={validationRules.email}
        />
        <Controller
          control={control}
          defaultValue=""
          name="password"
          render={({ field }) => (
            <TextField
              type={showPassword ? 'text' : 'password'}
              {...field}
              {...fieldValidation(field.name)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleShowPassword} size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              fullWidth
              label="Password"
            />
          )}
          rules={validationRules.password}
        />
        <div className={styles.authHelperBox}>
          <Button component={NavLink} size="small" to="">
            Forgot password?
          </Button>
        </div>
        <LoadingButton fullWidth loading={authSignInIsLoading} size="large" type="submit" variant="contained">
          Sign In
        </LoadingButton>
      </form>
      <div className={styles.authFooter}>
        <span className={styles.authFooterText}>Don’t have an account?</span>
        <Button component={NavLink} size="small" to="/account-type">
          Sign Up
        </Button>
      </div>
    </>
  )
}
