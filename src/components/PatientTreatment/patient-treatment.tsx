import { Add, Close } from '@mui/icons-material'
import { Button, IconButton, List, ListItem, ListItemText, ToggleButton, ToggleButtonGroup } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { FC, useState } from 'react'

import { Treatment } from '~/enums/treatment.enum'
import { useUserRoles } from '~/hooks/use-user-roles'
import { NewDiagnosisPopup } from '~components/Modal/NewDiagnosisPopup/new-diagnosis-popup'
import { PatientMedications } from '~components/PatientMedications/patient-medications'
import { Spinner } from '~components/Spinner/spinner'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { pushValueToArrayState, removeValueFromArrayState } from '~helpers/state-helper'
import { useDeletePatientDiagnosisMutation, useGetPatientDiagnosesQuery } from '~stores/services/patient-diagnosis.api'

interface PatientTreatmentProps {
  patientUserId: string
}

export const PatientTreatment: FC<PatientTreatmentProps> = ({ patientUserId }) => {
  const { isUserRoleCaregiver } = useUserRoles()
  const { enqueueSnackbar } = useSnackbar()

  const [diagnosisPopupOpen, setDiagnosisPopupOpen] = useState(false)
  const [deletingDiagnosesId, setDeletingDiagnosesId] = useState<string[]>([])
  const [isMedicationPopupOpen, setIsMedicationPopupOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Treatment>(Treatment.diagnoses)

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

  const handleNewMedicationOpen = () => {
    setIsMedicationPopupOpen(true)
  }

  const handleNewMedicationClose = () => {
    setIsMedicationPopupOpen(false)
  }

  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: Treatment) => {
    if (newValue !== null) {
      setActiveTab(newValue)
    }
  }

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
          {!isUserRoleCaregiver && (
            <>
              {activeTab === Treatment.diagnoses && (
                <Button onClick={handleNewDiagnosisOpen} startIcon={<Add />} variant="contained">
                  Add New
                </Button>
              )}
              {activeTab === Treatment.medications && (
                <Button onClick={handleNewMedicationOpen} startIcon={<Add />} variant="contained">
                  Add New
                </Button>
              )}
            </>
          )}
        </Grid>
      </Grid>
      <TabPanel activeTab={activeTab} value={Treatment.diagnoses}>
        <List className="list-divided">
          {patientDiagnosesDataIsLoading ? (
            <Spinner />
          ) : patientDiagnosesData?.length ? (
            patientDiagnosesData.map(({ diagnosisId, diagnosisName, createdByUser }) => {
              const authorText =
                createdByUser && `added by ${createdByUser.firstName} ${createdByUser.lastName} (${createdByUser.role})`

              return (
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
                  <ListItemText primary={diagnosisName} secondary={authorText} />
                </ListItem>
              )
            })
          ) : (
            <ListItem className="empty-list-item">No diagnoses added</ListItem>
          )}
        </List>
      </TabPanel>
      <TabPanel activeTab={activeTab} value={Treatment.medications}>
        <PatientMedications handlePopupClose={handleNewMedicationClose} popupOpen={isMedicationPopupOpen} />
      </TabPanel>
      <NewDiagnosisPopup
        handleClose={handleNewDiagnosisClose}
        open={diagnosisPopupOpen}
        patientUserId={patientUserId}
      />
    </>
  )
}
