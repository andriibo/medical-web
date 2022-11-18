import { Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'

import { TabPanel } from '~components/TabPanel/tab-panel'
import { PatientPersonalInfo } from '~pages/MyAccount/components/patient-personal-info'
import { PatientSettings } from '~pages/MyAccount/components/patient-settings'
import { PatientTreatment } from '~pages/MyAccount/components/patient-treatment'

import styles from './my-account.module.scss'

export const MyAccount = () => {
  const [activeTab, setActiveTab] = useState('tab-personal-info')

  const handleChangeTab = (event: React.SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <div className={`white-box ${styles.accountContainer}`}>
      <Typography variant="h5">My Account</Typography>
      <Tabs className="tabs" onChange={handleChangeTab} value={activeTab}>
        <Tab label="Personal info" value="tab-personal-info" />
        <Tab label="Treatment" value="tab-treatment" />
        <Tab label="Settings" value="tab-settings" />
      </Tabs>
      <TabPanel activeTab={activeTab} value="tab-personal-info">
        <PatientPersonalInfo />
      </TabPanel>
      <TabPanel activeTab={activeTab} value="tab-treatment">
        <PatientTreatment />
      </TabPanel>
      <TabPanel activeTab={activeTab} value="tab-settings">
        <PatientSettings />
      </TabPanel>
    </div>
  )
}
