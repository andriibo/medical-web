import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useMemo, useState } from 'react'

import { VitalOrderKeys } from '~/enums/vital-order.enum'
import { VitalsTab } from '~/enums/vitals-tab.enum'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { Thresholds } from '~components/Thresholds/thresholds'
import { Vitals } from '~components/Vitals/vitals'
import { VitalsHistorySorting } from '~components/VitalsHistory/vitals-history-sorting'
import { VitalsHistory } from '~components/VitalsHistory/vitals-history'

export const PatientVitals = () => {
  const [activeTab, setActiveTab] = useState<VitalsTab>(VitalsTab.history)
  const [historySort, setHistorySort] = useState<VitalOrderKeys>('oldest')

  const isHistory = useMemo(() => activeTab === VitalsTab.history, [activeTab])

  const handleChangeTab = (event: React.SyntheticEvent, value: VitalsTab) => {
    if (value !== null) {
      setActiveTab(value)
    }
  }

  return (
    <div className="white-box content-md">
      <Grid container spacing={3} sx={{ mb: 0 }}>
        <Grid xs>
          <Typography variant="h5">{isHistory ? 'Abnormal History' : 'Current Vitals'}</Typography>
        </Grid>
        {isHistory && (
          <Grid>
            <VitalsHistorySorting handleSort={setHistorySort} sort={historySort} />
          </Grid>
        )}
        <Grid>
          <ToggleButtonGroup color="primary" exclusive onChange={handleChangeTab} size="small" value={activeTab}>
            <ToggleButton value={VitalsTab.history}>{VitalsTab.history}</ToggleButton>
            <ToggleButton value={VitalsTab.now}>{VitalsTab.now}</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <TabPanel activeTab={activeTab} value={VitalsTab.history}>
        <VitalsHistory historySort={historySort} />
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
