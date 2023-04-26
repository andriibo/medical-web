import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { FC, useMemo, useState } from 'react'

import { VitalOrderKeys } from '~/enums/vital-order.enum'
import { VitalsTab } from '~/enums/vitals-tab.enum'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { Vitals } from '~components/Vitals/vitals'
import { VitalHistorySorting } from '~components/VitalsHistory/vital-history-sorting'
import { VitalsHistory } from '~components/VitalsHistory/vitals-history'

interface GrantedUserVitalsProps {
  patientUserId: string
}

export const GrantedUserVitals: FC<GrantedUserVitalsProps> = ({ patientUserId }) => {
  const [activeTab, setActiveTab] = useState<VitalsTab>(VitalsTab.history)
  const [historySort, setHistorySort] = useState<VitalOrderKeys>('recent')

  const isHistory = useMemo(() => activeTab === VitalsTab.history, [activeTab])

  const handleChangeTab = (event: React.SyntheticEvent, value: VitalsTab) => {
    if (value !== null) {
      setActiveTab(value)
    }
  }

  return (
    <>
      <Grid alignItems="center" container spacing={3} sx={{ mb: 0 }}>
        <Grid xs>
          <Typography variant="h5">{isHistory ? 'Abnormal History' : 'Current Vitals'}</Typography>
        </Grid>
        {isHistory && (
          <Grid>
            <VitalHistorySorting handleSort={setHistorySort} sort={historySort} />
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
        <VitalsHistory historySort={historySort} patientUserId={patientUserId} />
      </TabPanel>
      <TabPanel activeTab={activeTab} value={VitalsTab.now}>
        <Vitals patientUserId={patientUserId} />
      </TabPanel>
    </>
  )
}
