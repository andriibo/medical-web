import { Typography } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import dayjs, { Dayjs } from 'dayjs'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'

import { VitalsChartTab, VitalsChartTabKeys, VitalType, VitalTypeKeys } from '~/enums/vital-type.enum'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { Spinner } from '~components/Spinner/spinner'
import { VitalChartPopup } from '~components/VitalChart/vital-chart-popup'
import { VitalsHistoryFilter } from '~components/VitalsHistory/vitals-history-filter'
import { VitalHistoryItem } from '~components/VitalsHistory/vitals-history-item'
import { DEFAULT_FILTER_TYPES as defaultFilterTypes } from '~constants/constants'
import { getVitalSettings } from '~helpers/get-vital-settings'
import { IThresholds } from '~models/threshold.model'
import { IVital, IVitalsFilterTypes, IVitalsHistoryCard } from '~models/vital.model'
import { useGetPatientVitalsByDoctorQuery, useGetPatientVitalsQuery } from '~stores/services/vitals.api'

import styles from './vitals-history.module.scss'

interface IDateRange {
  start: number
  end: number
}

interface VitalsHistoryProps {
  patientUserId?: string
}

export const VitalsHistory: FC<VitalsHistoryProps> = ({ patientUserId }) => {
  const startDate = useMemo(() => dayjs().subtract(30, 'days').toISOString(), [])
  const endDate = useMemo(() => dayjs().toISOString(), [])
  const [dateRange, setDateRange] = useState<IDateRange>({
    start: dayjs(startDate).unix(),
    end: dayjs(endDate).unix(),
  })

  const [vitalsData, setVitalsData] = useState<IVital[]>()
  const [filteredVitals, setFilteredVitals] = useState<IVitalsHistoryCard[]>()
  const [preparedVitals, setPreparedVitals] = useState<IVitalsHistoryCard[]>()

  const [thresholds, setThresholds] = useState<IThresholds[]>([])

  const [initialStartDate, setInitialStartDate] = useState<Dayjs>()
  const [initialEndDate, setInitialEndDate] = useState<Dayjs>()
  const [vitalsType, setVitalsType] = useState<VitalsChartTabKeys | null>(null)
  const [vitalChartPopupOpen, setVitalChartPopupOpen] = useState(false)

  const [filteredTypes, setFilteredTypes] = useState<IVitalsFilterTypes>(defaultFilterTypes)
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

  const vitalsList = useCallback(
    (vital: IVital) => {
      const currentThresholds = thresholds.find((item) => item.thresholdsId === vital.thresholdsId)

      const result: IVitalsHistoryCard = {
        timestamp: vital.timestamp,
        isTempNormal: vital.isTempNormal,
        isHrNormal: vital.isHrNormal,
        isSpo2Normal: vital.isSpo2Normal,
        isRrNormal: vital.isRrNormal,
        items: [
          {
            ...getVitalSettings('hr'),
            value: vital.hr,
            isNormal: vital.isHrNormal,
            ...(currentThresholds && {
              threshold: [
                {
                  min: currentThresholds.minHr,
                  max: currentThresholds.maxHr,
                },
              ],
            }),
          },
          {
            ...getVitalSettings('temp'),
            value: vital.temp,
            isNormal: vital.isTempNormal,
            ...(currentThresholds && {
              threshold: [
                {
                  min: currentThresholds.minTemp,
                  max: currentThresholds.maxTemp,
                },
              ],
            }),
          },
          {
            ...getVitalSettings('spo2'),
            value: vital.spo2,
            isNormal: vital.isSpo2Normal,
            ...(currentThresholds && {
              threshold: [
                {
                  min: currentThresholds.minSpo2,
                },
              ],
            }),
          },
          {
            ...getVitalSettings('rr'),
            value: vital.rr,
            isNormal: vital.isRrNormal,
            ...(currentThresholds && {
              threshold: [
                {
                  min: currentThresholds.minRr,
                  max: currentThresholds.maxRr,
                },
              ],
            }),
          },
          {
            ...getVitalSettings('bp'),
            value: 0,
            isNormal: true,
            ...(currentThresholds && {
              threshold: [
                {
                  title: 'DBP',
                  min: currentThresholds.minDbp,
                  max: currentThresholds.maxDbp,
                },
                {
                  title: 'SBP',
                  min: currentThresholds.minSbp,
                  max: currentThresholds.maxSbp,
                },
              ],
            }),
          },
          {
            ...getVitalSettings('fall'),
            value: vital.fall,
          },
        ],
      }

      return result
    },
    [thresholds],
  )

  useEffect(() => {
    if (vitalsData) {
      const abnormalVitals = [...vitalsData].filter(
        ({ isHrNormal, isRrNormal, isSpo2Normal, isTempNormal }) =>
          !isHrNormal || !isRrNormal || !isSpo2Normal || !isTempNormal,
      )

      const preparedVitalsList = abnormalVitals.map((vital) => vitalsList(vital))

      setPreparedVitals(preparedVitalsList)
    }
  }, [vitalsData, vitalsList])

  useEffect(() => {
    if (preparedVitals) {
      setHistoryIsLoading(true)
      const { all, hr, spo2, rr, temp } = filteredTypes

      const dateFilteredVitals = preparedVitals.filter(
        ({ timestamp }) => timestamp >= dateRange.start && timestamp <= dateRange.end,
      )

      if (all) {
        setFilteredVitals(dateFilteredVitals)
        setHistoryIsLoading(false)

        return
      }

      const filtered = dateFilteredVitals.filter(
        ({ isHrNormal, isRrNormal, isSpo2Normal, isTempNormal }) =>
          (hr && !isHrNormal) || (rr && !isRrNormal) || (spo2 && !isSpo2Normal) || (temp && !isTempNormal),
      )

      setFilteredVitals(filtered)
      setHistoryIsLoading(false)
    }
  }, [filteredTypes, preparedVitals, dateRange])

  useEffect(() => {
    setHistoryIsLoading(false)
  }, [filteredVitals])

  const handleOpenPopup = (timestamp: number, type: VitalTypeKeys) => {
    setInitialStartDate(dayjs(timestamp * 1000).subtract(1, 'hour'))
    setInitialEndDate(dayjs(timestamp * 1000).add(1, 'hour'))

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

  const vitalGroup = (vital: IVitalsHistoryCard) => (
    <div className={styles.vitalHistoryGroup}>
      <Typography sx={{ mb: '0.25rem' }} variant="subtitle2">
        {dayjs(vital.timestamp * 1000).format('MMM DD, YYYY hh:mm A')}
      </Typography>
      <div className={styles.vitalContainer}>
        {vital.items.map((vitalItem, index) =>
          vitalItem.title === VitalType.fall || vitalItem.title === VitalType.bp ? (
            <VitalHistoryItem key={index} vital={vitalItem} />
          ) : (
            <VitalHistoryItem
              key={index}
              onClick={() => handleOpenPopup(vital.timestamp, vitalItem.type)}
              tag="button"
              vital={vitalItem}
            />
          ),
        )}
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
        onTypesChange={setFilteredTypes}
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
