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
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'

import { Gender } from '~/enums/gender.enum'
import { PageUrls } from '~/enums/page-urls.enum'
import { useEmailParam } from '~/hooks/use-email-param'
import { useValidationRules } from '~/hooks/use-validation-rules'
import { EmailField } from '~components/EmailField/email-field'
import { DobField } from '~components/Form/DobField/dob-field'
import { NumberField } from '~components/Form/NumberField/number-field'
import { PasswordField } from '~components/Form/PasswordField/password-field'
import { PhoneField } from '~components/Form/PhoneField/phone-field'
import { convertToUtc } from '~helpers/date-helper'
import { getErrorMessage } from '~helpers/get-error-message'
import { getUrlWithParams } from '~helpers/get-url-with-params'
import { trimValues } from '~helpers/trim-values'
import { AuthSignUpPatientKeys, IAuthSignUpPatientForm } from '~models/auth.model'
import { IErrorRequest } from '~models/error-request.model'
import { usePostAuthSignUpPatientMutation } from '~stores/services/auth.api'

import styles from './auth.module.scss'

export const SignUpPatient = () => {
  const navigate = useNavigate()
  const [authSignUpPatient, { isLoading: authSignUpPatientIsLoading }] = usePostAuthSignUpPatientMutation()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const emailParam = useEmailParam()
  const { validationRules, validationProps } = useValidationRules()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAuthSignUpPatientForm>({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<IAuthSignUpPatientForm> = async (data) => {
    try {
      await authSignUpPatient({
        ...trimValues(data),
        dob: convertToUtc(data.dob),
        email: emailParam || data.email,
        gender: data.gender as Gender,
        height: Number(data.height),
        weight: Number(data.weight),
      }).unwrap()

      setFormErrors(null)
      navigate(PageUrls.EmailVerification, { state: { email: emailParam || data.email } })
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: AuthSignUpPatientKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <>
      <div className={styles.authHeader}>
        <IconButton component={NavLink} to={getUrlWithParams(PageUrls.AccountType)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">Create a patient account</Typography>
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
          name="dob"
          render={({ field }) => <DobField field={field} fieldValidation={fieldValidation(field.name)} />}
          rules={validationRules.dob}
        />
        <Controller
          control={control}
          defaultValue=""
          name="gender"
          render={({ field }) => (
            <FormControl error={Boolean(errors[field.name])} fullWidth>
              <InputLabel id="gender-select">Gender</InputLabel>
              <Select {...field} label="Gender" labelId="gender-select">
                {Object.values(Gender).map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{getErrorMessage(errors, field.name)}</FormHelperText>
            </FormControl>
          )}
          rules={validationRules.gender}
        />
        <Grid container spacing={3}>
          <Grid xs={6}>
            <Controller
              control={control}
              defaultValue=""
              name="height"
              render={({ field }) => (
                <NumberField
                  field={field}
                  fieldValidation={fieldValidation(field.name)}
                  helperText={`
                    from ${validationProps.height.min} to ${validationProps.height.max} ${validationProps.height.unit}
                  `}
                  label="Height"
                  validationProps={validationProps.height}
                />
              )}
              rules={validationRules.height}
            />
          </Grid>
          <Grid xs={6}>
            <Controller
              control={control}
              defaultValue=""
              name="weight"
              render={({ field }) => (
                <NumberField
                  field={field}
                  fieldValidation={fieldValidation(field.name)}
                  helperText={`
                    from ${validationProps.weight.min} to ${validationProps.weight.max}  ${validationProps.weight.unit}
                  `}
                  label="Weight"
                  validationProps={validationProps.weight}
                />
              )}
              rules={validationRules.weight}
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
        <LoadingButton fullWidth loading={authSignUpPatientIsLoading} size="large" type="submit" variant="contained">
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
