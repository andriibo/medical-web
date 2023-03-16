import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useState } from 'react'

import { VitalsTab } from '~/enums/vitals-tab'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { Thresholds } from '~components/Thresholds/thresholds'
import { Vitals } from '~components/Vitals/vitals'
import { VitalsHistory } from '~components/VitalsHistory/vitals-history'

export const PatientVitals = () => {
  const [activeTab, setActiveTab] = useState<VitalsTab>(VitalsTab.history)

  const handleChangeTab = (event: React.SyntheticEvent, value: VitalsTab) => {
    if (value !== null) {
      setActiveTab(value)
    }
  }

  return (
    <div className="white-box content-md">
      <ToggleButtonGroup
        color="primary"
        exclusive
        onChange={handleChangeTab}
        size="small"
        sx={{ mb: 2 }}
        value={activeTab}
      >
        <ToggleButton value={VitalsTab.history}>{VitalsTab.history}</ToggleButton>
        <ToggleButton value={VitalsTab.now}>{VitalsTab.now}</ToggleButton>
      </ToggleButtonGroup>
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
