import { Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'

import { RequestsPatientTab } from '~/enums/requests-tab.enum'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { Spinner } from '~components/Spinner/spinner'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { PatientTreatment } from '~pages/Patient/Account/components/patient-treatment'
import { PatientIncoming } from '~pages/Patient/Requests/components/patient-incoming'
import { PatientPending } from '~pages/Patient/Requests/components/patient-pending'
import { useGetPatientDataAccessQuery } from '~stores/services/patient-data-access.api'

export const PatientRequests = () => {
  const [activeTab, setActiveTab] = useState<RequestsPatientTab>(RequestsPatientTab.pending)

  const { data: patientDataAccess, isLoading: patientDataAccessIsLoading } = useGetPatientDataAccessQuery()

  const handleChangeTab = (event: React.SyntheticEvent, value: RequestsPatientTab) => {
    setActiveTab(value)
  }

  return (
    <div className="white-box content-md">
      <Typography variant="h5">Requests</Typography>
      <Tabs className="tabs" onChange={handleChangeTab} value={activeTab}>
        <Tab label="Pending" value={RequestsPatientTab.pending} />
        <Tab label="Incoming" value={RequestsPatientTab.incoming} />
      </Tabs>
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
  )
}
