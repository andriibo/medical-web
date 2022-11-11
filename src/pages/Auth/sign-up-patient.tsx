import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  AlertTitle,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { NavLink, useNavigate } from 'react-router-dom'

import { GenderEnum } from '~/enums/gender.enum'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { IErrorRequest } from '~models/error-request.model'
import { usePostAuthSignUpPatientMutation } from '~stores/services/auth.api'
import { PostAuthSignUpPatientForm, PostAuthSignUpPatientRequestKeys } from '~stores/types/auth.types'

import styles from './auth.module.scss'

export const SignUpPatient = () => {
  const navigate = useNavigate()
  const [authSignUpPatient, { isLoading: authSignUpPatientIsLoading }] = usePostAuthSignUpPatientMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PostAuthSignUpPatientForm>({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<PostAuthSignUpPatientForm> = (data) => {
    authSignUpPatient({
      ...data,
      gender: GenderEnum[data.gender as keyof typeof GenderEnum],
      height: Number(data.height),
      weight: Number(data.weight),
      phone: data.phone.split('-').join(''),
    })
      .unwrap()
      .then(() => {
        setFormErrors(null)
        navigate('/email-verification', { state: { email: data.email } })
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

  const fieldValidation = (name: PostAuthSignUpPatientRequestKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <>
      <div className={styles.authHeader}>
        <IconButton component={NavLink} to="/account-type">
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
          render={({ field }) => {
            const currentDate = new Date()
            const yearOffset = 0
            const maxDate = currentDate.setFullYear(currentDate.getFullYear() - yearOffset)

            return (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  {...field}
                  disableFuture
                  inputFormat="YYYY/MM/DD"
                  maxDate={dayjs(maxDate)}
                  minDate={dayjs('1930-01-01')}
                  openTo="year"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...fieldValidation(field.name)}
                      autoComplete="off"
                      fullWidth
                      label="Date of birth"
                    />
                  )}
                  views={['year', 'month', 'day']}
                />
              </LocalizationProvider>
            )
          }}
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
                {Object.keys(GenderEnum).map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {GenderEnum[gender as keyof typeof GenderEnum]}
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
                <TextField
                  prefix="cm"
                  {...field}
                  {...fieldValidation(field.name)}
                  InputProps={{
                    inputProps: { min: 50, max: 250, step: 1 },
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                  }}
                  fullWidth
                  label="Height"
                  type="number"
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
                <TextField
                  prefix="cm"
                  {...field}
                  {...fieldValidation(field.name)}
                  InputProps={{
                    inputProps: { min: 10, max: 200, step: 1 },
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  }}
                  fullWidth
                  label="Weight"
                  type="number"
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
                () => <TextField {...fieldValidation(field.name)} fullWidth label="Phone number" />
              }
            </InputMask>
          )}
          rules={validationRules.phone}
        />
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
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleShowPassword} sx={{ mr: '-12px' }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              {...fieldValidation(field.name)}
              fullWidth
              label="Password"
            />
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
        <Button component={NavLink} size="small" to="/sign-in">
          Sign In
        </Button>
      </div>
    </>
  )
}
