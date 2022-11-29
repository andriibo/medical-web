import { Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'

import { AccountTabEnum } from '~/enums/account-tab.enum'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { DoctorPersonalInfo } from '~pages/Doctor/Account/components/doctor-personal-info'
import { DoctorSettings } from '~pages/Doctor/Account/components/doctor-settings'

import styles from './doctor-account.module.scss'

export const DoctorAccount = () => {
  const [activeTab, setActiveTab] = useState<AccountTabEnum>(AccountTabEnum.personalInfo)

  const handleChangeTab = (event: React.SyntheticEvent, value: AccountTabEnum) => {
    setActiveTab(value)
  }

  return (
    <div className={`white-box ${styles.accountContainer}`}>
      <Typography variant="h5">My Account</Typography>
      <Tabs className="tabs" onChange={handleChangeTab} value={activeTab}>
        <Tab label="Personal info" value={AccountTabEnum.personalInfo} />
        <Tab label="Settings" value={AccountTabEnum.settings} />
      </Tabs>
      <TabPanel activeTab={activeTab} value={AccountTabEnum.personalInfo}>
        <DoctorPersonalInfo />
      </TabPanel>
      <TabPanel activeTab={activeTab} value={AccountTabEnum.settings}>
        <DoctorSettings />
      </TabPanel>
    </div>
  )
}
