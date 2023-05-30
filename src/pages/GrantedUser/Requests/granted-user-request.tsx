import { PersonAdd } from '@mui/icons-material'
import { Button, Tab, Tabs, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { RequestsGrantedUserTab } from '~/enums/requests-tab.enum'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { InvitePatientPopup } from '~components/Modal/InvitePatientPopup/invite-patient-popup'
import { Spinner } from '~components/Spinner/spinner'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { GrantedUserOutgoing } from '~pages/GrantedUser/Requests/components/granted-user-outgoing'
import { GrantedUserWaitingRoom } from '~pages/GrantedUser/Requests/components/granted-user-waiting-room'
import { useGetDataAccessQuery } from '~stores/services/patient-data-access.api'

interface LocationState {
  activeTab?: RequestsGrantedUserTab
}

export const GrantedUserRequest = () => {
  const location = useLocation()
  const activeTabState = useMemo(() => (location.state as LocationState)?.activeTab || '', [location])

  const [activeTab, setActiveTab] = useState<RequestsGrantedUserTab>(
    activeTabState || RequestsGrantedUserTab.waitingRoom,
  )
  const [invitePopupOpen, setInvitePopupOpen] = useState(false)

  const { data: dataAccess, isLoading: dataAccessIsLoading } = useGetDataAccessQuery()

  const handleChangeTab = (event: React.SyntheticEvent, value: RequestsGrantedUserTab) => {
    setActiveTab(value)
  }

  const handleInvitePopupOpen = () => {
    setInvitePopupOpen(true)
  }

  const handleInvitePopupClose = () => {
    setInvitePopupOpen(false)
  }

  return (
    <>
      <div className="white-box content-md">
        <Typography sx={{ mb: 1 }} variant="h5">
          Requests
        </Typography>
        <Grid container spacing={3}>
          <Grid>
            <Tabs onChange={handleChangeTab} value={activeTab}>
              <Tab label="Waiting Room" value={RequestsGrantedUserTab.waitingRoom} />
              <Tab label="Outgoing" value={RequestsGrantedUserTab.outgoing} />
            </Tabs>
          </Grid>
          <Grid mdOffset="auto">
            <Button onClick={handleInvitePopupOpen} startIcon={<PersonAdd />} variant="outlined">
              Invite
            </Button>
          </Grid>
        </Grid>
        {dataAccessIsLoading ? (
          <Spinner />
        ) : dataAccess ? (
          <>
            <TabPanel activeTab={activeTab} value={RequestsGrantedUserTab.waitingRoom}>
              <GrantedUserWaitingRoom dataAccess={dataAccess} />
            </TabPanel>
            <TabPanel activeTab={activeTab} value={RequestsGrantedUserTab.outgoing}>
              <GrantedUserOutgoing dataAccess={dataAccess} />
            </TabPanel>
          </>
        ) : (
          <EmptyBox />
        )}
      </div>
      <InvitePatientPopup handleClose={handleInvitePopupClose} open={invitePopupOpen} />
    </>
  )
}
