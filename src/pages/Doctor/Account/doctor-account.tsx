import { Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'

import { AccountTab } from '~/enums/account-tab.enum'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { DoctorPersonalInfo } from '~pages/Doctor/Account/components/doctor-personal-info'
import { DoctorSettings } from '~pages/Doctor/Account/components/doctor-settings'

import styles from './doctor-account.module.scss'

export const DoctorAccount = () => {
  const [activeTab, setActiveTab] = useState<AccountTab>(AccountTab.personalInfo)

  const handleChangeTab = (event: React.SyntheticEvent, value: AccountTab) => {
    setActiveTab(value)
  }

  return (
    <div className={`white-box ${styles.accountContainer}`}>
      <Typography variant="h5">My Account</Typography>
      <Tabs className="tabs" onChange={handleChangeTab} value={activeTab}>
        <Tab label="Personal info" value={AccountTab.personalInfo} />
        <Tab label="Settings" value={AccountTab.settings} />
      </Tabs>
      <TabPanel activeTab={activeTab} value={AccountTab.personalInfo}>
        <DoctorPersonalInfo />
      </TabPanel>
      <TabPanel activeTab={activeTab} value={AccountTab.settings}>
        <DoctorSettings />
      </TabPanel>
    </div>
  )
}
