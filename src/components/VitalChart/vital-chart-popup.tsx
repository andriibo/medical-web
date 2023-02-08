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
  const [activePeriod, setActivePeriod] = useState<VitalPeriodKeys>('oneHour')
  const [vitalsData, setVitalsData] = useState<IVitalsData>()
  const [vitals, setVitals] = useState<IVital[]>([])
  const [thresholds, setThresholds] = useState<IThresholds[]>([])

  const startDate = useMemo(
    () => dayjs().subtract(TIME_PERIOD[activePeriod].value, TIME_PERIOD[activePeriod].unit).toISOString(),
    [activePeriod],
  )
  const endDate = useMemo(() => dayjs().toISOString(), [])

  const { data: myVitalsData, isLoading: myVitalsIsLoading } = useGetMyVitalsQuery({ startDate, endDate })

  const handleChangePeriod = (event: React.SyntheticEvent, value: VitalPeriodKeys) => {
    if (value !== null) {
      setActivePeriod(value)
    }
  }

  const average = <T extends number | null>(arr: T[], digits: number = 2) => {
    const nonNullableArr = arr.filter((el) => el !== null) as Array<NonNullable<T>>

    if (!nonNullableArr.length) {
      return null
    }

    return Number((nonNullableArr.reduce((acc, number) => acc + number, 0) / nonNullableArr.length).toFixed(digits))
  }

  const preparedVitals = useMemo(() => {
    const start = dayjs(startDate).unix()
    const end = dayjs(endDate).unix()
    const interval = (end - start) / 60
    const temporaryArray: IVital[][] = []
    const result: IVitalChart = {
      hr: [],
      spo2: [],
      temp: [],
      rr: [],
    }

    for (let currentInterval = start; currentInterval < end; currentInterval += interval) {
      const filteredByInterval = vitals.filter(
        (vital) => currentInterval <= vital.timestamp && vital.timestamp <= currentInterval + interval,
      )

      if (filteredByInterval.length) {
        temporaryArray.push(filteredByInterval)
      }
    }

    temporaryArray.forEach((periodVitals) => {
      const hrs: (number | null)[] = []
      const rrs: (number | null)[] = []
      const temps: (number | null)[] = []
      const spo2s: (number | null)[] = []
      const timestamps: number[] = []

      periodVitals.forEach((vital) => {
        hrs.push(vital.hr)
        rrs.push(vital.rr)
        temps.push(vital.temp)
        spo2s.push(vital.spo2)
        timestamps.push(vital.timestamp)
      })

      const averageHr = average(hrs)
      const averageRr = average(rrs)
      const averageTemp = average(temps)
      const averageSpo2 = average(spo2s)
      const averageTime = average(timestamps)

      if (averageTime !== null) {
        if (averageHr) result.hr.push({ value: averageHr, timestamp: averageTime })

        if (averageRr) result.rr.push({ value: averageRr, timestamp: averageTime })

        if (averageTemp) result.temp.push({ value: averageTemp, timestamp: averageTime })

        if (averageSpo2) result.spo2.push({ value: averageSpo2, timestamp: averageTime })
      }
    })

    return result
  }, [endDate, vitals, startDate])

  const preparedThresholds = useMemo(() => {
    const copyThresholds = [...thresholds.sort((a, b) => a.createdAt - b.createdAt)]

    if (copyThresholds.length > 0) {
      copyThresholds[0] = {
        ...copyThresholds[0],
        createdAt: dayjs(startDate).unix(),
      }

      const cloneOfLastThreshold = { ...copyThresholds[copyThresholds.length - 1] }

      cloneOfLastThreshold.createdAt = dayjs(endDate).unix()

      copyThresholds.push(cloneOfLastThreshold)
    }

    return copyThresholds
  }, [startDate, endDate, thresholds])

  useEffect(() => {
    if (myVitalsData) {
      setVitalsData({ ...myVitalsData })
    }
  }, [myVitalsData])

  useEffect(() => {
    if (vitalsData) {
      setVitals([...vitalsData.vitals])
      setThresholds([...vitalsData.thresholds])
    }
  }, [vitalsData])

  return (
    <div>
      <ToggleButtonGroup
        color="primary"
        exclusive
        onChange={handleChangePeriod}
        size="small"
        sx={{ mb: 2 }}
        value={activePeriod}
      >
        {getObjectKeys(VitalPeriod).map((key) => (
          <ToggleButton key={key} value={key}>
            {VitalPeriod[key]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {vitals && (
        <VitalChart
          activePeriod={activePeriod}
          end={dayjs(endDate).unix()}
          start={dayjs(startDate).unix()}
          thresholds={preparedThresholds}
          vitals={preparedVitals}
        />
      )}
    </div>
  )
}
