import { LoadingButton } from '@mui/lab'
import {
  Alert,
  AlertTitle,
  Button,
  FormControl,
  FormHelperText,
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
import { NavLink } from 'react-router-dom'

import { Relationship } from '~/enums/relationship.enum'
import { EmailField } from '~components/EmailField/email-field'
import { PhoneField } from '~components/PhoneField/phone-field'
import { getErrorMessage } from '~helpers/get-error-message'
import { getObjectKeys } from '~helpers/get-object-keys'
import { validationRules } from '~helpers/validation-rules'
import { IEmergencyContactModel, IEmergencyContactModelKeys } from '~models/emergency-contact.model'
import { IErrorRequest } from '~models/error-request.model'
import { useAppDispatch } from '~stores/hooks'
import { usePostMyEmergencyContactMutation } from '~stores/services/emergency-contact.api'
import { setHasEmergencyContacts, useHasEmergencyContacts } from '~stores/slices/auth.slice'

import styles from './add-emergency-contact.module.scss'

export const AddEmergencyContact = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const hasEmergencyContacts = useHasEmergencyContacts()

  const [addEmergencyContact, { isLoading: addEmergencyContactIsLoading }] = usePostMyEmergencyContactMutation()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IEmergencyContactModel>({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<IEmergencyContactModel> = async (data) => {
    try {
      await addEmergencyContact({
        ...data,
        phone: data.phone.split('-').join(''),
      }).unwrap()

      setFormErrors(null)
      enqueueSnackbar('Emergency contact added')
      dispatch(setHasEmergencyContacts(true))
      reset()
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: IEmergencyContactModelKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <div className={styles.container}>
      <Typography sx={{ mb: 1 }} textAlign="center" variant="h6">
        Add your emergency contacts
      </Typography>
      <Typography sx={{ mb: 3 }} textAlign="center" variant="body1">
        Add at least one of your emergency contacts to continue
      </Typography>
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
          name="email"
          render={({ field }) => <EmailField field={field} fieldValidation={fieldValidation(field.name)} />}
          rules={validationRules.email}
        />
        <Controller
          control={control}
          defaultValue="Friends&Family"
          name="relationship"
          render={({ field }) => (
            <FormControl error={Boolean(errors[field.name])} fullWidth>
              <InputLabel id="relationship-select">Relationship</InputLabel>
              <Select {...field} label="Relationship" labelId="relationship-select">
                {getObjectKeys(Relationship).map((key) => (
                  <MenuItem key={key} value={key}>
                    {Relationship[key]}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{getErrorMessage(errors, field.name)}</FormHelperText>
            </FormControl>
          )}
          rules={validationRules.relationship}
        />
        <LoadingButton fullWidth loading={addEmergencyContactIsLoading} size="large" type="submit" variant="contained">
          Add
        </LoadingButton>
      </form>
      {hasEmergencyContacts && (
        <div className={styles.footer}>
          <span className={styles.footerText}>Want to add later?</span>
          <Button component={NavLink} size="small" sx={{ ml: 1 }} to="/">
            Skip
          </Button>
        </div>
      )}
    </div>
  )
}
