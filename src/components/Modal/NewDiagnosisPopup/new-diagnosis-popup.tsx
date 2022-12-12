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
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { ICreateDiagnosesFormKeys, ICreateDiagnosisForm } from '~models/diagnoses.model'
import { IErrorRequest } from '~models/error-request.model'
import { useGetDiagnosesQuery } from '~stores/services/diagnoses.api'
import { usePostPatientDiagnosisMutation } from '~stores/services/patient-diagnosis.api'

interface NewDiagnosisPopupProps {
  patientUserId: string
  open: boolean
  handleClose: () => void
}

export const NewDiagnosisPopup: FC<NewDiagnosisPopupProps> = ({ patientUserId, open, handleClose }) => {
  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const { enqueueSnackbar } = useSnackbar()

  const { data: diagnosesData, isLoading: diagnosesDataIsLoading } = useGetDiagnosesQuery()
  const [createPatientDiagnosis, { isLoading: createPatientDiagnosisIsLoading }] = usePostPatientDiagnosisMutation()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ICreateDiagnosisForm>({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (open) {
      reset()
    }
  }, [open, reset])

  const onSubmit: SubmitHandler<ICreateDiagnosisForm> = async ({ diagnosisName }) => {
    try {
      await createPatientDiagnosis({
        diagnosisName,
        patientUserId,
      }).unwrap()

      setFormErrors(null)
      handleClose()
      enqueueSnackbar('Diagnose added')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      setFormErrors(Array.isArray(message) ? message : [message])

      console.error(err)
    }
  }

  const fieldValidation = (name: ICreateDiagnosesFormKeys) => ({
    error: Boolean(errors[name]),
    helperText: getErrorMessage(errors, name),
  })

  return (
    <>
      <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open} scroll="body">
        <DialogTitle>New diagnosis</DialogTitle>
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
          {diagnosesDataIsLoading ? (
            <Spinner />
          ) : !diagnosesData ? (
            <EmptyBox />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                defaultValue=""
                name="diagnosisName"
                render={({ field }) => (
                  <Autocomplete
                    ListboxProps={{ style: { maxHeight: 224 } }}
                    disableClearable
                    disablePortal
                    fullWidth
                    getOptionLabel={(option) => option.diagnosisName}
                    onChange={(event, data): void => {
                      field.onChange(data.diagnosisName)
                    }}
                    options={diagnosesData}
                    renderInput={(params) => (
                      <TextField {...params} {...fieldValidation(field.name)} label="Diagnosis Name" />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.diagnosisName}>
                        {option.diagnosisName}
                      </Box>
                    )}
                  />
                )}
                rules={validationRules.diagnosisName}
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
                    loading={createPatientDiagnosisIsLoading}
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
    </>
  )
}
