import { Edit } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import React, { FC, useEffect, useState } from 'react'

import { EmptyBox } from '~components/EmptyBox/empty-box'
import { EditPatientBloodPressurePopup } from '~components/Modal/ThresholdPopups/edit-patient-blood-pressure-popup'
import { EditPatientHeartRatePopup } from '~components/Modal/ThresholdPopups/edit-patient-heart-rate-popup'
import { EditPatientRespirationRatePopup } from '~components/Modal/ThresholdPopups/edit-patient-respiration-rate-popup'
import { EditPatientSaturationPopup } from '~components/Modal/ThresholdPopups/edit-patient-saturation-popup'
import { EditPatientTemperaturePopup } from '~components/Modal/ThresholdPopups/edit-patient-temperature-popup'
import { Spinner } from '~components/Spinner/spinner'
import iconBloodPressure from '~images/icon-blood-pressure.png'
import iconHeartRate from '~images/icon-heart-rate.png'
import iconRespiration from '~images/icon-respiration.png'
import iconSaturation from '~images/icon-saturation.png'
import iconTemperature from '~images/icon-temperature.png'
import { IThresholds } from '~models/threshold.model'
import { IUserModel } from '~models/user.model'
import {
  useGetMyVitalThresholdsQuery,
  useGetPatientVirtualThresholdsQuery,
} from '~stores/services/patient-vital-threshold.api'

import styles from './thresholds.module.scss'

interface ThresholdsProps {
  patientUserId?: string
}

export const Thresholds: FC<ThresholdsProps> = ({ patientUserId }) => {
  const [thresholds, setThresholds] = useState<IThresholds>()
  const [isLoading, setIsLoading] = useState(false)
  const [heartRatePopupOpen, setHeartRatePopupOpen] = useState(false)
  const [temperaturePopupOpen, setTemperaturePopupOpen] = useState(false)
  const [saturationPopupOpen, setSaturationPopupOpen] = useState(false)
  const [respirationRatePopupOpen, setRespirationRatePopupOpen] = useState(false)
  const [bloodPressurePopupOpen, setBloodPressurePopupOpen] = useState(false)

  const { data: myThresholds, isLoading: myThresholdsIsLoading } = useGetMyVitalThresholdsQuery(
    patientUserId ? skipToken : undefined,
  )

  const { data: patientThresholds, isLoading: patientThresholdsIsLoading } = useGetPatientVirtualThresholdsQuery(
    patientUserId ? { patientUserId } : skipToken,
  )

  useEffect(() => {
    if (patientThresholds && !patientThresholdsIsLoading) {
      setThresholds({ ...patientThresholds })

      return
    }

    if (myThresholds && !myThresholdsIsLoading) {
      setThresholds({ ...myThresholds })
    }
  }, [myThresholds, myThresholdsIsLoading, patientThresholds, patientThresholdsIsLoading])

  useEffect(() => {
    if (myThresholdsIsLoading || patientThresholdsIsLoading) {
      setIsLoading(true)

      return
    }

    setIsLoading(false)
  }, [myThresholdsIsLoading, patientThresholdsIsLoading])

  const getSetByName = (setByUser: IUserModel | null) => {
    if (setByUser) {
      return `updated by ${setByUser.firstName} ${setByUser.lastName}`
    }

    return 'default'
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : !thresholds ? (
        <EmptyBox />
      ) : (
        <div className={styles.thresholdContainer}>
          <div className={styles.thresholdItem}>
            <div className={styles.thresholdHeader}>
              <div className={styles.thresholdIcon}>
                <img alt="Heart Rate" src={iconHeartRate} />
              </div>
              <div className={styles.thresholdText}>
                <Typography variant="body1">Heart Rate</Typography>
                <Typography variant="body2">{getSetByName(thresholds.hrSetBy)}</Typography>
              </div>
              {patientUserId && (
                <div className={styles.thresholdActions}>
                  <IconButton edge="end" onClick={() => setHeartRatePopupOpen(true)}>
                    <Edit />
                  </IconButton>
                </div>
              )}
            </div>
            <ul className={styles.thresholdInfo}>
              <li>
                <span className={styles.thresholdInfoLabel}>Min</span>
                <span className={styles.thresholdInfoValue}>{thresholds.minHr}</span>
              </li>
              <li>
                <span className={styles.thresholdInfoLabel}>Max</span>
                <span className={styles.thresholdInfoValue}>{thresholds.maxHr}</span>
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
                <Typography variant="body2">{getSetByName(thresholds.tempSetBy)}</Typography>
              </div>
              {patientUserId && (
                <div className={styles.thresholdActions}>
                  <IconButton edge="end" onClick={() => setTemperaturePopupOpen(true)}>
                    <Edit />
                  </IconButton>
                </div>
              )}
            </div>
            <ul className={styles.thresholdInfo}>
              <li>
                <span className={styles.thresholdInfoLabel}>Min</span>
                <span className={styles.thresholdInfoValue}>{thresholds.minTemp}</span>
              </li>
              <li>
                <span className={styles.thresholdInfoLabel}>Max</span>
                <span className={styles.thresholdInfoValue}>{thresholds.maxTemp}</span>
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
                <Typography variant="body2">{getSetByName(thresholds.dbpSetBy)}</Typography>
              </div>
              {patientUserId && (
                <div className={styles.thresholdActions}>
                  <IconButton edge="end" onClick={() => setBloodPressurePopupOpen(true)}>
                    <Edit />
                  </IconButton>
                </div>
              )}
            </div>
            <div className={styles.thresholdInfoGroup}>
              <ul className={styles.thresholdInfo}>
                <li>DPB:</li>
                <li>
                  <span className={styles.thresholdInfoLabel}>Min</span>
                  <span className={styles.thresholdInfoValue}>{thresholds.minDbp}</span>
                </li>
                <li>
                  <span className={styles.thresholdInfoLabel}>Max</span>
                  <span className={styles.thresholdInfoValue}>{thresholds.maxDbp}</span>
                </li>
                <li className={styles.thresholdInfoMeasure}>mmHg</li>
              </ul>
              <ul className={styles.thresholdInfo}>
                <li>SBP:</li>
                <li>
                  <span className={styles.thresholdInfoLabel}>Min</span>
                  <span className={styles.thresholdInfoValue}>{thresholds.minSbp}</span>
                </li>
                <li>
                  <span className={styles.thresholdInfoLabel}>Max</span>
                  <span className={styles.thresholdInfoValue}>{thresholds.maxSbp}</span>
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
                <Typography variant="body2">{getSetByName(thresholds.spo2SetBy)}</Typography>
              </div>
              {patientUserId && (
                <div className={styles.thresholdActions}>
                  <IconButton edge="end" onClick={() => setSaturationPopupOpen(true)}>
                    <Edit />
                  </IconButton>
                </div>
              )}
            </div>
            <ul className={styles.thresholdInfo}>
              <li>
                <span className={styles.thresholdInfoLabel}>Min</span>
                <span className={styles.thresholdInfoValue}>{thresholds.minSpo2}</span>
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
                <Typography variant="body2">{getSetByName(thresholds.rrSetBy)}</Typography>
              </div>
              {patientUserId && (
                <div className={styles.thresholdActions}>
                  <IconButton edge="end" onClick={() => setRespirationRatePopupOpen(true)}>
                    <Edit />
                  </IconButton>
                </div>
              )}
            </div>
            <ul className={styles.thresholdInfo}>
              <li>
                <span className={styles.thresholdInfoLabel}>Min</span>
                <span className={styles.thresholdInfoValue}>{thresholds.minRr}</span>
              </li>
              <li>
                <span className={styles.thresholdInfoLabel}>Max</span>
                <span className={styles.thresholdInfoValue}>{thresholds.maxRr}</span>
              </li>
              <li className={styles.thresholdInfoMeasure}>rpm</li>
            </ul>
          </div>
        </div>
      )}
      {patientUserId && thresholds && (
        <>
          <EditPatientHeartRatePopup
            handleClose={() => setHeartRatePopupOpen(false)}
            open={heartRatePopupOpen}
            patientUserId={patientUserId}
            thresholds={{
              min: thresholds.minHr,
              max: thresholds.maxHr,
            }}
          />
          <EditPatientTemperaturePopup
            handleClose={() => setTemperaturePopupOpen(false)}
            open={temperaturePopupOpen}
            patientUserId={patientUserId}
            thresholds={{
              min: thresholds.minTemp,
              max: thresholds.maxTemp,
            }}
          />
          <EditPatientSaturationPopup
            handleClose={() => setSaturationPopupOpen(false)}
            open={saturationPopupOpen}
            patientUserId={patientUserId}
            thresholds={{
              min: thresholds.minSpo2,
            }}
          />
          <EditPatientRespirationRatePopup
            handleClose={() => setRespirationRatePopupOpen(false)}
            open={respirationRatePopupOpen}
            patientUserId={patientUserId}
            thresholds={{
              min: thresholds.minRr,
              max: thresholds.maxRr,
            }}
          />
          <EditPatientBloodPressurePopup
            handleClose={() => setBloodPressurePopupOpen(false)}
            open={bloodPressurePopupOpen}
            patientUserId={patientUserId}
            thresholds={{
              minSBP: thresholds.minSbp,
              maxSBP: thresholds.maxSbp,
              minDBP: thresholds.minDbp,
              maxDBP: thresholds.maxDbp,
            }}
          />
        </>
      )}
    </>
  )
}
