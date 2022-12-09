import { Typography } from '@mui/material'
import React, { FC, useEffect, useLayoutEffect, useState } from 'react'

import { EmptyBox } from '~components/EmptyBox/empty-box'
import { Spinner } from '~components/Spinner/spinner'
import iconBloodPressure from '~images/icon-blood-pressure.png'
import iconHeartRate from '~images/icon-heart-rate.png'
import iconRespiration from '~images/icon-respiration.png'
import iconSaturation from '~images/icon-saturation.png'
import iconTemperature from '~images/icon-temperature.png'
import { IThresholdModel, ThresholdsObj } from '~models/threshold.model'
import {
  useLazyGetMyVitalThresholdsQuery,
  useLazyGetPatientVirtualThresholdsQuery,
} from '~stores/services/patient-vital-threshold.api'

import styles from './thresholds.module.scss'

interface ThresholdsProps {
  patientUserId?: string
}

export const Thresholds: FC<ThresholdsProps> = ({ patientUserId }) => {
  const [thresholds, setThresholds] = useState<ThresholdsObj>()
  const [isLoading, setIsLoading] = useState(false)

  const [lazyMyThresholds, { data: myThresholds, isFetching: myThresholdsIsFetching }] =
    useLazyGetMyVitalThresholdsQuery()
  const [lazyPatientThresholds, { data: patientThresholds, isFetching: patientThresholdsIsFetching }] =
    useLazyGetPatientVirtualThresholdsQuery()

  const convertThresholdsToObj = (thresholds: IThresholdModel[]) => {
    const thresholdsObj: ThresholdsObj = {}

    thresholds.map((item) => {
      thresholdsObj[item.thresholdName] = item
    })

    return thresholdsObj
  }

  useLayoutEffect(() => {
    if (patientUserId) {
      lazyPatientThresholds({ patientUserId })

      return
    }

    lazyMyThresholds()
  }, [lazyMyThresholds, lazyPatientThresholds, patientUserId])

  useEffect(() => {
    if (patientThresholds) {
      setThresholds(convertThresholdsToObj([...patientThresholds]))

      return
    }

    if (myThresholds) {
      setThresholds(convertThresholdsToObj([...myThresholds]))
    }
  }, [myThresholds, patientThresholds])

  useEffect(() => {
    if (myThresholdsIsFetching || patientThresholdsIsFetching) {
      setIsLoading(true)

      return
    }

    setIsLoading(false)
  }, [myThresholdsIsFetching, patientThresholdsIsFetching])

  if (isLoading) {
    return <Spinner />
  }

  if (!thresholds) {
    return <EmptyBox />
  }

  return (
    <div className={styles.thresholdContainer}>
      <div className={styles.thresholdItem}>
        <div className={styles.thresholdHeader}>
          <div className={styles.thresholdIcon}>
            <img alt="Heart Rate" src={iconHeartRate} />
          </div>
          <div className={styles.thresholdText}>
            <Typography variant="body1">Heart Rate</Typography>
            <Typography variant="body2">default</Typography>
          </div>
        </div>
        <ul className={styles.thresholdInfo}>
          <li>
            <span className={styles.thresholdInfoLabel}>Min</span>
            <span className={styles.thresholdInfoValue}>{thresholds.MinHR?.value}</span>
          </li>
          <li>
            <span className={styles.thresholdInfoLabel}>Max</span>
            <span className={styles.thresholdInfoValue}>{thresholds.MaxHR?.value}</span>
          </li>
          <li className={styles.thresholdInfoMeasure}>bmp</li>
        </ul>
      </div>
      <div className={styles.thresholdItem}>
        <div className={styles.thresholdHeader}>
          <div className={styles.thresholdIcon}>
            <img alt="Temperature" src={iconTemperature} />
          </div>
          <div className={styles.thresholdText}>
            <Typography variant="body1">Temperature</Typography>
            <Typography variant="body2">default</Typography>
          </div>
        </div>
        <ul className={styles.thresholdInfo}>
          <li>
            <span className={styles.thresholdInfoLabel}>Min</span>
            <span className={styles.thresholdInfoValue}>{thresholds.MinTemp?.value}</span>
          </li>
          <li>
            <span className={styles.thresholdInfoLabel}>Max</span>
            <span className={styles.thresholdInfoValue}>{thresholds.MaxTemp?.value}</span>
          </li>
          <li className={styles.thresholdInfoMeasure}>°C</li>
        </ul>
      </div>
      <div className={`${styles.thresholdItem} ${styles.thresholdItemBlood}`}>
        <div className={styles.thresholdHeader}>
          <div className={styles.thresholdIcon}>
            <img alt="Blood Pressure" src={iconBloodPressure} />
          </div>
          <div className={styles.thresholdText}>
            <Typography variant="body1">Blood Pressure</Typography>
            <Typography variant="body2">default</Typography>
          </div>
        </div>
        <div className={styles.thresholdInfoGroup}>
          <ul className={styles.thresholdInfo}>
            <li>DPB:</li>
            <li>
              <span className={styles.thresholdInfoLabel}>Min</span>
              <span className={styles.thresholdInfoValue}>{thresholds.MinDBP?.value}</span>
            </li>
            <li>
              <span className={styles.thresholdInfoLabel}>Max</span>
              <span className={styles.thresholdInfoValue}>{thresholds.MaxDBP?.value}</span>
            </li>
            <li className={styles.thresholdInfoMeasure}>mmHg</li>
          </ul>
          <ul className={styles.thresholdInfo}>
            <li>SBP:</li>
            <li>
              <span className={styles.thresholdInfoLabel}>Min</span>
              <span className={styles.thresholdInfoValue}>{thresholds.MinSBP?.value}</span>
            </li>
            <li>
              <span className={styles.thresholdInfoLabel}>Max</span>
              <span className={styles.thresholdInfoValue}>{thresholds.MaxSBP?.value}</span>
            </li>
            <li className={styles.thresholdInfoMeasure}>mmHg</li>
          </ul>
        </div>
      </div>
      <div className={styles.thresholdItem}>
        <div className={styles.thresholdHeader}>
          <div className={styles.thresholdIcon}>
            <img alt="O2 Saturation" src={iconSaturation} />
          </div>
          <div className={styles.thresholdText}>
            <Typography variant="body1">O2 Saturation</Typography>
            <Typography variant="body2">default</Typography>
          </div>
        </div>
        <ul className={styles.thresholdInfo}>
          <li>
            <span className={styles.thresholdInfoLabel}>Min</span>
            <span className={styles.thresholdInfoValue}>{thresholds.MinSpO2?.value}</span>
          </li>
          <li className={styles.thresholdInfoMeasure}>%</li>
        </ul>
      </div>
      <div className={styles.thresholdItem}>
        <div className={styles.thresholdHeader}>
          <div className={styles.thresholdIcon}>
            <img alt="Respiration Rate" src={iconRespiration} />
          </div>
          <div className={styles.thresholdText}>
            <Typography variant="body1">Respiration Rate</Typography>
            <Typography variant="body2">default</Typography>
          </div>
        </div>
        <ul className={styles.thresholdInfo}>
          <li>
            <span className={styles.thresholdInfoLabel}>Min</span>
            <span className={styles.thresholdInfoValue}>{thresholds.MinRR?.value}</span>
          </li>
          <li>
            <span className={styles.thresholdInfoLabel}>Max</span>
            <span className={styles.thresholdInfoValue}>{thresholds.MaxRR?.value}</span>
          </li>
          <li className={styles.thresholdInfoMeasure}>rpm</li>
        </ul>
      </div>
    </div>
  )
}
