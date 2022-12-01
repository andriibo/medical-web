import { Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'

import { AccountTab } from '~/enums/account-tab'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { PatientPersonalInfo } from '~pages/Patient/Account/components/patient-personal-info'
import { PatientSettings } from '~pages/Patient/Account/components/patient-settings'
import { PatientTreatment } from '~pages/Patient/Account/components/patient-treatment'

export const PatientAccount = () => {
  const [activeTab, setActiveTab] = useState<AccountTab>(AccountTab.personalInfo)

  const handleChangeTab = (event: React.SyntheticEvent, value: AccountTab) => {
    setActiveTab(value)
  }

  return (
    <div className="white-box content-md">
      <Typography variant="h5">My Account</Typography>
      <Tabs className="tabs" onChange={handleChangeTab} value={activeTab}>
        <Tab label="Personal info" value={AccountTab.personalInfo} />
        <Tab label="Treatment" value={AccountTab.treatment} />
        <Tab label="Settings" value={AccountTab.settings} />
      </Tabs>
      <TabPanel activeTab={activeTab} value={AccountTab.personalInfo}>
        <PatientPersonalInfo />
      </TabPanel>
      <TabPanel activeTab={activeTab} value={AccountTab.treatment}>
        <PatientTreatment />
      </TabPanel>
      <TabPanel activeTab={activeTab} value={AccountTab.settings}>
        <PatientSettings />
      </TabPanel>
    </div>
  )
}