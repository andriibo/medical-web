import { Tab, Tabs, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { RequestsDoctorTab } from '~/enums/requests-tab.enum'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { Spinner } from '~components/Spinner/spinner'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { DoctorOutgoing } from '~pages/Doctor/Requests/components/doctor-outgoing'
import { DoctorWaitingRoom } from '~pages/Doctor/Requests/components/doctor-waiting-room'
import { useGetDataAccessQuery } from '~stores/services/patient-data-access.api'

interface LocationState {
  activeTab?: RequestsDoctorTab
}

export const DoctorRequest = () => {
  const location = useLocation()
  const activeTabState = useMemo(() => (location.state as LocationState)?.activeTab || '', [location])

  const [activeTab, setActiveTab] = useState<RequestsDoctorTab>(activeTabState || RequestsDoctorTab.waitingRoom)

  const { data: dataAccess, isLoading: dataAccessIsLoading } = useGetDataAccessQuery()

  const handleChangeTab = (event: React.SyntheticEvent, value: RequestsDoctorTab) => {
    setActiveTab(value)
  }

  return (
    <div className="white-box content-md">
      <Typography variant="h5">Requests</Typography>
      <Tabs className="tabs" onChange={handleChangeTab} value={activeTab}>
        <Tab label="Waiting Room" value={RequestsDoctorTab.waitingRoom} />
        <Tab label="Outgoing" value={RequestsDoctorTab.outgoing} />
      </Tabs>
      {dataAccessIsLoading ? (
        <Spinner />
      ) : dataAccess ? (
        <>
          <TabPanel activeTab={activeTab} value={RequestsDoctorTab.waitingRoom}>
            <DoctorWaitingRoom dataAccess={dataAccess} />
          </TabPanel>
          <TabPanel activeTab={activeTab} value={RequestsDoctorTab.outgoing}>
            <DoctorOutgoing dataAccess={dataAccess} />
          </TabPanel>
        </>
      ) : (
        <EmptyBox />
      )}
    </div>
  )
}
