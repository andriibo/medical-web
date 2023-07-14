import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'

import { AuthErrorMessage } from '~/enums/auth-error-message.enum'
import { PageUrls } from '~/enums/page-urls.enum'
import { UserRole } from '~/enums/roles.enum'
import { useValidationRules } from '~/hooks/use-validation-rules'
import { EmailField } from '~components/EmailField/email-field'
import { PasswordField } from '~components/Form/PasswordField/password-field'
import { getErrorMessage } from '~helpers/get-error-message'
import { trimValues } from '~helpers/trim-values'
import { AuthSignInKeys, IAuthSignIn } from '~models/auth.model'
import { IErrorRequest } from '~models/error-request.model'
import styles from '~pages/Auth/auth.module.scss'
import { useAppDispatch } from '~stores/hooks'
import { usePostAuthSignInMutation } from '~stores/services/auth.api'
import { useLazyGetEmergencyContactsQuery } from '~stores/services/emergency-contact.api'
import { setHasEmergencyContacts, signInSuccess } from '~stores/slices/auth.slice'
import { setEmergencyContactIsLoading, useEmergencyContactIsLoading } from '~stores/slices/emergency-contact.slice'

export const SignIn = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const emergencyContactIsLoading = useEmergencyContactIsLoading()
  const { validationRules } = useValidationRules()

  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const [currentEmail, setCurrentEmail] = useState<string | null>(null)

  const [authSignIn, { isLoading: authSignInIsLoading }] = usePostAuthSignInMutation()
  const [myEmergencyContacts] = useLazyGetEmergencyContactsQuery()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAuthSignIn>({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<IAuthSignIn> = async (data) => {
    try {
      dispatch(setEmergencyContactIsLoading(true))
      const response = await authSignIn({ ...trimValues(data), rememberMe: false }).unwrap()

      dispatch(signInSuccess(response))
      setFormErrors(null)

      if (response.user.role === UserRole.Patient) {
        const emergencyContact = await myEmergencyContacts().unwrap()

        if (!emergencyContact.persons.length) {
          dispatch(setHasEmergencyContacts(false))

          navigate(PageUrls.AddEmergencyContact, { replace: true })

          return
        }
      }

      dispatch(setHasEmergencyContacts(true))

      navigate('/', { replace: true })
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setCurrentEmail(data.email)
      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    } finally {
      dispatch(setEmergencyContactIsLoading(false))
    }
  }

  const fieldValidation = (name: AuthSignInKeys) => ({
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
          {formErrors.includes(AuthErrorMessage.notConfirmed) && (
            <Box sx={{ mt: 1 }}>
              <NavLink state={{ email: currentEmail }} to={PageUrls.EmailVerification}>
                Verify your email
              </NavLink>
            </Box>
          )}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          defaultValue=""
          name="email"
          render={({ field }) => <EmailField field={field} fieldValidation={fieldValidation(field.name)} />}
          rules={validationRules.email}
        />
        <Controller
          control={control}
          defaultValue=""
          name="password"
          render={({ field }) => (
            <PasswordField autoComplete field={field} fieldValidation={fieldValidation(field.name)} />
          )}
          rules={validationRules.signInPassword}
        />
        <div className={styles.authHelperBox}>
          <Button component={NavLink} size="small" to={PageUrls.ForgotPassword}>
            Forgot password?
          </Button>
        </div>
        <LoadingButton
          fullWidth
          loading={authSignInIsLoading || emergencyContactIsLoading}
          size="large"
          type="submit"
          variant="contained"
        >
          Sign In
        </LoadingButton>
      </form>
      <div className={styles.authFooter}>
        <span className={styles.authFooterText}>Don’t have an account?</span>
        <Button component={NavLink} size="small" sx={{ ml: 1 }} to={PageUrls.AccountType}>
          Sign Up
        </Button>
      </div>
    </>
  )
}
