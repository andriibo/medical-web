import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
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
      <Grid container spacing={3} sx={{ mb: 0 }}>
        <Grid xs>
          <Typography variant="h5">
            {activeTab === VitalsTab.history ? 'Abnormal History' : 'Current Vitals'}
          </Typography>
        </Grid>
        <Grid>
          <ToggleButtonGroup color="primary" exclusive onChange={handleChangeTab} size="small" value={activeTab}>
            <ToggleButton value={VitalsTab.history}>{VitalsTab.history}</ToggleButton>
            <ToggleButton value={VitalsTab.now}>{VitalsTab.now}</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
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
