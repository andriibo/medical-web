import { PersonAdd } from '@mui/icons-material'
import { Button, Tab, Tabs, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useState } from 'react'

import { RequestsPatientTab } from '~/enums/requests-tab.enum'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { InviteGrantedUserPopup } from '~components/Modal/InviteGrantedUserPopup/invite-granted-user-popup'
import { Spinner } from '~components/Spinner/spinner'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { PatientIncoming } from '~pages/Patient/Requests/components/patient-incoming'
import { PatientPending } from '~pages/Patient/Requests/components/patient-pending'
import { useGetPatientDataAccessQuery } from '~stores/services/patient-data-access.api'

export const PatientRequests = () => {
  const [activeTab, setActiveTab] = useState<RequestsPatientTab>(RequestsPatientTab.pending)
  const [invitePopupOpen, setInvitePopupOpen] = useState(false)

  const { data: patientDataAccess, isLoading: patientDataAccessIsLoading } = useGetPatientDataAccessQuery()

  const handleChangeTab = (event: React.SyntheticEvent, value: RequestsPatientTab) => {
    setActiveTab(value)
  }

  const handleInvitePopupOpen = () => setInvitePopupOpen(true)

  const handleInvitePopupClose = () => setInvitePopupOpen(false)

  return (
    <>
      <div className="white-box content-md">
        <Typography sx={{ mb: 1 }} variant="h5">
          Requests
        </Typography>
        <Grid container spacing={3}>
          <Grid>
            <Tabs onChange={handleChangeTab} value={activeTab}>
              <Tab label="Pending" value={RequestsPatientTab.pending} />
              <Tab label="Incoming" value={RequestsPatientTab.incoming} />
            </Tabs>
          </Grid>
          <Grid mdOffset="auto">
            <Button onClick={handleInvitePopupOpen} startIcon={<PersonAdd />} variant="outlined">
              Invite
            </Button>
          </Grid>
        </Grid>
        {patientDataAccessIsLoading ? (
          <Spinner />
        ) : patientDataAccess ? (
          <>
            <TabPanel activeTab={activeTab} value={RequestsPatientTab.pending}>
              <PatientPending patientDataAccess={patientDataAccess} />
            </TabPanel>
            <TabPanel activeTab={activeTab} value={RequestsPatientTab.incoming}>
              <PatientIncoming patientDataAccess={patientDataAccess} />
            </TabPanel>
          </>
        ) : (
          <EmptyBox />
        )}
      </div>
      <InviteGrantedUserPopup handleClose={handleInvitePopupClose} open={invitePopupOpen} />
    </>
  )
}
