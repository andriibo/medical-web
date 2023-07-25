import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { Box, Button, List, ListItem, ListItemText, MenuItem } from '@mui/material'
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

import styles from './patient-medications.module.scss'

interface PatientMedicationsProps {
  patientUserId?: string
  popupOpen: boolean
  handlePopupClose: () => void
}

const itemsToShow = 2

export const PatientMedications: FC<PatientMedicationsProps> = ({ patientUserId, popupOpen, handlePopupClose }) => {
  const userId = useUserId()
  const { enqueueSnackbar } = useSnackbar()
  const { isUserRoleCaregiver } = useUserRoles()

  const [deletingMedicationsId, setDeletingMedicationsId] = useState<string[]>([])
  const [dropClose, setDropClose] = useState(false)
  const [isMedicationPopupOpen, setIsMedicationPopupOpen] = useState(false)
  const [editingMedication, setEditingMedication] = useState<IMedication | null>(null)
  const [viewMoreMedications, setViewMoreMedications] = useState(false)

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

  const handleShowMoreMedications = () => {
    setViewMoreMedications((prevState) => !prevState)
  }

  const handleDrop = useCallback((value: boolean) => {
    setDropClose(value)
  }, [])

  if (patientMedicationsDataIsLoading) {
    return <Spinner />
  }

  return (
    <>
      <List className={`list-divided ${styles.medicationList}`}>
        {patientMedicationsData?.length ? (
          <>
            {patientMedicationsData.map((medication, index) => {
              const { medicationId, genericName, dose, timesPerDay } = medication

              return (
                <ListItem
                  className={`${patientUserId && !viewMoreMedications && index + 1 > itemsToShow ? 'hidden' : ''} ${
                    deletingMedicationsId.includes(medicationId) ? 'disabled' : ''
                  }`}
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
                    secondary={`${dose || 0} mg / ${timesPerDay ? timesPerDay : ''}`}
                  />
                </ListItem>
              )
            })}
          </>
        ) : (
          <ListItem className="empty-list-item">No medications added</ListItem>
        )}
      </List>
      {patientUserId && patientMedicationsData && patientMedicationsData.length > itemsToShow && (
        <Box sx={{ textAlign: 'center' }}>
          <Button onClick={() => handleShowMoreMedications()} variant="text">
            {viewMoreMedications ? (
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
      <MedicationFormPopup
        editingMedication={editingMedication}
        handleClose={handleMedicationPopupClose}
        open={isMedicationPopupOpen}
        patientUserId={currentPatientUserId}
      />
    </>
  )
}
