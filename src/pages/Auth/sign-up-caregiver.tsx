import { ArrowBack } from '@mui/icons-material'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  AlertTitle,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { CaregiverRoleLabel } from '~/enums/roles.enum'
import { useEmailParam } from '~/hooks/use-email-param'
import { useValidationRules } from '~/hooks/use-validation-rules'
import { EmailField } from '~components/EmailField/email-field'
import { PasswordField } from '~components/Form/PasswordField/password-field'
import { PhoneField } from '~components/Form/PhoneField/phone-field'
import { getErrorMessage } from '~helpers/get-error-message'
import { getObjectKeys } from '~helpers/get-object-keys'
import { getUrlWithParams } from '~helpers/get-url-with-params'
import { trimValues } from '~helpers/trim-values'
import { AuthSignUpCaregiverKeys, IAuthSignUpCaregiver } from '~models/auth.model'
import { IErrorRequest } from '~models/error-request.model'
import { SignUpLegal } from '~pages/Auth/sign-up-legal'
import { usePostAuthSignUpCaregiverMutation } from '~stores/services/auth.api'

import styles from './auth.module.scss'

export const SignUpCaregiver = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const emailParam = useEmailParam()
  const { validationRules } = useValidationRules()

  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const [authSignUpCaregiver, { isLoading: authSignUpDoctorIsLoading }] = usePostAuthSignUpCaregiverMutation()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAuthSignUpCaregiver>({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<IAuthSignUpCaregiver> = async (data) => {
    try {
      await authSignUpCaregiver({ ...trimValues(data), email: emailParam || data.email }).unwrap()

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

  const fieldValidation = (name: AuthSignUpCaregiverKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <>
      <div className={styles.authHeader}>
        <IconButton component={NavLink} to={getUrlWithParams(PageUrls.AccountType)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">Create a Caregiver account</Typography>
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
          name="roleLabel"
          render={({ field }) => (
            <FormControl error={Boolean(errors[field.name])} fullWidth>
              <InputLabel id="role-label-select">Role</InputLabel>
              <Select {...field} label="Role" labelId="role-label-select">
                {getObjectKeys(CaregiverRoleLabel).map((key) => (
                  <MenuItem key={key} value={key}>
                    {CaregiverRoleLabel[key]}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{getErrorMessage(errors, field.name)}</FormHelperText>
            </FormControl>
          )}
          rules={validationRules.roleLabel}
        />
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
        <SignUpLegal />
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
