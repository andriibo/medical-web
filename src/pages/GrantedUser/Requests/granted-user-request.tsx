import { Tab, Tabs, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { RequestsGrantedUserTab } from '~/enums/requests-tab.enum'
import { EmptyBox } from '~components/EmptyBox/empty-box'
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

  const { data: dataAccess, isLoading: dataAccessIsLoading } = useGetDataAccessQuery()

  const handleChangeTab = (event: React.SyntheticEvent, value: RequestsGrantedUserTab) => {
    setActiveTab(value)
  }

  return (
    <div className="white-box content-md">
      <Typography variant="h5">Requests</Typography>
      <Tabs className="tabs" onChange={handleChangeTab} value={activeTab}>
        <Tab label="Waiting Room" value={RequestsGrantedUserTab.waitingRoom} />
        <Tab label="Outgoing" value={RequestsGrantedUserTab.outgoing} />
      </Tabs>
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
  )
}
