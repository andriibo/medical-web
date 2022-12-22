import { LoadingButton } from '@mui/lab'
import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'

import { Relationship, RelationshipValues } from '~/enums/relationship.enum'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { IEmergencyContact, IEmergencyContactModel, IEmergencyContactModelKeys } from '~models/emergency-contact.model'
import { IErrorRequest } from '~models/error-request.model'
import {
  usePatchPatientEmergencyContactMutation,
  usePostMyEmergencyContactMutation,
} from '~stores/services/emergency-contact.api'

interface NewEmergencyContactPopupProps {
  open: boolean
  handleClose: () => void
  contactData?: IEmergencyContact
}

export const NewEmergencyContactPopup: FC<NewEmergencyContactPopupProps> = ({ open, handleClose, contactData }) => {
  console.log('NewEmergencyContactPopup')
  const { enqueueSnackbar } = useSnackbar()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const [addEmergencyContact, { isLoading: addEmergencyContactIsLoading }] = usePostMyEmergencyContactMutation()

  const [editEmergencyContact] = usePatchPatientEmergencyContactMutation()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IEmergencyContactModel>({
    mode: 'onBlur',
    defaultValues: contactData || undefined,
  })

  useEffect(() => {
    if (open) {
      setFormErrors(null)
      reset()
    }
  }, [open, reset])

  const onSubmit: SubmitHandler<IEmergencyContactModel> = async (data) => {
    if (contactData) {
      try {
        await editEmergencyContact({
          contactId: contactData.contactId,
          contact: {
            ...data,
            phone: data.phone.split('-').join(''),
          },
        }).unwrap()

        handleClose()
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
      await addEmergencyContact({
        ...data,
        phone: data.phone.split('-').join(''),
      }).unwrap()

      handleClose()
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

  const fieldValidation = (name: IEmergencyContactModelKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open} scroll="body">
      <DialogTitle>New emergency contact</DialogTitle>
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
            render={({ field }) => (
              <InputMask
                mask="1-999-999-9999"
                onChange={(event): void => {
                  const value = event.target.value.split('-').join('')

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
            defaultValue="Friends&Family"
            name="relationship"
            render={({ field }) => (
              <FormControl error={Boolean(errors[field.name])} fullWidth>
                <InputLabel id="relationship-select">Relationship</InputLabel>
                <Select {...field} label="Relationship" labelId="relationship-select">
                  {Object.keys(Relationship).map((key) => {
                    const value = key as RelationshipValues

                    return (
                      <MenuItem key={value} value={value}>
                        {Relationship[value]}
                      </MenuItem>
                    )
                  })}
                </Select>
                <FormHelperText>{getErrorMessage(errors, field.name)}</FormHelperText>
              </FormControl>
            )}
            rules={validationRules.relationship}
          />
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Button fullWidth onClick={handleClose} size="large" variant="outlined">
                Cancel
              </Button>
            </Grid>
            <Grid xs={6}>
              <LoadingButton
                fullWidth
                loading={addEmergencyContactIsLoading}
                size="large"
                type="submit"
                variant="contained"
              >
                Add
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}
