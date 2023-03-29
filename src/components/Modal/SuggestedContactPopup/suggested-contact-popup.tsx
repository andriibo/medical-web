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

import { Relationship } from '~/enums/relationship.enum'
import { useValidationRules } from '~/hooks/use-validation-rules'
import { EmailField } from '~components/EmailField/email-field'
import { PhoneField } from '~components/Form/PhoneField/phone-field'
import { getErrorMessage } from '~helpers/get-error-message'
import { getObjectKeys } from '~helpers/get-object-keys'
import { trimValues } from '~helpers/trim-values'
import { IEmergencyContactModelKeys } from '~models/emergency-contact.model'
import { IErrorRequest } from '~models/error-request.model'
import { ISuggestedContactModel } from '~models/suggested-contact.model'
import { useAppDispatch } from '~stores/hooks'
import { usePostSuggestedContactMutation } from '~stores/services/suggested-contact.api'
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

  const [suggestedContact, { isLoading: suggestedContactIsLoading }] = usePostSuggestedContactMutation()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ISuggestedContactModel>({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (open) {
      setFormErrors(null)
      reset()
    }
  }, [open, reset])

  const initiateClosePopup = () => {
    handleClose()
    setTimeout(() => {
      dispatch(clearEmergencyContact())
    }, 300)
  }

  const onSubmit: SubmitHandler<ISuggestedContactModel> = async (data) => {
    try {
      await suggestedContact({
        ...trimValues(data),
        phone: data.phone.split('-').join(''),
        patientUserId,
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
  }

  const fieldValidation = (name: IEmergencyContactModelKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
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
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Button fullWidth onClick={initiateClosePopup} size="large" variant="outlined">
                Cancel
              </Button>
            </Grid>
            <Grid xs={6}>
              <LoadingButton
                fullWidth
                loading={suggestedContactIsLoading}
                size="large"
                type="submit"
                variant="contained"
              >
                Send
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}
