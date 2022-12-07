import { Add, Close } from '@mui/icons-material'
import { Button, IconButton, List, ListItem, ListItemText, ToggleButton, ToggleButtonGroup } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'

import { Treatment } from '~/enums/treatment.enum'
import { NewDiagnosisPopup } from '~components/Modal/NewDiagnosisPopup/new-diagnosis-popup'
import { NewMedicationPopup } from '~components/Modal/NewMedicationPopup/new-medication-popup'
import { Spinner } from '~components/Spinner/spinner'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { useDeletePatientDiagnosisMutation, useGetPatientDiagnosesQuery } from '~stores/services/patient-diagnosis.api'
import { useDeletePatientMedicationMutation,
  useGetPatientMedicationsQuery, } from '~stores/services/patient-medication.api'
import { useUserId } from '~stores/slices/auth.slice'

export const PatientTreatment = () => {
  const [diagnosisPopupOpen, setDiagnosisPopupOpen] = useState(false)
  const [deletingDiagnosisId, setDeletingDiagnosisId] = useState<string | null>(null)
  const [deletingMedicationId, setDeletingMedicationId] = useState<string | null>(null)
  const [isMedicationPopupOpen, setIsMedicationPopupOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Treatment>(Treatment.diagnoses)
  const patientUserId = useUserId()
  const { enqueueSnackbar } = useSnackbar()

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
      setDeletingDiagnosisId(diagnosisId)
      await deletePatientDiagnosis({ diagnosisId }).unwrap()

      enqueueSnackbar('Diagnosis was deleted')
    } catch (err) {
      console.error(err)
      setDeletingDiagnosisId(null)
      enqueueSnackbar('Diagnosis was not deleted', { variant: 'warning' })
    }
  }

  const handleNewMedicationOpen = () => {
    setIsMedicationPopupOpen(true)
  }

  const handleNewMedicationClose = () => {
    setIsMedicationPopupOpen(false)
  }

  const handleDeleteMedication = async (medicationId: string) => {
    try {
      setDeletingMedicationId(medicationId)
      await deletePatientMedication({ medicationId }).unwrap()

      enqueueSnackbar('Medication deleted')
    } catch (err) {
      setDeletingMedicationId(null)
      enqueueSnackbar('Medication was not deleted', { variant: 'warning' })
      console.error(err)
    }
  }

  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: Treatment) => {
    if (newValue !== null) {
      setActiveTab(newValue)
    }
  }

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid>
          <ToggleButtonGroup color="primary" exclusive onChange={handleChange} size="small" value={activeTab}>
            <ToggleButton value={Treatment.diagnoses}>Diagnoses</ToggleButton>
            <ToggleButton value={Treatment.medications}>Medications</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid mdOffset="auto">
          {activeTab === Treatment.diagnoses ? (
            <Button onClick={handleNewDiagnosisOpen} startIcon={<Add />} variant="contained">
              Add New
            </Button>
          ) : activeTab === Treatment.medications ? (
            <Button onClick={handleNewMedicationOpen} startIcon={<Add />} variant="contained">
              Add New
            </Button>
          ) : null}
        </Grid>
      </Grid>
      <TabPanel activeTab={activeTab} value={Treatment.diagnoses}>
        <List>
          {patientDiagnosesDataIsLoading ? (
            <Spinner />
          ) : patientDiagnosesData?.length ? (
            patientDiagnosesData.map(({ diagnosisId, diagnosisName, createdByUser }) => (
              <ListItem
                className={deletingDiagnosisId === diagnosisId ? 'disabled' : ''}
                key={diagnosisId}
                secondaryAction={
                  <IconButton aria-label="delete" edge="end" onClick={() => handleDeleteDiagnosis(diagnosisId)}>
                    <Close />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={diagnosisName}
                  secondary={`added by ${createdByUser.firstName} ${createdByUser.lastName}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem className="empty-list-item">No diagnoses added</ListItem>
          )}
        </List>
      </TabPanel>
      <TabPanel activeTab={activeTab} value={Treatment.medications}>
        <List>
          {patientMedicationsDataIsLoading ? (
            <Spinner />
          ) : patientMedicationsData?.length ? (
            patientMedicationsData.map(({ medicationId, genericName, createdByUser }) => (
              <ListItem
                className={deletingMedicationId === medicationId ? 'disabled' : ''}
                key={medicationId}
                secondaryAction={
                  <IconButton aria-label="delete" edge="end" onClick={() => handleDeleteMedication(medicationId)}>
                    <Close />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={genericName}
                  secondary={`added by ${createdByUser.firstName} ${createdByUser.lastName}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem className="empty-list-item">No medications added</ListItem>
          )}
        </List>
      </TabPanel>
      <NewDiagnosisPopup handleClose={handleNewDiagnosisClose} open={diagnosisPopupOpen} />
      <NewMedicationPopup handleClose={handleNewMedicationClose} open={isMedicationPopupOpen} />
    </>
  )
}
