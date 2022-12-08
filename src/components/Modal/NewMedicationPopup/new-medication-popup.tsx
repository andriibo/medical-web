import { LoadingButton } from '@mui/lab'
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { EmptyBox } from '~components/EmptyBox/empty-box'
import { Spinner } from '~components/Spinner/spinner'
import { VirtualizedListBox } from '~components/VirtualizedListBox/virtualized-list-box'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { IErrorRequest } from '~models/error-request.model'
import { CreateMedicationFormKeys, ICreateMedicationForm } from '~models/medications.model'
import { useGetMedicationsQuery } from '~stores/services/medications.api'
import { usePostPatientMedicationMutation } from '~stores/services/patient-medication.api'
import { useUserId } from '~stores/slices/auth.slice'

interface NewMedicationPopupProps {
  open: boolean
  handleClose: () => void
}

export const NewMedicationPopup: FC<NewMedicationPopupProps> = ({ open, handleClose }) => {
  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const userId = useUserId()
  const { enqueueSnackbar } = useSnackbar()

  const { data: medicationsData, isLoading: medicationsDataIsLoading } = useGetMedicationsQuery()
  const [createPatientMedication, { isLoading: createPatientMedicationIsLoading }] = usePostPatientMedicationMutation()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ICreateMedicationForm>({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (open) {
      reset()
    }
  }, [open, reset])

  const onSubmit: SubmitHandler<ICreateMedicationForm> = async (data) => {
    try {
      await createPatientMedication({
        ...data.medicationName,
        patientUserId: userId,
      }).unwrap()

      setFormErrors(null)
      handleClose()
      enqueueSnackbar('Medication added')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: CreateMedicationFormKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open} scroll="body">
      <DialogTitle>New medication</DialogTitle>
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
        {medicationsDataIsLoading ? (
          <Spinner />
        ) : !medicationsData ? (
          <EmptyBox />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              defaultValue={{ genericName: '', brandNames: [] }}
              name="medicationName"
              render={({ field }) => (
                <Autocomplete
                  ListboxComponent={VirtualizedListBox}
                  disableClearable
                  disablePortal
                  fullWidth
                  getOptionLabel={(option) => `${option.brandNames.join(', ')} (${option.genericName})`}
                  onChange={(event, data): void => {
                    field.onChange(data)
                  }}
                  options={medicationsData}
                  renderInput={(params) => (
                    <TextField {...params} {...fieldValidation(field.name)} label="Medication Name" />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.genericName + Math.random()}>
                      {option.brandNames.join(', ')} ({option.genericName})
                    </Box>
                  )}
                />
              )}
              rules={validationRules.medicationName}
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
                  loading={createPatientMedicationIsLoading}
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Add
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
