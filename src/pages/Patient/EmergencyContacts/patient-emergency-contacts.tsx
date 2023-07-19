import { PersonAdd } from '@mui/icons-material'
import { Button, Tab, Tabs, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useEffect, useState } from 'react'

import { EmergencyContactTab } from '~/enums/emergency-contact-tab.enum'
import { EmergencyContacts } from '~components/EmergencyContacts/emergency-contacts'
import { EmergencyContactPopup } from '~components/Modal/EmergencyContactPopup/emergency-contact-popup'
import { InviteGrantedUserPopup } from '~components/Modal/InviteGrantedUserPopup/invite-granted-user-popup'
import { SuggestedContacts } from '~components/SuggestedContacts/suggested-contacts'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { useOrganizationEmergencyContact, usePersonEmergencyContact } from '~stores/slices/emergency-contact.slice'

export const PatientEmergencyContacts = () => {
  const personEmergencyContact = usePersonEmergencyContact()
  const organizationEmergencyContact = useOrganizationEmergencyContact()

  const [emergencyContactPopupOpen, setEmergencyContactPopupOpen] = useState(false)
  const [invitePopupOpen, setInvitePopupOpen] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<EmergencyContactTab>(EmergencyContactTab.Existing)

  const handleChangeTab = (event: React.SyntheticEvent, value: EmergencyContactTab) => {
    if (value !== null) {
      setActiveTab(value)
    }
  }

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
    if (personEmergencyContact.contactId || organizationEmergencyContact.contactId) {
      handleEmergencyContactPopupOpen()
    }
  }, [organizationEmergencyContact, personEmergencyContact])

  useEffect(() => {
    if (newUserEmail) {
      handleInvitePopupOpen()
    }
  }, [newUserEmail])

  return (
    <div className="white-box content-md">
      <Typography sx={{ mb: 1 }} variant="h5">
        Emergency Contacts
      </Typography>
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid>
          <Tabs onChange={handleChangeTab} value={activeTab}>
            <Tab label="Existing" value={EmergencyContactTab.Existing} />
            <Tab label="Suggested" value={EmergencyContactTab.Suggested} />
          </Tabs>
        </Grid>
        <Grid mdOffset="auto">
          <Button onClick={handleEmergencyContactPopupOpen} startIcon={<PersonAdd />} variant="outlined">
            Add new
          </Button>
        </Grid>
      </Grid>
      <TabPanel activeTab={activeTab} value={EmergencyContactTab.Existing}>
        <EmergencyContacts handleInviteNewUser={setNewUserEmail} />
      </TabPanel>
      <TabPanel activeTab={activeTab} value={EmergencyContactTab.Suggested}>
        <SuggestedContacts />
      </TabPanel>
      <EmergencyContactPopup
        handleClose={handleEmergencyContactPopupClose}
        handleInviteNewUser={setNewUserEmail}
        open={emergencyContactPopupOpen}
      />
      <InviteGrantedUserPopup handleClose={handleInvitePopupClose} initialEmail={newUserEmail} open={invitePopupOpen} />
    </div>
  )
}
