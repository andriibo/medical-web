import { Add } from '@mui/icons-material'
import { Button, Chip, Tooltip, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { FC, useState } from 'react'

import { useUserRoles } from '~/hooks/use-user-roles'
import { NewDiagnosisPopup } from '~components/Modal/NewDiagnosisPopup/new-diagnosis-popup'
import { Spinner } from '~components/Spinner/spinner'
import { pushValueToArrayState, removeValueFromArrayState } from '~helpers/state-helper'
import iconDx from '~images/icon-dx.png'
import { useDeletePatientDiagnosisMutation, useGetPatientDiagnosesQuery } from '~stores/services/patient-diagnosis.api'

import styles from '../granted-user-patient.module.scss'

interface GrantedUserPatientDiagnosesProps {
  patientUserId: string
}

export const GrantedUserPatientDiagnoses: FC<GrantedUserPatientDiagnosesProps> = ({ patientUserId }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { isUserRoleDoctor } = useUserRoles()

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

  const handleDeleteDiagnosis = async (diagnosisId: string) => {
    try {
      pushValueToArrayState(diagnosisId, setDeletingDiagnosesId)
      await deletePatientDiagnosis({ diagnosisId }).unwrap()

      enqueueSnackbar('Diagnosis deleted')
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Diagnosis not deleted', { variant: 'warning' })
    } finally {
      removeValueFromArrayState(diagnosisId, setDeletingDiagnosesId)
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
        {isUserRoleDoctor && (
          <Button onClick={handleNewDiagnosisOpen} size="small" startIcon={<Add />} variant="outlined">
            Add New
          </Button>
        )}
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
                onDelete={isUserRoleDoctor ? () => handleDeleteDiagnosis(diagnosisId) : undefined}
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
