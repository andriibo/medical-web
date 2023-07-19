import { List, ListItem, ListItemText, MenuItem } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { useUserRoles } from '~/hooks/use-user-roles'
import { DropdownMenu } from '~components/DropdownMenu/dropdown-menu'
import { MedicationFormPopup } from '~components/Modal/MedicationFormPopup/medication-form-popup'
import { Spinner } from '~components/Spinner/spinner'
import { pushValueToArrayState, removeValueFromArrayState } from '~helpers/state-helper'
import { IMedication } from '~models/medications.model'
import {
  useDeletePatientMedicationMutation,
  useGetPatientMedicationsQuery,
} from '~stores/services/patient-medication.api'
import { useUserId } from '~stores/slices/auth.slice'

interface PatientMedicationsProps {
  patientUserId?: string
  popupOpen: boolean
  handlePopupClose: () => void
}

export const PatientMedications: FC<PatientMedicationsProps> = ({ patientUserId, popupOpen, handlePopupClose }) => {
  const userId = useUserId()
  const { enqueueSnackbar } = useSnackbar()
  const { isUserRoleCaregiver } = useUserRoles()

  const [deletingMedicationsId, setDeletingMedicationsId] = useState<string[]>([])
  const [dropClose, setDropClose] = useState(false)
  const [isMedicationPopupOpen, setIsMedicationPopupOpen] = useState(false)
  const [editingMedication, setEditingMedication] = useState<IMedication | null>(null)

  const currentPatientUserId = useMemo(() => patientUserId || userId, [patientUserId, userId])

  const { data: patientMedicationsData, isLoading: patientMedicationsDataIsLoading } = useGetPatientMedicationsQuery({
    patientUserId: currentPatientUserId,
  })
  const [deletePatientMedication] = useDeletePatientMedicationMutation()

  useEffect(() => {
    if (popupOpen) {
      setIsMedicationPopupOpen(true)
    }
  }, [popupOpen])

  const handleMedicationPopupClose = () => {
    setIsMedicationPopupOpen(false)
    setEditingMedication(null)
    handlePopupClose()
  }

  const handleEditMedication = (medication: IMedication) => {
    setDropClose(true)
    setEditingMedication(medication)
    setIsMedicationPopupOpen(true)
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

  const handleDrop = useCallback((value: boolean) => {
    setDropClose(value)
  }, [])

  return (
    <>
      <List className="list-divided">
        {patientMedicationsDataIsLoading ? (
          <Spinner />
        ) : patientMedicationsData?.length ? (
          patientMedicationsData.map((medication) => {
            const { medicationId, genericName, dose, timesPerDay } = medication

            return (
              <ListItem
                className={deletingMedicationsId.includes(medicationId) ? 'disabled' : ''}
                disableGutters={Boolean(patientUserId)}
                key={medicationId}
                secondaryAction={
                  !isUserRoleCaregiver && (
                    <DropdownMenu buttonEdge="end" dropClose={dropClose} handleDrop={handleDrop}>
                      <MenuItem onClick={() => handleEditMedication(medication)}>Edit</MenuItem>
                      <MenuItem onClick={() => handleDeleteMedication(medicationId)}>Delete</MenuItem>
                    </DropdownMenu>
                  )
                }
              >
                <ListItemText
                  primary={genericName}
                  secondary={`${dose ? `${dose} mg / ` : ''}${timesPerDay ? timesPerDay : ''}`}
                />
              </ListItem>
            )
          })
        ) : (
          <ListItem className="empty-list-item">No medications added</ListItem>
        )}
      </List>
      <MedicationFormPopup
        editingMedication={editingMedication}
        handleClose={handleMedicationPopupClose}
        open={isMedicationPopupOpen}
        patientUserId={currentPatientUserId}
      />
    </>
  )
}
