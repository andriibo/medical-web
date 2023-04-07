import { Event } from '@mui/icons-material'
import { TextField } from '@mui/material'
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import React, { FC, useEffect, useState } from 'react'

import styles from '~components/VitalChart/vital-chart.module.scss'

interface RangeDateProps {
  initialStartDate: Dayjs | null
  initialEndDate: Dayjs | null
  handleDate: (startDate: Dayjs, endDate: Dayjs) => void
}

export const RangeDate: FC<RangeDateProps> = ({ initialStartDate, initialEndDate, handleDate }) => {
  const [rangeStartDate, setRangeStartDate] = useState<Dayjs | null>(initialStartDate)
  const [rangeTempStartDate, setRangeTempStartDate] = useState<Dayjs | null>(initialStartDate)
  const [rangeEndDate, setRangeEndDate] = useState<Dayjs | null>(initialEndDate)
  const [rangeTempEndDate, setRangeTempEndDate] = useState<Dayjs | null>(initialEndDate)

  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  useEffect(() => {
    if (rangeStartDate && rangeEndDate) {
      handleDate(rangeStartDate, rangeEndDate)
    }
  }, [rangeStartDate, rangeEndDate, handleDate])

  return (
    <div className={styles.rangeHolder}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDateTimePicker
          inputFormat="MM/DD hh:mm A"
          maxDateTime={dayjs().subtract(1, 'hour')}
          minDateTime={dayjs().startOf('d').subtract(30, 'days')}
          onAccept={(newValue) => {
            setRangeStartDate(newValue)
            if (newValue && rangeTempEndDate && newValue > rangeTempEndDate) {
              setRangeTempEndDate(dayjs(newValue).add(2, 'hours'))
              setEndDateOpen(true)
            }
          }}
          onChange={(newValue) => {
            setRangeTempStartDate(newValue)
          }}
          onClose={() => setStartDateOpen(false)}
          onOpen={() => setStartDateOpen(true)}
          open={startDateOpen}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                shrink: false,
              }}
              InputProps={{
                endAdornment: <Event />,
              }}
              placeholder="From Date"
              variant="standard"
            />
          )}
          toolbarTitle="Select Start Date"
          value={rangeTempStartDate}
        />
      </LocalizationProvider>
      <span className={styles.rangeHolderSeparator}>-</span>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDateTimePicker
          disabled={!rangeStartDate}
          inputFormat="MM/DD hh:mm A"
          maxDate={dayjs()}
          minDateTime={dayjs(rangeStartDate).add(1, 'hour')}
          onAccept={(newValue) => {
            setRangeEndDate(newValue)
          }}
          onChange={(newValue) => {
            setRangeTempEndDate(newValue)
          }}
          onClose={() => setEndDateOpen(false)}
          onOpen={() => setEndDateOpen(true)}
          open={endDateOpen}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                endAdornment: <Event />,
              }}
              placeholder="End Date"
              variant="standard"
            />
          )}
          toolbarTitle="Select End Date"
          value={rangeTempEndDate}
        />
      </LocalizationProvider>
    </div>
  )
}
