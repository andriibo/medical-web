import { Typography } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import dayjs, { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'

import { VitalOrderKeys } from '~/enums/vital-order.enum'
import { VitalsChartTab, VitalsChartTabKeys, VitalsTypeFilterKeys } from '~/enums/vital-type.enum'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { Spinner } from '~components/Spinner/spinner'
import { VitalChartPopup } from '~components/VitalChart/vital-chart-popup'
import { VitalsHistoryFilter } from '~components/VitalsHistory/vitals-history-filter'
import { VitalHistoryItem } from '~components/VitalsHistory/vitals-history-item'
import { historyItemsMapper } from '~helpers/history-item-adapter'
import { IThresholds } from '~models/threshold.model'
import { IHistoryItemMetadata, IVital, IVitalsHistoryItem } from '~models/vital.model'
import { useGetPatientVitalsByDoctorQuery, useGetPatientVitalsQuery } from '~stores/services/vitals.api'

import styles from './vitals-history.module.scss'

dayjs.extend(duration)

const bpMetadata: IHistoryItemMetadata = {
  historyVitalMetadataDto: {
    abnormalMaxValue: 0,
    abnormalMinValue: 0,
    isNormal: true,
    totalMean: 0,
  },
  name: 'bp',
}

interface IDateRange {
  start: number
  end: number
}

interface VitalsHistoryProps {
  patientUserId?: string
  historySort?: VitalOrderKeys
}

export const VitalsHistory: FC<VitalsHistoryProps> = ({ patientUserId, historySort }) => {
  const startDate = useMemo(() => dayjs().subtract(30, 'days').toISOString(), [])
  const endDate = useMemo(() => dayjs().toISOString(), [])
  const [dateRange, setDateRange] = useState<IDateRange>({
    start: dayjs(startDate).unix(),
    end: dayjs(endDate).unix(),
  })

  const [vitalsData, setVitalsData] = useState<IVital[]>()
  const [filteredVitals, setFilteredVitals] = useState<IVitalsHistoryItem[]>()

  const [thresholds, setThresholds] = useState<IThresholds[]>([])

  const [initialStartDate, setInitialStartDate] = useState<Dayjs>()
  const [initialEndDate, setInitialEndDate] = useState<Dayjs>()
  const [vitalsType, setVitalsType] = useState<VitalsChartTabKeys | null>(null)
  const [vitalChartPopupOpen, setVitalChartPopupOpen] = useState(false)

  const [filterType, setFilterType] = useState<VitalsTypeFilterKeys>('all')
  const [historyIsLoading, setHistoryIsLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { data: myVitalsData, isLoading: myVitalsIsLoading } = useGetPatientVitalsQuery(
    patientUserId ? skipToken : { startDate, endDate },
  )
  const { data: patientVitalsData, isLoading: patientVitalsIsLoading } = useGetPatientVitalsByDoctorQuery(
    patientUserId ? { patientUserId, startDate, endDate } : skipToken,
  )

  useEffect(() => {
    if (myVitalsData) {
      setVitalsData([...myVitalsData.vitals])
      setThresholds([...myVitalsData.thresholds])
    }

    if (patientVitalsData) {
      setVitalsData([...patientVitalsData.vitals])
      setThresholds([...patientVitalsData.thresholds])
    }
  }, [myVitalsData, patientVitalsData])

  useEffect(() => {
    setIsLoading(myVitalsIsLoading || patientVitalsIsLoading)
  }, [myVitalsIsLoading, patientVitalsIsLoading])

  const abnormalHistory = useMemo(() => {
    if (!vitalsData?.length) {
      return []
    }

    return historyItemsMapper({ vitals: vitalsData, vitalType: filterType, thresholds })
  }, [vitalsData, filterType, thresholds])

  useEffect(() => {
    if (abnormalHistory) {
      setHistoryIsLoading(true)

      if (historySort) {
        abnormalHistory.sort((a, b) => {
          if (historySort === 'recent') {
            return b.startTimestamp - a.startTimestamp
          }

          return a.startTimestamp - b.startTimestamp
        })
      }

      const dateFilteredVitals = abnormalHistory.filter(
        ({ startTimestamp, endTimestamp }) => startTimestamp >= dateRange.start && endTimestamp <= dateRange.end,
      )

      setFilteredVitals(dateFilteredVitals)
      setHistoryIsLoading(false)
    }
  }, [dateRange, historySort, abnormalHistory])

  useEffect(() => {
    setHistoryIsLoading(false)
  }, [filteredVitals])

  const handleChartOpenPopup = (startTime: number, endTime: number, type: string) => {
    setInitialStartDate(dayjs(startTime * 1000))
    setInitialEndDate(dayjs(endTime * 1000))

    if (type in VitalsChartTab) {
      const typeAsChartTab = type as VitalsChartTabKeys

      setVitalsType(typeAsChartTab)
    }

    setVitalChartPopupOpen(true)
  }

  const handleRange = useCallback((startDate: Dayjs, endDate: Dayjs) => {
    setDateRange({
      start: startDate.unix(),
      end: endDate.unix(),
    })
  }, [])

  const groupTime = useCallback((vital: IVitalsHistoryItem) => {
    const startTime = dayjs(vital.startTimestamp * 1000).format('MMM DD, YYYY hh:mm A')
    const period = (vital.endTimestamp - vital.startTimestamp) * 1000

    const duration = dayjs.duration(period)
    const hours = duration.hours()
    const hoursText = hours ? `${hours}h ` : ''
    const minutes = duration.minutes()
    const minutesText = minutes ? `${minutes} min` : ''

    return `${startTime} (${hoursText}${minutesText})`
  }, [])

  const vitalGroup = (vital: IVitalsHistoryItem) => (
    <div className={styles.vitalHistoryGroup}>
      <Typography sx={{ mb: '0.25rem' }} variant="subtitle2">
        {groupTime(vital)}
      </Typography>
      <div className={styles.vitalContainer}>
        {vital.historyVitalsMetadata.map((vitalItem, index) => (
          <VitalHistoryItem
            key={index}
            onClick={() => handleChartOpenPopup(vital.startTimestamp, vital.endTimestamp, vitalItem.name)}
            threshold={vital.thresholds}
            vital={vitalItem}
          />
        ))}
        <VitalHistoryItem disabled threshold={vital.thresholds} vital={bpMetadata} />
      </div>
    </div>
  )

  if (isLoading || !filteredVitals) {
    return <Spinner />
  }

  return (
    <>
      <VitalsHistoryFilter
        handleRange={handleRange}
        initialEndDate={dayjs(endDate)}
        initialStartDate={dayjs(startDate)}
        onTypesChange={setFilterType}
      />
      <div className={`${historyIsLoading ? styles.blur : ''}`}>
        {filteredVitals?.length ? (
          <Virtuoso
            className={`${styles.vitalHistoryList}`}
            data={filteredVitals}
            itemContent={(index, vital) => vitalGroup(vital)}
            style={{ height: '100vh' }}
          />
        ) : (
          <EmptyBox message="No abnormal vital signs" />
        )}
      </div>
      {initialStartDate && initialEndDate && (
        <VitalChartPopup
          handleClose={() => setVitalChartPopupOpen(false)}
          initialEndDate={initialEndDate}
          initialStartDate={initialStartDate}
          open={vitalChartPopupOpen}
          patientUserId={patientUserId}
          vitalsType={vitalsType}
        />
      )}
    </>
  )
}
