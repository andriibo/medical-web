import { PersonAdd } from '@mui/icons-material'
import { Button, Tab, Tabs, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useState } from 'react'

import { UserRole } from '~/enums/roles.enum'
import { InviteCaregiverPopup } from '~components/Modal/InviteCaregiverPopup/invite-caregiver-popup'
import { InviteDoctorPopup } from '~components/Modal/InviteDoctorPopup/invite-doctor-popup'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { PatientCaregivers } from '~pages/Patient/GrantedUsers/components/patient-caregivers'
import { PatientDoctors } from '~pages/Patient/GrantedUsers/components/patient-doctors'

export const PatientGrantedUsers = () => {
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.Doctor)

  const [inviteDoctorPopupOpen, setInviteDoctorPopupOpen] = useState(false)
  const [inviteCaregiverPopupOpen, setInviteCaregiverPopupOpen] = useState(false)

  const handleChangeTab = (event: React.SyntheticEvent, value: UserRole) => {
    if (value !== null) {
      setActiveTab(value)
    }
  }

  const handleInviteDoctorPopupOpen = () => setInviteDoctorPopupOpen(true)

  const handleInviteDoctorPopupClose = () => setInviteDoctorPopupOpen(false)

  const handleInviteCaregiverPopupOpen = () => setInviteCaregiverPopupOpen(true)

  const handleInviteCaregiverPopupClose = () => setInviteCaregiverPopupOpen(false)

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
            {activeTab === UserRole.Doctor ? (
              <Button onClick={handleInviteDoctorPopupOpen} startIcon={<PersonAdd />} variant="outlined">
                Invite
              </Button>
            ) : activeTab === UserRole.Caregiver ? (
              <Button onClick={handleInviteCaregiverPopupOpen} startIcon={<PersonAdd />} variant="outlined">
                Invite
              </Button>
            ) : null}
          </Grid>
        </Grid>
        <TabPanel activeTab={activeTab} value={UserRole.Doctor}>
          <PatientDoctors />
        </TabPanel>
        <TabPanel activeTab={activeTab} value={UserRole.Caregiver}>
          <PatientCaregivers />
        </TabPanel>
      </div>
      <InviteDoctorPopup handleClose={handleInviteDoctorPopupClose} open={inviteDoctorPopupOpen} />
      <InviteCaregiverPopup handleClose={handleInviteCaregiverPopupClose} open={inviteCaregiverPopupOpen} />
    </>
  )
}
