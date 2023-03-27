import { LoadingButton } from '@mui/lab'
import { Alert, AlertTitle, Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { IValidationRules } from '~/hooks/use-validation-rules'
import { NumberField } from '~components/Form/NumberField/number-field'
import { getErrorMessage } from '~helpers/get-error-message'
import { IErrorRequest } from '~models/error-request.model'
import { IThresholdsBloodPressure, ThresholdsBloodPressureKeys } from '~models/threshold.model'
import { usePostPatientBloodPressureMutation } from '~stores/services/patient-vital-threshold.api'

interface EditPatientBloodPressurePopupProps {
  thresholds: IThresholdsBloodPressure
  patientUserId: string
  validationRulesData: IValidationRules
  open: boolean
  handleClose: () => void
}

export const EditPatientBloodPressurePopup: FC<EditPatientBloodPressurePopupProps> = ({
  thresholds,
  patientUserId,
  validationRulesData,
  open,
  handleClose,
}) => {
  const [mounted, setMounted] = useState(false)
  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const { enqueueSnackbar } = useSnackbar()

  const { validationRules, validationProps } = validationRulesData

  const [updateThresholds, { isLoading: updateThresholdsIsLoading }] = usePostPatientBloodPressureMutation()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IThresholdsBloodPressure>({
    mode: 'onBlur',
    defaultValues: thresholds,
  })

  useEffect(() => {
    if (open && !mounted) {
      reset(thresholds)
      setFormErrors(null)
      setMounted(true)
    }

    if (!open && mounted) {
      setMounted(false)
    }
  }, [open, mounted, reset, thresholds])

  const onSubmit: SubmitHandler<IThresholdsBloodPressure> = async ({ minSBP, maxSBP, minDBP, maxDBP }) => {
    try {
      await updateThresholds({
        patientUserId,
        thresholds: {
          minDBP: Number(minDBP),
          maxDBP: Number(maxDBP),
          minSBP: Number(minSBP),
          maxSBP: Number(maxSBP),
        },
      }).unwrap()

      setFormErrors(null)
      handleClose()
      enqueueSnackbar('Thresholds changed')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: ThresholdsBloodPressureKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open} scroll="body">
      <DialogTitle textTransform="capitalize">Patient&apos;s blood pressure</DialogTitle>
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
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Controller
                control={control}
                name="minDBP"
                render={({ field }) => (
                  <NumberField
                    field={field}
                    fieldValidation={fieldValidation(field.name)}
                    label="Min DBP"
                    validationProps={validationProps.dbp}
                  />
                )}
                rules={validationRules.dbp}
              />
            </Grid>
            <Grid xs={6}>
              <Controller
                control={control}
                name="maxDBP"
                render={({ field }) => (
                  <NumberField
                    field={field}
                    fieldValidation={fieldValidation(field.name)}
                    label="Max DBP"
                    validationProps={validationProps.dbp}
                  />
                )}
                rules={validationRules.dbp}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Controller
                control={control}
                name="minSBP"
                render={({ field }) => (
                  <NumberField
                    field={field}
                    fieldValidation={fieldValidation(field.name)}
                    label="Min SBP"
                    validationProps={validationProps.sbp}
                  />
                )}
                rules={validationRules.sbp}
              />
            </Grid>
            <Grid xs={6}>
              <Controller
                control={control}
                name="maxSBP"
                render={({ field }) => (
                  <NumberField
                    field={field}
                    fieldValidation={fieldValidation(field.name)}
                    label="Max SBP"
                    validationProps={validationProps.sbp}
                  />
                )}
                rules={validationRules.sbp}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Button fullWidth onClick={handleClose} size="large" variant="outlined">
                Cancel
              </Button>
            </Grid>
            <Grid xs={6}>
              <LoadingButton
                fullWidth
                loading={updateThresholdsIsLoading}
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
  )
}
