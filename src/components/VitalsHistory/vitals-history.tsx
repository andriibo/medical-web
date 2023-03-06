import { Typography } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import dayjs, { Dayjs } from 'dayjs'
import React, { FC, useCallback, useEffect, useState } from 'react'

import { VitalsChartTab, VitalsChartTabKeys, VitalType, VitalTypeKeys } from '~/enums/vital-type.enum'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { Spinner } from '~components/Spinner/spinner'
import { VitalChartPopup } from '~components/VitalChart/vital-chart-popup'
import { VitalHistoryItem } from '~components/VitalsHistory/vitals-history-item'
import { getVitalSettings } from '~helpers/get-vital-settings'
import { IThresholds } from '~models/threshold.model'
import { IVital, IVitalsData, IVitalsHistoryCard } from '~models/vital.model'
import { useGetPatientVitalsByDoctorQuery, useGetPatientVitalsQueryQuery } from '~stores/services/vitals.api'

import styles from './vitals-history.module.scss'

interface VitalsHistoryProps {
  patientUserId?: string
}

export const VitalsHistory: FC<VitalsHistoryProps> = ({ patientUserId }) => {
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'days').toISOString())
  const [endDate, setEndDate] = useState(dayjs().toISOString())

  const [vitalsData, setVitalsData] = useState<IVitalsData>()
  const [isLoading, setIsLoading] = useState(false)
  const [filteredVitals, setFilteredVitals] = useState<IVital[]>([])
  const [thresholds, setThresholds] = useState<IThresholds[]>([])

  const [initialStartDate, setInitialStartDate] = useState<Dayjs>()
  const [initialEndDate, setInitialEndDate] = useState<Dayjs>()
  const [vitalsType, setVitalsType] = useState<VitalsChartTabKeys | null>(null)
  const [vitalChartPopupOpen, setVitalChartPopupOpen] = useState(false)

  const { data: myVitalsData, isLoading: myVitalsIsLoading } = useGetPatientVitalsQueryQuery(
    patientUserId ? skipToken : { startDate, endDate },
  )
  const { data: patientVitalsData, isLoading: patientVitalsIsLoading } = useGetPatientVitalsByDoctorQuery(
    patientUserId ? { patientUserId, startDate, endDate } : skipToken,
  )

  useEffect(() => {
    if (myVitalsData) {
      setVitalsData({ ...myVitalsData })
    }

    if (patientVitalsData) {
      setVitalsData({ ...patientVitalsData })
    }
  }, [myVitalsData, patientVitalsData])

  useEffect(() => {
    setIsLoading(myVitalsIsLoading || patientVitalsIsLoading)
  }, [myVitalsIsLoading, patientVitalsIsLoading])

  useEffect(() => {
    if (vitalsData) {
      const filteredAndSortedVitals = vitalsData.vitals
        .filter(
          ({ isHrNormal, isRrNormal, isSpo2Normal, isTempNormal }) =>
            !isHrNormal || !isRrNormal || !isSpo2Normal || !isTempNormal,
        )
        .sort((a, b) => b.timestamp - a.timestamp)

      setFilteredVitals([...filteredAndSortedVitals])
      setThresholds([...vitalsData.thresholds])
    }
  }, [vitalsData])

  const vitalsList = useCallback(
    (vital: IVital): IVitalsHistoryCard[] => {
      const currentThresholds = thresholds.find((item) => item.thresholdsId === vital.thresholdsId)

      return [
        {
          ...getVitalSettings('hr'),
          value: vital.hr,
          isNormal: vital.isHrNormal,
          threshold: {
            min: currentThresholds?.minHr,
            max: currentThresholds?.maxHr,
          },
        },
        {
          ...getVitalSettings('temp'),
          value: vital.temp,
          isNormal: vital.isTempNormal,
          threshold: {
            min: currentThresholds?.minTemp,
            max: currentThresholds?.maxTemp,
          },
        },
        {
          ...getVitalSettings('spo2'),
          value: vital.spo2,
          isNormal: vital.isSpo2Normal,
          threshold: {
            min: currentThresholds?.minSpo2,
          },
        },
        {
          ...getVitalSettings('rr'),
          value: vital.rr,
          isNormal: vital.isRrNormal,
          threshold: {
            min: currentThresholds?.minRr,
            max: currentThresholds?.maxRr,
          },
        },
        {
          ...getVitalSettings('fall'),
          value: vital.fall,
        },
      ]
    },
    [thresholds],
  )

  useEffect(() => {
    setStartDate((prevState) => prevState)
    setEndDate((prevState) => prevState)
  }, [])

  const handleOpenPopup = (timestamp: number, type: VitalTypeKeys) => {
    setInitialStartDate(dayjs(timestamp * 1000).subtract(1, 'hour'))
    setInitialEndDate(dayjs(timestamp * 1000).add(1, 'hour'))

    if (type in VitalsChartTab) {
      const typeAsChartTab = type as VitalsChartTabKeys

      setVitalsType(typeAsChartTab)
    }

    setVitalChartPopupOpen(true)
  }

  if (isLoading) {
    return <Spinner />
  }

  if (!filteredVitals.length || !vitalsData) {
    return <EmptyBox message="No abnormal vital signs" />
  }

  return (
    <>
      <div className={styles.vitalHistoryList}>
        {filteredVitals.map((vital) => (
          <div className={styles.vitalHistoryGroup} key={vital.timestamp}>
            <Typography sx={{ mb: '0.25rem' }} variant="subtitle2">
              {dayjs(vital.timestamp * 1000).format('MMM DD, YYYY hh:mm A')}
            </Typography>
            <div className={styles.vitalContainer}>
              {vitalsList(vital).map((item, index) =>
                item.title === VitalType.fall ? (
                  <VitalHistoryItem key={index} vital={item} />
                ) : (
                  <VitalHistoryItem
                    key={index}
                    onClick={() => handleOpenPopup(vital.timestamp, item.type)}
                    tag="button"
                    vital={item}
                  />
                ),
              )}
            </div>
          </div>
        ))}
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
