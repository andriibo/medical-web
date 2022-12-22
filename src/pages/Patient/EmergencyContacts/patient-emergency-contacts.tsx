import { PersonAdd } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useEffect, useState } from 'react'

import { ExistingEmergencyContacts } from '~components/ExistingEmergencyContacts/existing-emergency-contacts'
import { EmergencyContactPopup } from '~components/Modal/EmergencyContactPopup/emergency-contact-popup'
import { IEmergencyContact } from '~models/emergency-contact.model'
import { useEmergencyContact } from '~stores/slices/emergency-contact.slice'

export const PatientEmergencyContacts = () => {
  const [emergencyContactPopupOpen, setEmergencyContactPopupOpen] = useState(false)
  const emergencyContact = useEmergencyContact()

  const handleEmergencyContactPopupOpen = () => {
    setEmergencyContactPopupOpen(true)
  }

  const handleEmergencyContactPopupClose = () => {
    setEmergencyContactPopupOpen(false)
  }

  useEffect(() => {
    if (emergencyContact.contactId) {
      handleEmergencyContactPopupOpen()
    }
  }, [emergencyContact])

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
      <ExistingEmergencyContacts />
      <EmergencyContactPopup
        contactData={emergencyContact}
        handleClose={handleEmergencyContactPopupClose}
        open={emergencyContactPopupOpen}
      />
    </div>
  )
}
