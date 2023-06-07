import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { Dayjs } from 'dayjs'
import React, { FC, useEffect, useState } from 'react'

import { VitalsFilterType, VitalsTypeFilterKeys } from '~/enums/vital-type.enum'
import { RangeDate } from '~components/RangeDate/range-date'
import { getObjectKeys } from '~helpers/get-object-keys'

interface VitalsHistoryFilterProps {
  initialStartDate: Dayjs | null
  initialEndDate: Dayjs | null
  onTypesChange: (value: VitalsTypeFilterKeys) => void
  handleRange: (startDate: Dayjs, endDate: Dayjs) => void
}

export const VitalsHistoryFilter: FC<VitalsHistoryFilterProps> = ({
  initialStartDate,
  initialEndDate,
  onTypesChange,
  handleRange,
}) => {
  const [filterType, setFilterType] = useState<VitalsTypeFilterKeys>('all')

  const onFilterTypeChange = (key: VitalsTypeFilterKeys) => {
    setFilterType(key)
  }

  useEffect(() => {
    onTypesChange(filterType)
  }, [filterType, onTypesChange])

  return (
    <Grid container spacing={3} sx={{ mb: 0 }}>
      <Grid xs>
        <ToggleButtonGroup color="primary" size="small">
          {getObjectKeys(VitalsFilterType).map((key) => (
            <ToggleButton
              disabled={key === 'bp'}
              key={key}
              onClick={() => onFilterTypeChange(key)}
              selected={filterType === key}
              value={key}
            >
              {VitalsFilterType[key]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
      <Grid>
        <RangeDate handleDate={handleRange} initialEndDate={initialEndDate} initialStartDate={initialStartDate} />
      </Grid>
    </Grid>
  )
}
