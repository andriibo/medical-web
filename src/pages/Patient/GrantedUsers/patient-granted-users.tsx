import { PersonAdd } from '@mui/icons-material'
import { Button, Tab, Tabs, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useState } from 'react'

import { UserRole } from '~/enums/roles.enum'
import { InviteGrantedUserPopup } from '~components/Modal/InviteGrantedUserPopup/invite-granted-user-popup'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { PatientCaregivers } from '~pages/Patient/GrantedUsers/components/patient-caregivers'
import { PatientDoctors } from '~pages/Patient/GrantedUsers/components/patient-doctors'

export const PatientGrantedUsers = () => {
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.Doctor)
  const [inviteGrantedUserPopupOpen, setInviteGrantedUserPopupOpen] = useState(false)

  const handleChangeTab = (event: React.SyntheticEvent, value: UserRole) => {
    if (value !== null) {
      setActiveTab(value)
    }
  }

  const handleInviteGrantedUserPopupOpen = () => setInviteGrantedUserPopupOpen(true)

  const handleInviteGrantedUserPopupClose = () => setInviteGrantedUserPopupOpen(false)

  return (
    <>
      <div className="white-box content-md">
        <Typography sx={{ mb: 1 }} variant="h5">
          Medical Doctors & Caregivers
        </Typography>
        <Grid container spacing={3} sx={{ mb: 1 }}>
          <Grid>
            <Tabs onChange={handleChangeTab} value={activeTab}>
              <Tab label="Medical Doctors" value={UserRole.Doctor} />
              <Tab label="Caregivers" value={UserRole.Caregiver} />
            </Tabs>
          </Grid>
          <Grid mdOffset="auto">
            <Button onClick={handleInviteGrantedUserPopupOpen} startIcon={<PersonAdd />} variant="outlined">
              Invite
            </Button>
          </Grid>
        </Grid>
        <TabPanel activeTab={activeTab} value={UserRole.Doctor}>
          <PatientDoctors />
        </TabPanel>
        <TabPanel activeTab={activeTab} value={UserRole.Caregiver}>
          <PatientCaregivers />`
        </TabPanel>
      </div>
      <InviteGrantedUserPopup handleClose={handleInviteGrantedUserPopupClose} open={inviteGrantedUserPopupOpen} />
    </>
  )
}
