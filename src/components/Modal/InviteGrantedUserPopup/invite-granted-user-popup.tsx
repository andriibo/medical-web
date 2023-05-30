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
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { DoctorRoleLabel, GrantedUserLabel } from '~/enums/roles.enum'
import { useValidationRules } from '~/hooks/use-validation-rules'
import { EmailField } from '~components/EmailField/email-field'
import { getErrorMessage } from '~helpers/get-error-message'
import { getObjectKeys } from '~helpers/get-object-keys'
import { trimValues } from '~helpers/trim-values'
import { DataAccessInitiateForGrantedUserKeys, IDataAccessInitiateForGrantedUser } from '~models/data-access.model'
import { IErrorRequest } from '~models/error-request.model'
import {
  usePostPatientDataAccessInitiateForCaregiverMutation,
  usePostPatientDataAccessInitiateForDoctorMutation,
} from '~stores/services/patient-data-access.api'

interface InviteDoctorPopupProps {
  open: boolean
  handleClose: () => void
}

export const InviteGrantedUserPopup: FC<InviteDoctorPopupProps> = ({ open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const { validationRules } = useValidationRules()

  const [formErrors, setFormErrors] = useState<string[] | null>(null)

  const [initiateDoctor, { isLoading: initiateDoctorIsLoading }] = usePostPatientDataAccessInitiateForDoctorMutation()
  const [initiateCaregiver, { isLoading: initiateCaregiverIsLoading }] =
    usePostPatientDataAccessInitiateForCaregiverMutation()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IDataAccessInitiateForGrantedUser>({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (open) {
      setFormErrors(null)
      reset()
    }
  }, [open, reset])

  const onSubmit: SubmitHandler<IDataAccessInitiateForGrantedUser> = async ({ email, roleLabel }) => {
    try {
      if (DoctorRoleLabel.hasOwnProperty(roleLabel)) {
        await initiateDoctor(trimValues({ email })).unwrap()
      } else {
        await initiateCaregiver(trimValues({ email })).unwrap()
      }

      handleClose()
      navigate(PageUrls.Requests)
      enqueueSnackbar('Request sent')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: DataAccessInitiateForGrantedUserKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open} scroll="body">
      <DialogTitle>Invite a user</DialogTitle>
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
          <Controller
            control={control}
            defaultValue=""
            name="roleLabel"
            render={({ field }) => (
              <FormControl error={Boolean(errors[field.name])} fullWidth>
                <InputLabel id="role-label-select">Invite as</InputLabel>
                <Select {...field} label="Invite as" labelId="role-label-select">
                  {getObjectKeys(GrantedUserLabel).map((key) => (
                    <MenuItem key={key} value={key}>
                      {GrantedUserLabel[key]}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{getErrorMessage(errors, field.name)}</FormHelperText>
              </FormControl>
            )}
            rules={validationRules.roleLabel}
          />
          <Controller
            control={control}
            defaultValue=""
            name="email"
            render={({ field }) => <EmailField field={field} fieldValidation={fieldValidation(field.name)} />}
            rules={validationRules.email}
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
                loading={initiateDoctorIsLoading || initiateCaregiverIsLoading}
                size="large"
                type="submit"
                variant="contained"
              >
                Invite
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}
