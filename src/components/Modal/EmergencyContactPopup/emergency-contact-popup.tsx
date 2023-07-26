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
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useMemo, useState } from 'react'
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
  usePatchOrganizationEmergencyContactMutation,
  usePatchPersonEmergencyContactMutation,
  usePostOrganizationEmergencyContactMutation,
  usePostPersonEmergencyContactMutation,
} from '~stores/services/emergency-contact.api'
import {
  clearEmergencyContact,
  useOrganizationEmergencyContact,
  usePersonEmergencyContact,
} from '~stores/slices/emergency-contact.slice'

interface EmergencyContactPopupProps {
  open: boolean
  handleClose: () => void
  handleInviteNewUser?: (email: string) => void
}

export const EmergencyContactPopup: FC<EmergencyContactPopupProps> = ({ open, handleClose, handleInviteNewUser }) => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const { validationRules } = useValidationRules()
  const confirm = useConfirm()
  const personEmergencyContact = usePersonEmergencyContact()
  const organizationEmergencyContact = useOrganizationEmergencyContact()

  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const [contactType, setContactType] = useState<EmergencyContactTypeKeys>('Person')

  const contactId = useMemo(
    () => personEmergencyContact.contactId || organizationEmergencyContact.contactId,
    [personEmergencyContact, organizationEmergencyContact],
  )

  const [addPersonEmergencyContact, { isLoading: addPersonEmergencyContactIsLoading }] =
    usePostPersonEmergencyContactMutation()
  const [editPersonEmergencyContact, { isLoading: editPersonEmergencyContactIsLoading }] =
    usePatchPersonEmergencyContactMutation()

  const [addOrganizationEmergencyContact, { isLoading: addOrganizationEmergencyContactIsLoading }] =
    usePostOrganizationEmergencyContactMutation()
  const [editOrganizationEmergencyContact, { isLoading: editOrganizationEmergencyContactIsLoading }] =
    usePatchOrganizationEmergencyContactMutation()

  const {
    handleSubmit: personHandleSubmit,
    control: personControl,
    reset: personReset,
    formState: { errors: personErrors },
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
      if (organizationEmergencyContact.contactId) {
        setContactType('Organization')
      } else {
        setContactType('Person')
      }

      personReset(personEmergencyContact)
      organizationReset(organizationEmergencyContact)
    }
  }, [personEmergencyContact, organizationEmergencyContact, open, personReset, organizationReset])

  const handleContactType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormErrors(null)
    personReset(personEmergencyContact)
    organizationReset(organizationEmergencyContact)

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

  const onSubmitPerson: SubmitHandler<IPersonEmergencyContactFormModel> = async (data) => {
    if (!data.relationship) return

    if (contactId) {
      try {
        await editPersonEmergencyContact({
          contactId,
          contact: {
            ...trimValues(data),
            phone: preparePhoneForSending(data.phone),
            relationship: data.relationship,
          },
        }).unwrap()

        initiateClosePopup()
        enqueueSnackbar('Emergency contact updated')
      } catch (err) {
        const {
          data: { message },
        } = err as IErrorRequest

        setFormErrors(Array.isArray(message) ? message : [message])

        console.error(err)
      }

      return
    }

    try {
      await addPersonEmergencyContact({
        ...data,
        relationship: data.relationship,
        phone: preparePhoneForSending(data.phone),
      }).unwrap()

      initiateClosePopup()
      setFormErrors(null)
      enqueueSnackbar('Emergency contact added')

      await confirm({
        title: `Invite ${data.firstName} ${data.lastName} to follow your vitals?`,
        cancellationText: 'Not now',
        confirmationText: 'Yes, Invite',
      })

      if (handleInviteNewUser) {
        handleInviteNewUser(data.email)
      }
    } catch (err) {
      if (err) {
        const {
          data: { message },
        } = err as IErrorRequest

        setFormErrors(Array.isArray(message) ? message : [message])

        console.error(err)
      }
    }
  }

  const onOrganizationSubmit: SubmitHandler<IOrganizationEmergencyContactFormModel> = async (data) => {
    if (!data.type) return

    if (contactId) {
      try {
        await editOrganizationEmergencyContact({
          contactId,
          contact: {
            ...trimValues(data),
            type: data.type,
          },
        }).unwrap()

        initiateClosePopup()
        setFormErrors(null)
        enqueueSnackbar('Emergency contact updated')
      } catch (err) {
        const {
          data: { message },
        } = err as IErrorRequest

        setFormErrors(Array.isArray(message) ? message : [message])

        console.error(err)
      }

      return
    }

    try {
      await addOrganizationEmergencyContact({
        ...trimValues(data),
        type: data.type,
        email: data.email || null,
        fax: data.fax || null,
      }).unwrap()

      initiateClosePopup()
      setFormErrors(null)
      enqueueSnackbar('Emergency contact added')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const personFieldValidation = (name: IPersonEmergencyContactModelKeys) => ({
    error: Boolean(personErrors[name]),
    helperText: getErrorMessage(personErrors, name),
  })

  const organizationFieldValidation = (name: IOrganizationEmergencyContactModelKeys) => ({
    error: Boolean(organizationErrors[name]),
    helperText: getErrorMessage(organizationErrors, name),
  })

  return (
    <Dialog fullWidth maxWidth="xs" onClose={initiateClosePopup} open={open} scroll="body">
      <DialogTitle>{contactId ? 'Edit' : 'New'} emergency contact</DialogTitle>
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
              <FormControlLabel
                control={<Radio />}
                disabled={Boolean(contactId)}
                key={contactType}
                label={contactType}
                value={contactType}
              />
            ))}
          </RadioGroup>
        </FormControl>
        {contactType === 'Person' ? (
          <form key="person" onSubmit={personHandleSubmit(onSubmitPerson)}>
            <Grid container spacing={3}>
              <Grid xs={6}>
                <Controller
                  control={personControl}
                  defaultValue=""
                  name="firstName"
                  render={({ field }) => (
                    <TextField {...field} {...personFieldValidation(field.name)} fullWidth label="First name" />
                  )}
                  rules={validationRules.text}
                />
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={personControl}
                  defaultValue=""
                  name="lastName"
                  render={({ field }) => (
                    <TextField {...field} {...personFieldValidation(field.name)} fullWidth label="Last name" />
                  )}
                  rules={validationRules.text}
                />
              </Grid>
            </Grid>
            <Controller
              control={personControl}
              defaultValue=""
              name="phone"
              render={({ field }) => <PhoneField field={field} fieldValidation={personFieldValidation(field.name)} />}
              rules={validationRules.phone}
            />
            <Controller
              control={personControl}
              defaultValue=""
              name="email"
              render={({ field }) => <EmailField field={field} fieldValidation={personFieldValidation(field.name)} />}
              rules={validationRules.email}
            />
            <Controller
              control={personControl}
              defaultValue=""
              name="relationship"
              render={({ field }) => (
                <FormControl error={Boolean(personErrors[field.name])} fullWidth>
                  <InputLabel id="relationship-select">Relationship</InputLabel>
                  <Select {...field} label="Relationship" labelId="relationship-select">
                    {getObjectKeys(Relationship).map((key) => (
                      <MenuItem key={key} value={key}>
                        {Relationship[key]}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{getErrorMessage(personErrors, field.name)}</FormHelperText>
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
                  loading={addPersonEmergencyContactIsLoading || editPersonEmergencyContactIsLoading}
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  {contactId ? 'Edit' : 'Add'}
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
                  loading={addOrganizationEmergencyContactIsLoading || editOrganizationEmergencyContactIsLoading}
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  {contactId ? 'Edit' : 'Add'}
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
