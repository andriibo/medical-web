import { Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'

import { AccountTabEnum } from '~/enums/account-tab.enum'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { PatientPersonalInfo } from '~pages/Patient/Account/components/patient-personal-info'
import { PatientSettings } from '~pages/Patient/Account/components/patient-settings'
import { PatientTreatment } from '~pages/Patient/Account/components/patient-treatment'

export const PatientAccount = () => {
  const [activeTab, setActiveTab] = useState<AccountTabEnum>(AccountTabEnum.personalInfo)

  const handleChangeTab = (event: React.SyntheticEvent, value: AccountTabEnum) => {
    setActiveTab(value)
  }

  return (
    <div className="white-box content-md">
      <Typography variant="h5">My Account</Typography>
      <Tabs className="tabs" onChange={handleChangeTab} value={activeTab}>
        <Tab label="Personal info" value={AccountTabEnum.personalInfo} />
        <Tab label="Treatment" value={AccountTabEnum.treatment} />
        <Tab label="Settings" value={AccountTabEnum.settings} />
      </Tabs>
      <TabPanel activeTab={activeTab} value={AccountTabEnum.personalInfo}>
        <PatientPersonalInfo />
      </TabPanel>
      <TabPanel activeTab={activeTab} value={AccountTabEnum.treatment}>
        <PatientTreatment />
      </TabPanel>
      <TabPanel activeTab={activeTab} value={AccountTabEnum.settings}>
        <PatientSettings />
      </TabPanel>
    </div>
  )
}
