import { Add } from '@mui/icons-material'
import { Button, Chip, Tooltip, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { FC, useState } from 'react'

import { NewDiagnosisPopup } from '~components/Modal/NewDiagnosisPopup/new-diagnosis-popup'
import { Spinner } from '~components/Spinner/spinner'
import iconDx from '~images/icon-dx.png'
import { useDeletePatientDiagnosisMutation, useGetPatientDiagnosesQuery } from '~stores/services/patient-diagnosis.api'

import styles from '../granted-user-patient.module.scss'

interface GrantedUserPatientDiagnosesProps {
  patientUserId: string
}

export const GrantedUserPatientDiagnoses: FC<GrantedUserPatientDiagnosesProps> = ({ patientUserId }) => {
  const { enqueueSnackbar } = useSnackbar()

  const [diagnosisPopupOpen, setDiagnosisPopupOpen] = useState(false)
  const [deletingDiagnosesId, setDeletingDiagnosesId] = useState<string[]>([])

  const { data: patientDiagnosesData, isLoading: patientDiagnosesDataIsLoading } = useGetPatientDiagnosesQuery({
    patientUserId,
  })
  const [deletePatientDiagnosis] = useDeletePatientDiagnosisMutation()

  const handleNewDiagnosisOpen = () => {
    setDiagnosisPopupOpen(true)
  }

  const handleNewDiagnosisClose = () => {
    setDiagnosisPopupOpen(false)
  }

  const removeDeletingDiagnosisId = (diagnosisId: string) => {
    setDeletingDiagnosesId((prevState) => {
      const index = prevState.indexOf(diagnosisId)

      prevState.splice(index, 1)

      return prevState
    })
  }

  const handleDeleteDiagnosis = async (diagnosisId: string) => {
    try {
      setDeletingDiagnosesId((prevState) => {
        prevState.push(diagnosisId)

        return prevState
      })
      await deletePatientDiagnosis({ diagnosisId }).unwrap()

      enqueueSnackbar('Diagnosis deleted')
    } catch (err) {
      console.error(err)
      removeDeletingDiagnosisId(diagnosisId)
      enqueueSnackbar('Diagnosis not deleted', { variant: 'warning' })
    } finally {
      removeDeletingDiagnosisId(diagnosisId)
    }
  }

  const removeTextInBrackets = (text: string) => {
    const bracketIndex = text.indexOf('(')

    return text.slice(0, bracketIndex)
  }

  return (
    <>
      <div className={styles.patientAsideHeading}>
        <img alt="Dx" className={styles.patientAsideIcon} src={iconDx} />
        <strong className={styles.patientAsideTitle}>Past Med Hx</strong>
        <Button onClick={handleNewDiagnosisOpen} size="small" startIcon={<Add />} variant="outlined">
          Add New
        </Button>
      </div>
      {patientDiagnosesDataIsLoading ? (
        <Spinner />
      ) : patientDiagnosesData?.length ? (
        <div className={styles.patientAsideTreatmentHolder}>
          {patientDiagnosesData.map(({ diagnosisId, diagnosisName }) => (
            <Tooltip key={diagnosisId} title={diagnosisName}>
              <Chip
                disabled={deletingDiagnosesId.includes(diagnosisId)}
                label={removeTextInBrackets(diagnosisName)}
                onDelete={() => handleDeleteDiagnosis(diagnosisId)}
              />
            </Tooltip>
          ))}
        </div>
      ) : (
        <Typography align="center" variant="body1">
          No diagnoses
        </Typography>
      )}
      <NewDiagnosisPopup
        handleClose={handleNewDiagnosisClose}
        open={diagnosisPopupOpen}
        patientUserId={patientUserId}
      />
    </>
  )
}
