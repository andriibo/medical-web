import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { Dayjs } from 'dayjs'
import React, { FC, useEffect, useState } from 'react'

import { VitalsFilterTypes, VitalsTypeFilterKeys } from '~/enums/vital-type.enum'
import { RangeDate } from '~components/RangeDate/range-date'
import { DEFAULT_FILTER_TYPES as defaultFilterTypes } from '~constants/constants'
import { getObjectKeys } from '~helpers/get-object-keys'
import { IVitalsFilterTypes } from '~models/vital.model'

interface VitalsHistoryFilterProps {
  initialStartDate: Dayjs | null
  initialEndDate: Dayjs | null
  onTypesChange: (value: IVitalsFilterTypes) => void
  handleRange: (startDate: Dayjs, endDate: Dayjs) => void
}

export const VitalsHistoryFilter: FC<VitalsHistoryFilterProps> = ({
  initialStartDate,
  initialEndDate,
  onTypesChange,
  handleRange,
}) => {
  const [filteredTypes, setFilteredTypes] = useState<IVitalsFilterTypes>(defaultFilterTypes)

  const handleTypeFilter = (key: VitalsTypeFilterKeys) => {
    if (key === 'all') {
      setFilteredTypes(defaultFilterTypes)

      return
    }

    setFilteredTypes((prevState) => {
      const result: IVitalsFilterTypes = {
        ...prevState,
        [key]: !prevState[key],
        all: false,
      }

      const resultValues = [...Object.values(result)]

      resultValues.shift()

      if (resultValues.every((item) => !item)) return defaultFilterTypes

      if (resultValues.some((item) => !item)) return result

      return defaultFilterTypes
    })
  }

  useEffect(() => {
    onTypesChange(filteredTypes)
  }, [filteredTypes, onTypesChange])

  return (
    <Grid container spacing={3} sx={{ mb: 0 }}>
      <Grid xs>
        <ToggleButtonGroup color="primary" size="small">
          {getObjectKeys(VitalsFilterTypes).map((key) => (
            <ToggleButton
              disabled={key === 'bp'}
              key={key}
              onClick={() => handleTypeFilter(key)}
              selected={filteredTypes[key]}
              value={key}
            >
              {VitalsFilterTypes[key]}
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
