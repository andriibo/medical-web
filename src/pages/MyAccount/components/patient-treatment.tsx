import { Add, Close } from '@mui/icons-material'
import {
  Button,
  ButtonGroup,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import { NewDiagnosisPopup } from '~components/Modal/NewDiagnosisPopup/new-diagnosis-popup'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { useDeletePatientDiagnosesMutation, useGetPatientDiagnosesQuery } from '~stores/services/patient-diagnoses.api'
import { useUserId } from '~stores/slices/auth.slice'

export const PatientTreatment = () => {
  const [isNewDiagnosisOpen, setIsNewDiagnosisOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('diagnoses')
  const patientUserId = useUserId()
  const { enqueueSnackbar } = useSnackbar()

  const { data: diagnosesData } = useGetPatientDiagnosesQuery({ patientUserId })
  const [deletePatientDiagnose] = useDeletePatientDiagnosesMutation()

  const handleNewDiagnosisOpen = () => {
    setIsNewDiagnosisOpen(true)
  }

  const handleNewDiagnosisClose = () => {
    setIsNewDiagnosisOpen(false)
  }

  const handleDeleteDiagnose = async (diagnosisId: string) => {
    try {
      const response = await deletePatientDiagnose({ diagnosisId }).unwrap()

      console.log(response)
      enqueueSnackbar('Diagnose deleted')
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Diagnose deleted', { variant: 'warning' })
    }
  }

  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
    if (newValue !== null) {
      setActiveTab(newValue)
    }
  }

  return (
    <div>
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid>
          <ToggleButtonGroup color="primary" exclusive onChange={handleChange} size="small" value={activeTab}>
            <ToggleButton value="diagnoses">Diagnoses</ToggleButton>
            <ToggleButton value="medications">Medications</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid mdOffset="auto">
          <Button onClick={handleNewDiagnosisOpen} startIcon={<Add />} variant="contained">
            Add New
          </Button>
        </Grid>
      </Grid>
      <TabPanel activeTab={activeTab} value="diagnoses">
        <List>
          {diagnosesData?.length ? (
            diagnosesData.map(({ diagnosisId, diagnosisName, createdByUser }) => (
              <ListItem
                key={diagnosisId}
                secondaryAction={
                  <IconButton aria-label="delete" edge="end" onClick={() => handleDeleteDiagnose(diagnosisId)}>
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
            <ListItem>There are no diagnoses</ListItem>
          )}
        </List>
      </TabPanel>
      <TabPanel activeTab={activeTab} value="medications">
        medications
      </TabPanel>
      <NewDiagnosisPopup handleClose={handleNewDiagnosisClose} open={isNewDiagnosisOpen} />
    </div>
  )
}
