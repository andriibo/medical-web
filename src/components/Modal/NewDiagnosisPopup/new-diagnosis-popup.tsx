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
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { GenderEnum } from '~/enums/gender.enum'
import { getErrorMessage } from '~helpers/get-error-message'
import { validationRules } from '~helpers/validation-rules'
import { ICreateDiagnosesForm, ICreateDiagnosesFormKeys } from '~models/diagnoses.model'
import { IErrorRequest } from '~models/error-request.model'
import { IUpdatePatientProfile } from '~models/profie.model'
import { useGetDiagnosesQuery } from '~stores/services/diagnoses.api'
import { usePostPatientDiagnosesMutation } from '~stores/services/patient-diagnoses.api'
import { usePatchPatientProfileMutation } from '~stores/services/profile.api'
import { useUserId } from '~stores/slices/auth.slice'

interface NewDiagnosisPopupPopupProps {
  open: boolean
  handleClose: () => void
}

export const NewDiagnosisPopup: FC<NewDiagnosisPopupPopupProps> = ({ open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { data: diagnosesData } = useGetDiagnosesQuery()
  const [createPatientDiagnoses, { isLoading: createPatientDiagnosesIsLoading }] = usePostPatientDiagnosesMutation()
  const [formErrors, setFormErrors] = useState<string[] | null>(null)
  const userId = useUserId()

  const diagnoses = useMemo(() => diagnosesData?.map((diagnose) => diagnose.diagnosisName), [diagnosesData])

  useEffect(() => {
    console.log(diagnosesData)
  }, [diagnosesData])

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ICreateDiagnosesForm>({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<ICreateDiagnosesForm> = async ({ diagnosisName }) => {
    try {
      await createPatientDiagnoses({
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

  if (!diagnosesData || !diagnoses) {
    return <div>ddd</div>
  }

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
                  onChange={(event, data): void => {
                    field.onChange(data)
                  }}
                  options={diagnoses}
                  renderInput={(params) => (
                    <TextField {...params} {...fieldValidation(field.name)} label="Diagnosis Name" />
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
                loading={createPatientDiagnosesIsLoading}
                size="large"
                sx={{ ml: 1 }}
                type="submit"
                variant="contained"
              >
                Add
              </LoadingButton>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
