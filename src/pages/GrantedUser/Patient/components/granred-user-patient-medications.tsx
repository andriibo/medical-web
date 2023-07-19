import { Add } from '@mui/icons-material'
import { Button, Chip, Tooltip, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { FC, useState } from 'react'

import { useUserRoles } from '~/hooks/use-user-roles'
import { MedicationFormPopup } from '~components/Modal/MedicationFormPopup/medication-form-popup'
import { Spinner } from '~components/Spinner/spinner'
import { pushValueToArrayState, removeValueFromArrayState } from '~helpers/state-helper'
import iconRx from '~images/icon-rx.png'
import {
  useDeletePatientMedicationMutation,
  useGetPatientMedicationsQuery,
} from '~stores/services/patient-medication.api'

import styles from '../granted-user-patient.module.scss'

interface GrantedUserPatientMedicationsProps {
  patientUserId: string
}

export const GrantedUserPatientMedications: FC<GrantedUserPatientMedicationsProps> = ({ patientUserId }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { isUserRoleDoctor } = useUserRoles()

  const [deletingMedicationsId, setDeletingMedicationsId] = useState<string[]>([])
  const [isMedicationPopupOpen, setIsMedicationPopupOpen] = useState(false)

  const { data: patientMedicationsData, isLoading: patientMedicationsDataIsLoading } = useGetPatientMedicationsQuery({
    patientUserId,
  })
  const [deletePatientMedication] = useDeletePatientMedicationMutation()

  const handleNewMedicationOpen = () => {
    setIsMedicationPopupOpen(true)
  }

  const handleNewMedicationClose = () => {
    setIsMedicationPopupOpen(false)
  }

  const handleDeleteMedication = async (medicationId: string) => {
    try {
      pushValueToArrayState(medicationId, setDeletingMedicationsId)
      await deletePatientMedication({ medicationId }).unwrap()

      enqueueSnackbar('Medication deleted')
    } catch (err) {
      enqueueSnackbar('Medication not deleted', { variant: 'warning' })
      console.error(err)
    } finally {
      removeValueFromArrayState(medicationId, setDeletingMedicationsId)
    }
  }

  return (
    <>
      <div className={styles.patientAsideHeading}>
        <img alt="Rx" className={styles.patientAsideIcon} src={iconRx} />
        <strong className={styles.patientAsideTitle}>Medication</strong>
        {isUserRoleDoctor && (
          <Button onClick={handleNewMedicationOpen} size="small" startIcon={<Add />} variant="outlined">
            Add New
          </Button>
        )}
      </div>
      {patientMedicationsDataIsLoading ? (
        <Spinner />
      ) : patientMedicationsData?.length ? (
        <div className={styles.patientAsideTreatmentHolder}>
          {patientMedicationsData.map(({ medicationId, genericName, brandNames }) => (
            <Tooltip
              key={medicationId}
              title={`${genericName} ${brandNames.length ? `(${brandNames.join(', ')})` : ''}`}
            >
              <Chip
                disabled={deletingMedicationsId.includes(medicationId)}
                label={genericName}
                onDelete={isUserRoleDoctor ? () => handleDeleteMedication(medicationId) : undefined}
              />
            </Tooltip>
          ))}
        </div>
      ) : (
        <Typography align="center" variant="body1">
          No medications
        </Typography>
      )}
      <MedicationFormPopup
        editingMedication={null}
        handleClose={handleNewMedicationClose}
        open={isMedicationPopupOpen}
        patientUserId={patientUserId}
      />
    </>
  )
}
