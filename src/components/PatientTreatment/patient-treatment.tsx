import { Add, Close } from '@mui/icons-material'
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useState } from 'react'

import { Treatment } from '~/enums/treatment.enum'
import { useUserRoles } from '~/hooks/use-user-roles'
import { DropdownMenu } from '~components/DropdownMenu/dropdown-menu'
import { NewDiagnosisPopup } from '~components/Modal/NewDiagnosisPopup/new-diagnosis-popup'
import { NewMedicationPopup } from '~components/Modal/NewMedicationPopup/new-medication-popup'
import { Spinner } from '~components/Spinner/spinner'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { pushValueToArrayState, removeValueFromArrayState } from '~helpers/state-helper'
import { IMedication } from '~models/medications.model'
import { useDeletePatientDiagnosisMutation, useGetPatientDiagnosesQuery } from '~stores/services/patient-diagnosis.api'
import {
  useDeletePatientMedicationMutation,
  useGetPatientMedicationsQuery,
} from '~stores/services/patient-medication.api'

interface PatientTreatmentProps {
  patientUserId: string
}

export const PatientTreatment: FC<PatientTreatmentProps> = ({ patientUserId }) => {
  const { isUserRoleCaregiver } = useUserRoles()
  const { enqueueSnackbar } = useSnackbar()

  const [diagnosisPopupOpen, setDiagnosisPopupOpen] = useState(false)
  const [deletingDiagnosesId, setDeletingDiagnosesId] = useState<string[]>([])
  const [deletingMedicationsId, setDeletingMedicationsId] = useState<string[]>([])
  const [isMedicationPopupOpen, setIsMedicationPopupOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Treatment>(Treatment.diagnoses)
  const [dropClose, setDropClose] = useState(false)
  const [editingMedication, setEditingMedication] = useState<IMedication | null>(null)

  const { data: patientDiagnosesData, isLoading: patientDiagnosesDataIsLoading } = useGetPatientDiagnosesQuery({
    patientUserId,
  })
  const { data: patientMedicationsData, isLoading: patientMedicationsDataIsLoading } = useGetPatientMedicationsQuery({
    patientUserId,
  })
  const [deletePatientDiagnosis] = useDeletePatientDiagnosisMutation()
  const [deletePatientMedication] = useDeletePatientMedicationMutation()

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

  const handleNewMedicationOpen = () => {
    setIsMedicationPopupOpen(true)
  }

  const handleNewMedicationClose = () => {
    setIsMedicationPopupOpen(false)
    setEditingMedication(null)
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

  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: Treatment) => {
    if (newValue !== null) {
      setActiveTab(newValue)
    }
  }

  const handleDrop = useCallback((val: boolean) => {
    setDropClose(val)
  }, [])

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 0 }}>
        <Grid>
          <ToggleButtonGroup color="primary" exclusive onChange={handleChange} size="small" value={activeTab}>
            <ToggleButton value={Treatment.diagnoses}>Diagnoses</ToggleButton>
            <ToggleButton value={Treatment.medications}>Medications</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid mdOffset="auto">
          {!isUserRoleCaregiver &&
            (activeTab === Treatment.diagnoses ? (
              <Button onClick={handleNewDiagnosisOpen} startIcon={<Add />} variant="contained">
                Add New
              </Button>
            ) : activeTab === Treatment.medications ? (
              <Button onClick={handleNewMedicationOpen} startIcon={<Add />} variant="contained">
                Add New
              </Button>
            ) : null)}
        </Grid>
      </Grid>
      <TabPanel activeTab={activeTab} value={Treatment.diagnoses}>
        <List className="list-divided">
          {patientDiagnosesDataIsLoading ? (
            <Spinner />
          ) : patientDiagnosesData?.length ? (
            patientDiagnosesData.map(({ diagnosisId, diagnosisName, createdBy }) => (
              <ListItem
                className={deletingDiagnosesId.includes(diagnosisId) ? 'disabled' : ''}
                key={diagnosisId}
                secondaryAction={
                  !isUserRoleCaregiver && (
                    <IconButton aria-label="delete" edge="end" onClick={() => handleDeleteDiagnosis(diagnosisId)}>
                      <Close />
                    </IconButton>
                  )
                }
              >
                <ListItemText primary={diagnosisName} secondary={`added by ${createdBy}`} />
              </ListItem>
            ))
          ) : (
            <ListItem className="empty-list-item">No diagnoses added</ListItem>
          )}
        </List>
      </TabPanel>
      <TabPanel activeTab={activeTab} value={Treatment.medications}>
        <List className="list-divided">
          {patientMedicationsDataIsLoading ? (
            <Spinner />
          ) : patientMedicationsData?.length ? (
            patientMedicationsData.map((medication) => {
              const { medicationId, genericName, dose, timesPerDay, createdBy } = medication

              return (
                <ListItem
                  className={deletingMedicationsId.includes(medicationId) ? 'disabled' : ''}
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
                    secondary={`${dose ? `${dose} mg / ` : ''}${timesPerDay} - added by ${createdBy}`}
                  />
                </ListItem>
              )
            })
          ) : (
            <ListItem className="empty-list-item">No medications added</ListItem>
          )}
        </List>
      </TabPanel>
      <NewDiagnosisPopup
        handleClose={handleNewDiagnosisClose}
        open={diagnosisPopupOpen}
        patientUserId={patientUserId}
      />
      <NewMedicationPopup
        editingMedication={editingMedication}
        handleClose={handleNewMedicationClose}
        open={isMedicationPopupOpen}
        patientUserId={patientUserId}
      />
    </>
  )
}
