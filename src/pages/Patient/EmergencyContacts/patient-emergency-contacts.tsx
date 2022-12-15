import { PersonAdd } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React from 'react'

import { EmergencyContacts } from '~components/EmergencyContacts/emergency-contacts'

export const PatientEmergencyContacts = () => {
  console.log('EmergencyContacts')
  const handleEmergencyContactPopupOpen = () => {
    console.log(11)
  }

  return (
    <div className="white-box content-md">
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid xs>
          <Typography variant="h5">Existing</Typography>
        </Grid>
        <Grid>
          <Button onClick={handleEmergencyContactPopupOpen} startIcon={<PersonAdd />} variant="outlined">
            Add new
          </Button>
        </Grid>
      </Grid>
      Emergency contacts
      <EmergencyContacts />
    </div>
  )
}
