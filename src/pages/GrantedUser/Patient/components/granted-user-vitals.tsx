import { Box, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material'
import React, { FC, useState } from 'react'

import { Treatment } from '~/enums/treatment.enum'
import { VitalsTab } from '~/enums/vitals-tab'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { Vitals } from '~components/Vitals/vitals'
import { VitalsHistory } from '~components/VitalsHistory/vitals-history'

interface GrantedUserVitalsProps {
  patientUserId: string
}

export const GrantedUserVitals: FC<GrantedUserVitalsProps> = ({ patientUserId }) => {
  const [activeTab, setActiveTab] = useState<VitalsTab>(VitalsTab.history)

  return (
    <div>
      <ToggleButtonGroup
        color="primary"
        exclusive
        onChange={(e, value) => setActiveTab(value)}
        size="small"
        sx={{ mb: 2 }}
        value={activeTab}
      >
        <ToggleButton value={VitalsTab.history}>{VitalsTab.history}</ToggleButton>
        <ToggleButton value={VitalsTab.now}>{VitalsTab.now}</ToggleButton>
      </ToggleButtonGroup>
      <TabPanel activeTab={activeTab} value={VitalsTab.history}>
        <VitalsHistory patientUserId={patientUserId} />
      </TabPanel>
      <TabPanel activeTab={activeTab} value={VitalsTab.now}>
        <Box sx={{ mb: 4 }}>
          <Vitals />
        </Box>
      </TabPanel>
    </div>
  )
}
