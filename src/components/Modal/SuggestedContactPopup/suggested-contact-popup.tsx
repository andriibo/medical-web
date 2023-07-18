import { LoadingButton } from '@mui/lab'
import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { EmergencyContactType, EmergencyContactTypeKeys } from '~/enums/emergency-contact-type.enum'
import { OrganizationType } from '~/enums/organization-type.enum'
import { Relationship } from '~/enums/relationship.enum'
import { useValidationRules } from '~/hooks/use-validation-rules'
import { EmailField } from '~components/Form/EmailField/email-field'
import { PhoneField } from '~components/Form/PhoneField/phone-field'
import { getErrorMessage } from '~helpers/get-error-message'
import { getObjectKeys } from '~helpers/get-object-keys'
import { preparePhoneForSending } from '~helpers/prepare-phone-for-sending'
import { trimValues } from '~helpers/trim-values'
import {
  IOrganizationEmergencyContactFormModel,
  IOrganizationEmergencyContactModelKeys,
  IPersonEmergencyContactFormModel,
  IPersonEmergencyContactModelKeys,
} from '~models/emergency-contact.model'
import { IErrorRequest } from '~models/error-request.model'
import { useAppDispatch } from '~stores/hooks'
import {
  usePostOrganizationSuggestedContactMutation,
  usePostPersonSuggestedContactMutation,
} from '~stores/services/suggested-contact.api'
import { clearEmergencyContact } from '~stores/slices/emergency-contact.slice'

interface SuggestedContactPopupProps {
  open: boolean
  handleClose: () => void
  patientUserId: string
}

export const SuggestedContactPopup: FC<SuggestedContactPopupProps> = ({ open, handleClose, patientUserId }) => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const { validationRules } = useValidationRules()

  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const [contactType, setContactType] = useState<EmergencyContactTypeKeys>('Person')

  const [addPersonSuggestedContact, { isLoading: addPersonSuggestedContactIsLoading }] =
    usePostPersonSuggestedContactMutation()
  const [addOrganizationSuggestedContact, { isLoading: addOrganizationSuggestedContactIsLoading }] =
    usePostOrganizationSuggestedContactMutation()

  const {
    handleSubmit,
    control,
    reset: personReset,
    formState: { errors },
  } = useForm<IPersonEmergencyContactFormModel>({
    mode: 'onBlur',
  })

  const {
    handleSubmit: organizationHandleSubmit,
    control: organizationControl,
    reset: organizationReset,
    formState: { errors: organizationErrors },
  } = useForm<IOrganizationEmergencyContactFormModel>({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (open) {
      setFormErrors(null)
      personReset()
    }
  }, [open, personReset])

  const handleContactType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormErrors(null)
    personReset()
    organizationReset()

    setContactType(event.target.value as EmergencyContactTypeKeys)
  }

  const initiateClosePopup = () => {
    handleClose()
    setTimeout(() => {
      setFormErrors(null)
      setContactType('Person')
      dispatch(clearEmergencyContact())
    }, 300)
  }

  const onSubmit: SubmitHandler<IPersonEmergencyContactFormModel> = async (data) => {
    if (!data.relationship) return

    try {
      await addPersonSuggestedContact({
        ...trimValues(data),
        phone: preparePhoneForSending(data.phone),
        relationship: data.relationship,
        patientUserId,
      }).unwrap()

      initiateClosePopup()
      setFormErrors(null)
      enqueueSnackbar('Emergency contact sent')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const onOrganizationSubmit: SubmitHandler<IOrganizationEmergencyContactFormModel> = async (data) => {
    if (!data.type) return

    try {
      await addOrganizationSuggestedContact({
        ...trimValues(data),
        type: data.type,
        patientUserId,
      }).unwrap()

      initiateClosePopup()
      setFormErrors(null)
      enqueueSnackbar('Emergency contact sent')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: IPersonEmergencyContactModelKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  const organizationFieldValidation = (name: IOrganizationEmergencyContactModelKeys) => ({
    error: Boolean(organizationErrors[name]),
    helperText: getErrorMessage(organizationErrors, name),
  })

  return (
    <Dialog fullWidth maxWidth="xs" onClose={initiateClosePopup} open={open} scroll="body">
      <DialogTitle>Suggest a contact</DialogTitle>
      <DialogContent>
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
        <FormControl sx={{ mb: 3 }}>
          <RadioGroup name="row-radio-buttons-group" onChange={handleContactType} row value={contactType}>
            {getObjectKeys(EmergencyContactType).map((contactType) => (
              <FormControlLabel control={<Radio />} key={contactType} label={contactType} value={contactType} />
            ))}
          </RadioGroup>
        </FormControl>
        {contactType === 'Person' ? (
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
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Button fullWidth onClick={initiateClosePopup} size="large" variant="outlined">
                  Cancel
                </Button>
              </Grid>
              <Grid xs={6}>
                <LoadingButton
                  fullWidth
                  loading={addPersonSuggestedContactIsLoading}
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Send
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        ) : (
          <form key="organization" onSubmit={organizationHandleSubmit(onOrganizationSubmit)}>
            <Controller
              control={organizationControl}
              defaultValue=""
              name="type"
              render={({ field }) => (
                <FormControl error={Boolean(organizationErrors[field.name])} fullWidth>
                  <InputLabel id="type-select">Type</InputLabel>
                  <Select {...field} label="Type" labelId="type-select">
                    {getObjectKeys(OrganizationType).map((key) => (
                      <MenuItem key={key} value={OrganizationType[key]}>
                        {OrganizationType[key]}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{getErrorMessage(organizationErrors, field.name)}</FormHelperText>
                </FormControl>
              )}
              rules={validationRules.type}
            />
            <Controller
              control={organizationControl}
              defaultValue=""
              name="name"
              render={({ field }) => (
                <TextField {...field} {...organizationFieldValidation(field.name)} fullWidth label="Name" />
              )}
              rules={validationRules.text}
            />
            <Controller
              control={organizationControl}
              defaultValue=""
              name="phone"
              render={({ field }) => (
                <PhoneField field={field} fieldValidation={organizationFieldValidation(field.name)} />
              )}
              rules={validationRules.phone}
            />
            <Controller
              control={organizationControl}
              defaultValue=""
              name="email"
              render={({ field }) => (
                <EmailField
                  field={field}
                  fieldValidation={organizationFieldValidation(field.name)}
                  label="Email (optional)"
                />
              )}
              rules={validationRules.emailNotRequired}
            />
            <Controller
              control={organizationControl}
              defaultValue=""
              name="fax"
              render={({ field }) => (
                <PhoneField
                  field={field}
                  fieldValidation={organizationFieldValidation(field.name)}
                  label="Fax number (optional)"
                />
              )}
              rules={validationRules.fax}
            />
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Button fullWidth onClick={initiateClosePopup} size="large" variant="outlined">
                  Cancel
                </Button>
              </Grid>
              <Grid xs={6}>
                <LoadingButton
                  fullWidth
                  loading={addPersonSuggestedContactIsLoading || addOrganizationSuggestedContactIsLoading}
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Send
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
