import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { FC, useMemo, useState } from 'react'

import { VitalOrderKeys } from '~/enums/vital-order.enum'
import { VitalsTab } from '~/enums/vitals-tab.enum'
import { useCurrentVitalsSocket } from '~/hooks/use-current-vitals-socket'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { Vitals } from '~components/Vitals/vitals'
import { VitalsHistory } from '~components/VitalsHistory/vitals-history'
import { VitalsHistorySorting } from '~components/VitalsHistory/vitals-history-sorting'

interface GrantedUserVitalsProps {
  patientUserId: string
}

export const GrantedUserPatientVitals: FC<GrantedUserVitalsProps> = ({ patientUserId }) => {
  const [activeTab, setActiveTab] = useState<VitalsTab>(VitalsTab.history)
  const [historySort, setHistorySort] = useState<VitalOrderKeys>('recent')

  const { vitals, lastUpdate, isUpdatingEnd, isLoading } = useCurrentVitalsSocket({ patientUserId })

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
        <VitalsHistory historySort={historySort} patientUserId={patientUserId} />
      </TabPanel>
      <TabPanel activeTab={activeTab} value={VitalsTab.now}>
        <Vitals
          isLoading={isLoading}
          isUpdatingEnd={isUpdatingEnd}
          lastUpdate={lastUpdate}
          patientUserId={patientUserId}
          vitals={vitals}
        />
      </TabPanel>
    </>
  )
}
