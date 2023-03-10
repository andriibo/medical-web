import { LoadingButton } from '@mui/lab'
import { Alert, AlertTitle, Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { PasswordField } from '~components/PasswordField/password-field'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { AuthChangePasswordKeys, IAuthChangePassword } from '~models/auth.model'
import { IErrorRequest } from '~models/error-request.model'
import { useAppDispatch } from '~stores/hooks'
import { usePostAuthChangePasswordMutation } from '~stores/services/auth.api'
import { clearPersist } from '~stores/slices/auth.slice'

interface ChangePasswordPopupProps {
  open: boolean
  handleClose: () => void
}

export const ChangePasswordPopup: FC<ChangePasswordPopupProps> = ({ open, handleClose }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const [changePassword, { isLoading: changePasswordIsLoading }] = usePostAuthChangePasswordMutation()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IAuthChangePassword>({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (open) {
      reset()
    }
  }, [open, reset])

  const onSubmit: SubmitHandler<IAuthChangePassword> = async (data) => {
    try {
      await changePassword(data).unwrap()

      enqueueSnackbar('Password changed')

      await dispatch(clearPersist())

      navigate(PageUrls.SignIn, { replace: true, state: undefined })
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: AuthChangePasswordKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <>
      <Dialog disableEscapeKeyDown fullWidth maxWidth="xs" onClose={handleClose} open={open} scroll="body">
        <DialogTitle>Update password </DialogTitle>
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
              name="currentPassword"
              render={({ field }) => (
                <PasswordField field={field} fieldValidation={fieldValidation(field.name)} label="Current password" />
              )}
              rules={validationRules.password}
            />
            <Controller
              control={control}
              defaultValue=""
              name="newPassword"
              render={({ field }) => (
                <PasswordField field={field} fieldValidation={fieldValidation(field.name)} showRules />
              )}
              rules={validationRules.password}
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
                  loading={changePasswordIsLoading}
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Update
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
