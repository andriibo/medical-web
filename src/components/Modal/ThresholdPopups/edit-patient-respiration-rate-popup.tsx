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
import { IThresholdsCommon, ThresholdsCommonKeys } from '~models/threshold.model'
import { usePostPatientRespirationRateMutation } from '~stores/services/patient-vital-threshold.api'

interface EditRespirationHeartRatePopupProps {
  thresholds: IThresholdsCommon
  patientUserId: string
  validationRulesData: IValidationRules
  open: boolean
  handleClose: () => void
}

export const EditPatientRespirationRatePopup: FC<EditRespirationHeartRatePopupProps> = ({
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

  const [updateThresholds, { isLoading: updateThresholdsIsLoading }] = usePostPatientRespirationRateMutation()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IThresholdsCommon>({
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

  const onSubmit: SubmitHandler<IThresholdsCommon> = async ({ min, max }) => {
    try {
      await updateThresholds({
        patientUserId,
        thresholds: {
          min: Number(min),
          max: Number(max),
        },
      }).unwrap()

      handleClose()
      setFormErrors(null)
      enqueueSnackbar('Thresholds changed')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: ThresholdsCommonKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open} scroll="body">
      <DialogTitle textTransform="capitalize">Patient&apos;s respiration</DialogTitle>
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
                name="min"
                render={({ field }) => (
                  <NumberField
                    field={field}
                    fieldValidation={fieldValidation(field.name)}
                    label="Min"
                    validationProps={validationProps.respirationRate}
                  />
                )}
                rules={validationRules.respirationRate}
              />
            </Grid>
            <Grid xs={6}>
              <Controller
                control={control}
                name="max"
                render={({ field }) => (
                  <NumberField
                    field={field}
                    fieldValidation={fieldValidation(field.name)}
                    label="Max"
                    validationProps={validationProps.respirationRate}
                  />
                )}
                rules={validationRules.respirationRate}
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
