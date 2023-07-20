import { Add, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { Box, Button, Chip, Tooltip, Typography } from '@mui/material'
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

const showItems = 3

export const GrantedUserPatientDiagnoses: FC<GrantedUserPatientDiagnosesProps> = ({ patientUserId }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { isUserRoleDoctor } = useUserRoles()

  const [viewMoreDiagnoses, setViewMoreDiagnoses] = useState(false)
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

  const handleViewMoreDiagnoses = () => {
    setViewMoreDiagnoses((prevState) => !prevState)
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
          {patientDiagnosesData.map(({ diagnosisId, diagnosisName }, index) => (
            <Tooltip key={diagnosisId} title={diagnosisName}>
              <Chip
                className={!viewMoreDiagnoses && index + 1 > showItems ? 'hidden' : ''}
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
      {patientDiagnosesData && patientDiagnosesData.length > showItems && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button onClick={() => handleViewMoreDiagnoses()} variant="text">
            {viewMoreDiagnoses ? (
              <>
                View less <KeyboardArrowUp />
              </>
            ) : (
              <>
                View more
                <KeyboardArrowDown />
              </>
            )}
          </Button>
        </Box>
      )}
      <NewDiagnosisPopup
        handleClose={handleNewDiagnosisClose}
        open={diagnosisPopupOpen}
        patientUserId={patientUserId}
      />
    </>
  )
}
