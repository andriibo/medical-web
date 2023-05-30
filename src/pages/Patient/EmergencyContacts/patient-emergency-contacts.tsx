import { PersonAdd } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useEffect, useState } from 'react'

import { EmergencyContacts } from '~components/EmergencyContacts/emergency-contacts'
import { EmergencyContactPopup } from '~components/Modal/EmergencyContactPopup/emergency-contact-popup'
import { InviteGrantedUserPopup } from '~components/Modal/InviteGrantedUserPopup/invite-granted-user-popup'
import { SuggestedContacts } from '~components/SuggestedContacts/suggested-contacts'
import { useEmergencyContact } from '~stores/slices/emergency-contact.slice'

export const PatientEmergencyContacts = () => {
  const emergencyContact = useEmergencyContact()

  const [emergencyContactPopupOpen, setEmergencyContactPopupOpen] = useState(false)
  const [invitePopupOpen, setInvitePopupOpen] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState<string | null>(null)

  const handleEmergencyContactPopupOpen = () => {
    setEmergencyContactPopupOpen(true)
  }

  const handleEmergencyContactPopupClose = () => {
    setEmergencyContactPopupOpen(false)
  }

  const handleInvitePopupOpen = () => setInvitePopupOpen(true)

  const handleInvitePopupClose = () => {
    setInvitePopupOpen(false)
    setNewUserEmail(null)
  }

  useEffect(() => {
    if (emergencyContact.contactId) {
      handleEmergencyContactPopupOpen()
    }
  }, [emergencyContact])

  useEffect(() => {
    if (newUserEmail) {
      handleInvitePopupOpen()
    }
  }, [newUserEmail])

  return (
    <div className="white-box content-md">
      <SuggestedContacts
        heading={
          <Typography sx={{ mb: 2 }} variant="h5">
            Suggested
          </Typography>
        }
      />
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
      <EmergencyContacts handleInviteNewUser={setNewUserEmail} />
      <EmergencyContactPopup
        contactData={emergencyContact}
        handleClose={handleEmergencyContactPopupClose}
        handleInviteNewUser={setNewUserEmail}
        open={emergencyContactPopupOpen}
      />
      <InviteGrantedUserPopup handleClose={handleInvitePopupClose} initialEmail={newUserEmail} open={invitePopupOpen} />
    </div>
  )
}
