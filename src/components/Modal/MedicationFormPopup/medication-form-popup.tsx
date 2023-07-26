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
import validator from 'validator'

import { TimesPreDay } from '~/enums/times-pre-day.enum'
import { useValidationRules } from '~/hooks/use-validation-rules'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { NumberField } from '~components/Form/NumberField/number-field'
import { Spinner } from '~components/Spinner/spinner'
import { VirtualizedListBox } from '~components/VirtualizedListBox/virtualized-list-box'
import { getErrorMessage } from '~helpers/get-error-message'
import { getObjectKeys } from '~helpers/get-object-keys'
import { IErrorRequest } from '~models/error-request.model'
import { CreateMedicationFormKeys, ICreateMedicationForm, IMedication } from '~models/medications.model'
import { useGetMedicationsQuery } from '~stores/services/medications.api'
import {
  usePatchPatientMedicationMutation,
  usePostPatientMedicationMutation,
} from '~stores/services/patient-medication.api'
import trim = validator.trim

interface NewMedicationPopupProps {
  patientUserId: string
  editingMedication: IMedication | null
  open: boolean
  handleClose: () => void
}

export const MedicationFormPopup: FC<NewMedicationPopupProps> = ({
  patientUserId,
  editingMedication,
  open,
  handleClose,
}) => {
  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const { validationRules, validationProps } = useValidationRules()

  const { data: medicationsData, isLoading: medicationsDataIsLoading } = useGetMedicationsQuery()
  const [createPatientMedication, { isLoading: createPatientMedicationIsLoading }] = usePostPatientMedicationMutation()
  const [updatePatientMedication, { isLoading: updatePatientMedicationIsLoading }] = usePatchPatientMedicationMutation()

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
      reset({ dose: '' })

      if (editingMedication) {
        const { brandNames, genericName, dose, timesPerDay } = editingMedication

        reset({
          medicationName: {
            brandNames,
            genericName,
          },
          dose: dose || '',
          timesPerDay: timesPerDay || '',
        })
      }
    }
  }, [editingMedication, open, reset])

  const onSubmit: SubmitHandler<ICreateMedicationForm> = async ({ medicationName, dose, timesPerDay }) => {
    if (!medicationName) return

    if (editingMedication) {
      try {
        await updatePatientMedication({
          medication: {
            ...medicationName,
            dose: Number(dose),
            timesPerDay,
          },
          medicationId: editingMedication.medicationId,
        }).unwrap()

        setFormErrors(null)
        handleClose()
        enqueueSnackbar('Medication updated')
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
      await createPatientMedication({
        ...medicationName,
        dose: Number(dose),
        timesPerDay,
        patientUserId,
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
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
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
                  getOptionLabel={({ brandNames, genericName }) => {
                    const label = `${brandNames.join(', ')} ${genericName ? `(${genericName})` : ''}`

                    return trim(label)
                  }}
                  isOptionEqualToValue={(option, value) => option.genericName === value.genericName}
                  onChange={(event, data): void => {
                    field.onChange(data)
                  }}
                  options={medicationsData}
                  renderInput={(params) => <TextField {...params} {...fieldValidation(field.name)} label="Name" />}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.genericName + Math.random()}>
                      {option.brandNames.join(', ')} ({option.genericName})
                    </Box>
                  )}
                  value={field.value}
                />
              )}
              rules={validationRules.medicationName}
            />
            <Controller
              control={control}
              defaultValue=""
              name="dose"
              render={({ field }) => (
                <NumberField
                  field={field}
                  fieldValidation={fieldValidation(field.name)}
                  label="Dose"
                  step={0.001}
                  validationProps={validationProps.dose}
                />
              )}
              rules={validationRules.dose}
            />
            <Controller
              control={control}
              defaultValue=""
              name="timesPerDay"
              render={({ field }) => (
                <FormControl error={Boolean(errors[field.name])} fullWidth>
                  <InputLabel>Times a Day</InputLabel>
                  <Select {...field} label="Times a Day">
                    {getObjectKeys(TimesPreDay).map((key) => (
                      <MenuItem key={key} value={key}>
                        {TimesPreDay[key]}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{getErrorMessage(errors, field.name)}</FormHelperText>
                </FormControl>
              )}
              rules={validationRules.timesPerDay}
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
                  loading={createPatientMedicationIsLoading || updatePatientMedicationIsLoading}
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
