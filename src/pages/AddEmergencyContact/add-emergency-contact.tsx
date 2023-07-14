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
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { NavLink } from 'react-router-dom'

import { Relationship } from '~/enums/relationship.enum'
import { useValidationRules } from '~/hooks/use-validation-rules'
import { EmailField } from '~components/EmailField/email-field'
import { PhoneField } from '~components/Form/PhoneField/phone-field'
import { InviteGrantedUserPopup } from '~components/Modal/InviteGrantedUserPopup/invite-granted-user-popup'
import { getErrorMessage } from '~helpers/get-error-message'
import { getObjectKeys } from '~helpers/get-object-keys'
import { isRelationshipValue } from '~helpers/is-relationship-value'
import { preparePhoneForSending } from '~helpers/prepare-phone-for-sending'
import { trimValues } from '~helpers/trim-values'
import { IEmergencyContactPersonFormModel, IEmergencyContactPersonModelKeys } from '~models/emergency-contact.model'
import { IErrorRequest } from '~models/error-request.model'
import { useAppDispatch } from '~stores/hooks'
import { usePostPersonEmergencyContactMutation } from '~stores/services/emergency-contact.api'
import { setHasEmergencyContacts, useHasEmergencyContacts } from '~stores/slices/auth.slice'

import styles from './add-emergency-contact.module.scss'

export const AddEmergencyContact = () => {
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useAppDispatch()
  const hasEmergencyContacts = useHasEmergencyContacts()
  const { validationRules } = useValidationRules()
  const confirm = useConfirm()

  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const [invitePopupOpen, setInvitePopupOpen] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState<string | null>(null)

  const [addEmergencyContact, { isLoading: addEmergencyContactIsLoading }] = usePostPersonEmergencyContactMutation()

  const handleInvitePopupClose = () => {
    setInvitePopupOpen(false)
    setNewUserEmail(null)
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IEmergencyContactPersonFormModel>({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<IEmergencyContactPersonFormModel> = async (data) => {
    if (!isRelationshipValue(data.relationship)) return

    try {
      await addEmergencyContact({
        ...trimValues(data),
        relationship: data.relationship,
        phone: preparePhoneForSending(data.phone),
      }).unwrap()

      setFormErrors(null)
      enqueueSnackbar('Emergency contact added')
      dispatch(setHasEmergencyContacts(true))
      reset()

      await confirm({
        title: `Invite ${data.firstName} ${data.lastName} to follow your vitals?`,
        cancellationText: 'Not now',
        confirmationText: 'Yes, Invite',
      })

      setNewUserEmail(data.email)
      setInvitePopupOpen(true)
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: IEmergencyContactPersonModelKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <>
      <div className={styles.container}>
        <Typography sx={{ mb: 1 }} textAlign="center" variant="h6">
          Add emergency contacts
        </Typography>
        <Typography sx={{ mb: 3 }} textAlign="center" variant="body1">
          {hasEmergencyContacts
            ? 'Want to add one more emergency contact?'
            : 'Add at least one of your emergency contacts to continue'}
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
            defaultValue=""
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
          <LoadingButton
            fullWidth
            loading={addEmergencyContactIsLoading}
            size="large"
            type="submit"
            variant="contained"
          >
            Add
          </LoadingButton>
        </form>
        {hasEmergencyContacts && (
          <Button component={NavLink} fullWidth size="large" sx={{ mt: 2 }} to="/" variant="outlined">
            Skip
          </Button>
        )}
      </div>
      <InviteGrantedUserPopup handleClose={handleInvitePopupClose} initialEmail={newUserEmail} open={invitePopupOpen} />
    </>
  )
}
