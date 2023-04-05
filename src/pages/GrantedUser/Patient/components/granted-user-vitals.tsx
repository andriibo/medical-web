import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { FC, useState } from 'react'

import { VitalsTab } from '~/enums/vitals-tab'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { Vitals } from '~components/Vitals/vitals'
import { VitalsHistory } from '~components/VitalsHistory/vitals-history'

interface GrantedUserVitalsProps {
  patientUserId: string
}

export const GrantedUserVitals: FC<GrantedUserVitalsProps> = ({ patientUserId }) => {
  const [activeTab, setActiveTab] = useState<VitalsTab>(VitalsTab.history)

  const handleChangeTab = (event: React.SyntheticEvent, value: VitalsTab) => {
    if (value !== null) {
      setActiveTab(value)
    }
  }

  return (
    <>
      <Grid alignItems="center" container spacing={3} sx={{ mb: 0 }}>
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
        <VitalsHistory patientUserId={patientUserId} />
      </TabPanel>
      <TabPanel activeTab={activeTab} value={VitalsTab.now}>
        <Vitals patientUserId={patientUserId} />
      </TabPanel>
    </>
  )
}
