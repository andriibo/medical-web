import { LoadingButton } from '@mui/lab'
import { Alert, AlertTitle, Button, Dialog, DialogContent, DialogTitle, InputAdornment, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { getErrorMessage } from '~helpers/get-error-message'
import { minMaxValidationRules, validationRules } from '~helpers/validation-rules'
import { IErrorRequest } from '~models/error-request.model'
import { IThresholdsSaturation, ThresholdsSaturationKeys } from '~models/threshold.model'
import { usePatchPatientSaturationMutation } from '~stores/services/patient-vital-threshold.api'

interface EditPatientSaturationPopupProps {
  thresholds: IThresholdsSaturation
  patientUserId: string
  open: boolean
  handleClose: () => void
}

export const EditPatientSaturationPopup: FC<EditPatientSaturationPopupProps> = ({
  thresholds,
  patientUserId,
  open,
  handleClose,
}) => {
  const [mounted, setMounted] = useState(false)
  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const { enqueueSnackbar } = useSnackbar()

  const [updateThresholds, { isLoading: updateThresholdsIsLoading }] = usePatchPatientSaturationMutation()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IThresholdsSaturation>({
    mode: 'onBlur',
    defaultValues: thresholds,
  })

  useEffect(() => {
    if (open && !mounted) {
      reset(thresholds)
      setFormErrors(null)
      setMounted(true)
    }
  }, [open, mounted, reset, thresholds])

  const onSubmit: SubmitHandler<IThresholdsSaturation> = async ({ min }) => {
    try {
      await updateThresholds({
        patientUserId,
        thresholds: {
          min: Number(min),
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

  const fieldValidation = (name: ThresholdsSaturationKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open} scroll="body">
      <DialogTitle textTransform="capitalize">Patient&apos;s oxygen saturation</DialogTitle>
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
            name="min"
            render={({ field }) => (
              <TextField
                {...field}
                {...fieldValidation(field.name)}
                InputProps={{
                  inputProps: {
                    min: minMaxValidationRules.saturation.min,
                    max: minMaxValidationRules.saturation.max,
                    step: 1,
                  },
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                fullWidth
                label="Min"
                type="number"
              />
            )}
            rules={validationRules.saturation}
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
