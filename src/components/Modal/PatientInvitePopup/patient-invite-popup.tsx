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
import { useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { UserRoles, UserRolesValues } from '~/enums/user-roles.enum'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { DataAccessInitiateForGrantedUserKeys, IDataAccessInitiateForGrantedUser } from '~models/data-access.model'
import { IErrorRequest } from '~models/error-request.model'
import { usePostPatientDataAccessInitiateForGrantedUserMutation } from '~stores/services/patient-data-access.api'

interface PatientInvitePopupProps {
  open: boolean
  handleClose: () => void
}

export const PatientInvitePopup: FC<PatientInvitePopupProps> = ({ open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const navigate = useNavigate()

  const [patientInitiate, { isLoading: patientInitiateIsLoading }] =
    usePostPatientDataAccessInitiateForGrantedUserMutation()

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

  const onSubmit: SubmitHandler<IDataAccessInitiateForGrantedUser> = async ({ role, email }) => {
    try {
      await patientInitiate({ role, email }).unwrap()

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
      <DialogTitle>Invite a new MD</DialogTitle>
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
            name="role"
            render={({ field }) => (
              <FormControl error={Boolean(errors[field.name])} fullWidth>
                <InputLabel id="role-select">Role</InputLabel>
                <Select {...field} label="Role" labelId="role-select">
                  {Object.keys(UserRoles).map((key) => {
                    const value = key as UserRolesValues

                    if (UserRoles[value] !== UserRoles.patient) {
                      return (
                        <MenuItem key={value} value={value}>
                          {UserRoles[value]}
                        </MenuItem>
                      )
                    }
                  })}
                </Select>
                <FormHelperText>{getErrorMessage(errors, field.name)}</FormHelperText>
              </FormControl>
            )}
            rules={validationRules.role}
          />
          <Controller
            control={control}
            defaultValue=""
            name="email"
            render={({ field }) => <TextField {...field} {...fieldValidation(field.name)} fullWidth label="Email" />}
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
                loading={patientInitiateIsLoading}
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
