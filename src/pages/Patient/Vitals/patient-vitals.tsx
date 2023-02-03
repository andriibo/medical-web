import { Box, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'

import { VitalsTab } from '~/enums/vitals-tab'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { Thresholds } from '~components/Thresholds/thresholds'
import { Vitals } from '~components/Vitals/vitals'
import { VitalsHistory } from '~components/VitalsHistory/vitals-history'

export const PatientVitals = () => {
  const [activeTab, setActiveTab] = useState<VitalsTab>(VitalsTab.history)

  return (
    <div className="white-box content-md">
      <Tabs className="tabs" onChange={(e, value) => setActiveTab(value)} value={activeTab}>
        <Tab label="History" value={VitalsTab.history} />
        <Tab label="Now" value={VitalsTab.now} />
      </Tabs>
      <TabPanel activeTab={activeTab} value={VitalsTab.history}>
        <VitalsHistory />
      </TabPanel>
      <TabPanel activeTab={activeTab} value={VitalsTab.now}>
        <Box sx={{ mb: 4 }}>
          <Vitals />
        </Box>
        <Typography sx={{ mb: 1 }} variant="h5">
          Thresholds
        </Typography>
        <Thresholds />
      </TabPanel>
    </div>
  )
}
