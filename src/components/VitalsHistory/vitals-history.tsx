import { VitalsItem } from '@abnk/medical-support/src/history-vitals/domain/vitals-item'
import { Typography } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useLiveQuery } from 'dexie-react-hooks'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'

import { VitalOrderKeys } from '~/enums/vital-order.enum'
import { VitalsChartTab, VitalsChartTabKeys, VitalsTypeFilterKeys } from '~/enums/vital-type.enum'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { Spinner } from '~components/Spinner/spinner'
import { VitalChartPopup } from '~components/VitalChart/vital-chart-popup'
import { VitalsHistoryFilter } from '~components/VitalsHistory/vitals-history-filter'
import { VitalHistoryItem } from '~components/VitalsHistory/vitals-history-item'
import {
  HISTORY_REQUEST_DELAY_SEC,
  HISTORY_START_REQUEST_TIME_OFFSET_SEC,
  HISTORY_START_TIME_OFFSET_SEC,
} from '~constants/constants'
import { historyDbAdapter, historyItemsMapper, vitalsItemMapper } from '~helpers/history-item-adapter'
import { IThresholds } from '~models/threshold.model'
import { IHistoryItemMetadata, IVitalsData, IVitalsHistoryItem } from '~models/vital.model'
import { db } from '~stores/helpers/db'
import { useAppDispatch } from '~stores/hooks'
import { useLazyGetPatientVitalsByDoctorQuery, useLazyGetPatientVitalsQuery } from '~stores/services/vitals.api'
import { useUserId } from '~stores/slices/auth.slice'
import {
  clearVitalHistory,
  setVitalHistoryPatientId,
  setVitalHistoryRequestTime,
  useVitalHistoryPatientId,
  useVitalHistoryRequestTime,
} from '~stores/slices/vital-history.slice'

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
  historySort: VitalOrderKeys
}

export const VitalsHistory: FC<VitalsHistoryProps> = ({ patientUserId, historySort }) => {
  const dispatch = useAppDispatch()

  const vitalsFromDb = useLiveQuery(() => db.vitals.toArray().then((vitals) => vitals.map((vital) => vital.items)))
  const thresholdsFormDb = useLiveQuery(() => db.thresholds.toArray())
  const requestTime = useVitalHistoryRequestTime()
  const userId = useUserId()
  const vitalHistoryPatientId = useVitalHistoryPatientId()

  const [vitalsData, setVitalsData] = useState<VitalsItem[]>([])
  const [thresholds, setThresholds] = useState<IThresholds[]>([])

  useEffect(() => {
    if (vitalsFromDb) {
      setVitalsData([...vitalsItemMapper(vitalsFromDb)])
    }
  }, [vitalsFromDb])

  useEffect(() => {
    if (thresholdsFormDb) {
      setThresholds([...thresholdsFormDb])
    }
  }, [thresholdsFormDb])

  const startDate = useMemo(() => dayjs().startOf('minute').subtract(30, 'days').toISOString(), [])
  const endDate = useMemo(() => dayjs().toISOString(), [])
  const [dateRange, setDateRange] = useState<IDateRange>({
    start: dayjs(startDate).unix(),
    end: dayjs(endDate).unix(),
  })

  const currentPatientId = useMemo(() => patientUserId || userId, [patientUserId, userId])

  const [initialStartDate, setInitialStartDate] = useState<Dayjs>()
  const [initialEndDate, setInitialEndDate] = useState<Dayjs>()
  const [vitalsType, setVitalsType] = useState<VitalsChartTabKeys | null>(null)
  const [vitalChartPopupOpen, setVitalChartPopupOpen] = useState(false)

  const [filterType, setFilterType] = useState<VitalsTypeFilterKeys>('all')
  const [historyIsLoading, setHistoryIsLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isReloading, setIsReloading] = useState(false)
  const [isUninitialized, setIsUninitialized] = useState(false)

  const [lazyPatientVitals, { isUninitialized: myVitalsIsUninitialized }] = useLazyGetPatientVitalsQuery()
  const [lazyPatientVitalsByDoctor, { isUninitialized: patientVitalsIsUninitialized }] =
    useLazyGetPatientVitalsByDoctorQuery()

  const getHistory = useCallback(
    async (refreshHistory?: boolean) => {
      let response: IVitalsData = {
        vitals: [],
        thresholds: [],
        users: [],
      }
      let start = startDate
      const end = endDate

      if (!requestTime || refreshHistory) {
        setIsLoading(true)
      }

      if (requestTime && !refreshHistory) {
        const diff = dayjs(endDate).diff(requestTime, 'seconds')

        if (diff === 0 || diff < HISTORY_REQUEST_DELAY_SEC) return

        setIsReloading(true)

        start = dayjs(requestTime).subtract(HISTORY_START_REQUEST_TIME_OFFSET_SEC, 'seconds').toISOString()
      }

      if (refreshHistory) {
        dispatch(clearVitalHistory())

        await db.transaction('rw', db.tables, async () => {
          await Promise.all(db.tables.map((table) => table.clear()))
        })
      }

      try {
        if (!patientUserId) {
          response = await lazyPatientVitals({
            startDate: start,
            endDate: end,
          }).unwrap()
        } else {
          response = await lazyPatientVitalsByDoctor({
            patientUserId,
            startDate: start,
            endDate: end,
          }).unwrap()
        }

        setVitalsData((prevState) => [...prevState, ...vitalsItemMapper(response.vitals)])
        setThresholds((prevState) => [...prevState, ...response.thresholds])

        db.vitals.bulkPut(historyDbAdapter(response.vitals)).catch((e) => {
          console.error(e)
        })

        db.thresholds.bulkPut(response.thresholds).catch((e) => {
          console.error(e)
        })

        dispatch(setVitalHistoryPatientId(currentPatientId))
        dispatch(setVitalHistoryRequestTime(end))

        setIsLoading(false)
        setIsReloading(false)
      } catch (e) {
        console.error(e)
      }

      return [end]
    },
    [
      dispatch,
      endDate,
      lazyPatientVitals,
      lazyPatientVitalsByDoctor,
      patientUserId,
      requestTime,
      startDate,
      currentPatientId,
    ],
  )

  useEffect(() => {
    if (vitalHistoryPatientId && vitalHistoryPatientId !== currentPatientId) {
      getHistory(true).then()
    } else {
      getHistory().then()
    }
  }, [vitalHistoryPatientId, currentPatientId, getHistory, dispatch])

  useEffect(() => {
    setIsUninitialized(myVitalsIsUninitialized || patientVitalsIsUninitialized)
  }, [myVitalsIsUninitialized, patientVitalsIsUninitialized])

  const abnormalHistory = useMemo(() => {
    if (!vitalsData?.length) return []

    setHistoryIsLoading(true)

    const filteredVitalsByDate = vitalsData.filter(
      ({ endTimestamp }) => endTimestamp >= dateRange.start && endTimestamp <= dateRange.end,
    )

    const abnormalVitals = historyItemsMapper({
      vitals: filteredVitalsByDate,
      vitalType: filterType,
      thresholds: thresholds || [],
    })

    abnormalVitals.sort((a, b) => {
      if (historySort === 'recent') {
        return b.startTimestamp - a.startTimestamp
      }

      return a.startTimestamp - b.startTimestamp
    })

    setHistoryIsLoading(false)

    return abnormalVitals
  }, [vitalsData, filterType, thresholds, dateRange, historySort])

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
    const startTime = dayjs((vital.startTimestamp + HISTORY_START_TIME_OFFSET_SEC) * 1000).format(
      'MMM DD, YYYY hh:mm A',
    )
    const period = (vital.endTimestamp - vital.startTimestamp) * 1000
    const duration = dayjs.duration(period)

    const days = duration.days()
    const daysText = days ? `${days}d ` : ''
    const hours = duration.hours()
    const hoursText = hours ? `${hours}h ` : ''
    const minutes = duration.minutes()
    const minutesText = minutes ? `${minutes} min` : ''

    return `${startTime} (${(daysText + hoursText + minutesText).trim()})`
  }, [])

  const vitalGroup = (vital: IVitalsHistoryItem) => (
    <div className={styles.vitalHistoryGroup}>
      <Typography sx={{ mb: '0.25rem' }} variant="subtitle2">
        {groupTime(vital)}
      </Typography>
      <div className={styles.vitalContainer}>
        {vital.historyVitalsMetadata.map((vitalItem, index) => (
          <VitalHistoryItem
            filterType={filterType}
            key={index}
            onClick={() =>
              handleChartOpenPopup(
                vital.startTimestamp + HISTORY_START_TIME_OFFSET_SEC,
                vital.endTimestamp,
                vitalItem.name,
              )
            }
            threshold={vital.thresholds}
            vital={vitalItem}
          />
        ))}
        <VitalHistoryItem disabled threshold={vital.thresholds} vital={bpMetadata} />
      </div>
    </div>
  )

  if (isLoading || !isUninitialized) {
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
      <div className={`${isReloading || historyIsLoading ? styles.blur : ''}`}>
        {abnormalHistory.length ? (
          <Virtuoso
            className={`${styles.vitalHistoryList}`}
            data={abnormalHistory}
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
          initialVitals={vitalsData}
          open={vitalChartPopupOpen}
          patientUserId={patientUserId}
          vitalsType={vitalsType}
        />
      )}
    </>
  )
}
