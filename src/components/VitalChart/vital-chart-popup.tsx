import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'

import { VitalPeriod, VitalPeriodKeys } from '~/enums/vital-period'
import { VitalChart } from '~components/VitalChart/vital-chart'
import { TIME_PERIOD } from '~constants/constants'
import { getObjectKeys } from '~helpers/get-object-keys'
import { IThresholds } from '~models/threshold.model'
import { IVital, IVitalChart, IVitalsData } from '~models/vital.model'
import { useGetMyVitalsQuery } from '~stores/services/vitals.api'

export const VitalChartPopup = () => {
  const [activeTab, setActiveTab] = useState<VitalPeriodKeys>('oneHour')

  // const [startDate, setStartDate] = useState(
  //   dayjs().subtract(TIME_PERIOD[activeTab].value, TIME_PERIOD[activeTab].unit).toISOString(),
  // )
  // const [endDate, setEndDate] = useState(dayjs().toISOString())
  const [vitalsData, setVitalsData] = useState<IVitalsData>()
  const [filteredVitals, setFilteredVitals] = useState<IVital[]>([])
  const [thresholds, setThresholds] = useState<IThresholds[]>([])

  const startDate = useMemo(
    () => dayjs().subtract(TIME_PERIOD[activeTab].value, TIME_PERIOD[activeTab].unit).toISOString(),
    [activeTab],
  )
  const endDate = useMemo(() => dayjs().toISOString(), [activeTab])

  const { data: myVitalsData, isLoading: myVitalsIsLoading } = useGetMyVitalsQuery({ startDate, endDate })

  const handleChangeTab = (event: React.SyntheticEvent, value: VitalPeriodKeys) => {
    if (value !== null) {
      setActiveTab(value)
    }
  }

  const average = (arr: number[], digits: number = 2) =>
    Number((arr.reduce((acc, number) => acc + number, 0) / arr.length).toFixed(digits))

  const res2: IVitalChart[] = useMemo(
    () =>
      filteredVitals.map((item) => ({
        hr: item.hr,
        rr: item.rr,
        spo2: item.spo2,
        temp: item.temp,
        timestamp: item.timestamp,
        thresholdsId: item.thresholdsId,
      })),
    [filteredVitals],
  )

  const result = useMemo(() => {
    const start = dayjs(startDate).unix()
    const end = dayjs(endDate).unix()
    const interval = (end - start) / 60
    const temporaryArray: IVital[][] = []

    for (let currentInterval = start; currentInterval < end; currentInterval += interval) {
      const filteredByInterval = filteredVitals.filter(
        (vital) => currentInterval <= vital.timestamp && vital.timestamp <= currentInterval + interval,
      )

      if (filteredByInterval.length) {
        temporaryArray.push(filteredByInterval)
      }
    }

    const result: IVitalChart[] = []

    temporaryArray.forEach((periodVitals) => {
      const hrs: number[] = []
      const rrs: number[] = []
      const temps: number[] = []
      const spo2s: number[] = []
      const timestamps: number[] = []

      periodVitals.forEach((vital, index) => {
        hrs.push(vital.hr)
        rrs.push(vital.rr)
        temps.push(vital.temp)
        spo2s.push(vital.spo2)
        timestamps.push(vital.timestamp)
      })

      result.push({
        hr: average(hrs),
        rr: average(rrs),
        temp: average(temps, 2),
        spo2: average(spo2s),
        timestamp: average(timestamps),
        thresholdsId: 'sdsfdf',
      })
    })

    return result
  }, [endDate, filteredVitals, startDate])

  useEffect(() => {
    if (vitalsData) {
      const filteredAndSortedVitals = vitalsData.vitals.filter(
        ({ isHrNormal, isRrNormal, isSpo2Normal, isTempNormal }) =>
          !isHrNormal || !isRrNormal || !isSpo2Normal || !isTempNormal,
      )

      // setFilteredVitals([...filteredAndSortedVitals])
      setFilteredVitals([...vitalsData.vitals])
      setThresholds([...vitalsData.thresholds])
    }
  }, [vitalsData])

  useEffect(() => {
    if (myVitalsData) {
      setVitalsData({ ...myVitalsData })
    }
  }, [myVitalsData])

  return (
    <div>
      <ToggleButtonGroup
        color="primary"
        exclusive
        onChange={handleChangeTab}
        size="small"
        sx={{ mb: 2 }}
        value={activeTab}
      >
        {getObjectKeys(VitalPeriod).map((key) => (
          <ToggleButton key={key} value={key}>
            {VitalPeriod[key]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {filteredVitals && (
        <VitalChart data={result} end={dayjs(endDate).unix()} start={dayjs(startDate).unix()} thresholds={thresholds} />
      )}
    </div>
  )
}
