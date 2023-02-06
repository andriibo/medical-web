import { Typography } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import dayjs from 'dayjs'
import React, { FC, useCallback, useEffect, useState } from 'react'

import { VitalType } from '~/enums/vital-type.enum'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { Spinner } from '~components/Spinner/spinner'
import { VitalChart } from '~components/VitalChart/vital-chart'
import { VitalChartPopup } from '~components/VitalChart/vital-chart-popup'
import { VitalHistoryItem } from '~components/VitalsHistory/vitals-history-item'
import iconFall from '~images/icon-fall.svg'
import iconHeartRate from '~images/icon-heart-rate.png'
import iconRespiration from '~images/icon-respiration.png'
import iconSaturation from '~images/icon-saturation.png'
import iconTemperature from '~images/icon-temperature.png'
import { IThresholds } from '~models/threshold.model'
import { IVital, IVitalsData, IVitalsHistoryCard } from '~models/vital.model'
import { useGetMyVitalsQuery, useGetPatientVitalsQuery } from '~stores/services/vitals.api'

import styles from './vitals-history.module.scss'

interface VitalsHistoryProps {
  patientUserId?: string
}

export const VitalsHistory: FC<VitalsHistoryProps> = ({ patientUserId }) => {
  const [startDate, setStartDate] = useState(dayjs().subtract(3, 'days').toISOString())
  const [endDate, setEndDate] = useState(dayjs().toISOString())

  const [vitalsData, setVitalsData] = useState<IVitalsData>()
  const [filteredVitals, setFilteredVitals] = useState<IVital[]>([])
  const [thresholds, setThresholds] = useState<IThresholds[]>([])

  const { data: myVitalsData, isLoading: myVitalsIsLoading } = useGetMyVitalsQuery(
    patientUserId ? skipToken : { startDate, endDate },
  )
  const { data: patientVitalsData, isLoading: patientVitalsIsLoading } = useGetPatientVitalsQuery(
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
          title: VitalType.hr,
          value: vital.hr,
          isNormal: vital.isHrNormal,
          thresholds: {
            min: currentThresholds?.minHr,
            max: currentThresholds?.maxHr,
          },
          icon: iconHeartRate,
          units: 'bpm',
        },
        {
          title: VitalType.temp,
          value: vital.temp,
          isNormal: vital.isTempNormal,
          thresholds: {
            min: currentThresholds?.minTemp,
            max: currentThresholds?.maxTemp,
          },
          icon: iconTemperature,
          units: '°C',
        },
        {
          title: VitalType.spo2,
          value: vital.spo2,
          isNormal: vital.isSpo2Normal,
          thresholds: {
            min: currentThresholds?.minSpo2,
          },
          icon: iconSaturation,
          units: '%',
        },
        {
          title: VitalType.rr,
          value: vital.rr,
          isNormal: vital.isRrNormal,
          thresholds: {
            min: currentThresholds?.minRr,
            max: currentThresholds?.maxRr,
          },
          icon: iconRespiration,
          units: 'rpm',
        },
        {
          title: VitalType.fall,
          value: vital.fall,
          icon: iconFall,
          units: '',
        },
      ]
    },
    [thresholds],
  )

  useEffect(() => {
    setStartDate((prevState) => prevState)
    setEndDate((prevState) => prevState)
  }, [])

  if (myVitalsIsLoading || patientVitalsIsLoading) {
    return <Spinner />
  }

  if (!filteredVitals.length || !vitalsData) {
    return <EmptyBox message="No abnormal vital signs" />
  }

  return (
    <>
      <VitalChartPopup />
      {/* {vitalsData && <VitalChart data={filteredVitals} />} */}
      <div className={styles.vitalHistoryList}>
        {filteredVitals.map((vital) => (
          <div className={styles.vitalHistoryGroup} key={vital.timestamp}>
            <Typography sx={{ mb: '0.25rem' }} variant="subtitle2">
              {dayjs(vital.timestamp * 1000).format('MMM DD, YYYY hh:mm A')}
            </Typography>
            <div className={styles.vitalContainer}>
              {vitalsList(vital).map((item, index) => (
                <VitalHistoryItem key={index} vital={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
