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
import { useUserId } from '~stores/slices/auth.slice'

interface NewDiagnosisPopupProps {
  open: boolean
  handleClose: () => void
}

export const NewDiagnosisPopup: FC<NewDiagnosisPopupProps> = ({ open, handleClose }) => {
  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const userId = useUserId()
  const { enqueueSnackbar } = useSnackbar()

  const { data: diagnosesData, isLoading: diagnosesDataIsLodading } = useGetDiagnosesQuery()
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
        patientUserId: userId,
      }).unwrap()

      setFormErrors(null)
      handleClose()
      enqueueSnackbar('Diagnose was added')
    } catch (err) {
      const {
        data: { message },
      } = err as IErrorRequest

      if (Array.isArray(message)) {
        setFormErrors(message)
      } else {
        setFormErrors([message])
      }

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
          {diagnosesDataIsLodading ? (
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
              <Box sx={{ textAlign: 'right' }}>
                <Button onClick={handleClose} size="large">
                  Cancel
                </Button>
                <LoadingButton
                  loading={createPatientDiagnosisIsLoading}
                  size="large"
                  sx={{ ml: 1 }}
                  type="submit"
                  variant="contained"
                >
                  Add
                </LoadingButton>
              </Box>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
