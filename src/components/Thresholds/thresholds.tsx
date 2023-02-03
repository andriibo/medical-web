import React, { FC, useMemo, useState } from 'react'

import { VitalType } from '~/enums/vital-type.enum'
import { useThresholds } from '~/hooks/use-thresholds'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { EditPatientBloodPressurePopup } from '~components/Modal/ThresholdPopups/edit-patient-blood-pressure-popup'
import { EditPatientHeartRatePopup } from '~components/Modal/ThresholdPopups/edit-patient-heart-rate-popup'
import { EditPatientRespirationRatePopup } from '~components/Modal/ThresholdPopups/edit-patient-respiration-rate-popup'
import { EditPatientSaturationPopup } from '~components/Modal/ThresholdPopups/edit-patient-saturation-popup'
import { EditPatientTemperaturePopup } from '~components/Modal/ThresholdPopups/edit-patient-temperature-popup'
import { Spinner } from '~components/Spinner/spinner'
import { ThresholdItem } from '~components/Thresholds/threshold-item'
import iconBloodPressure from '~images/icon-blood-pressure.png'
import iconHeartRate from '~images/icon-heart-rate.png'
import iconRespiration from '~images/icon-respiration.png'
import iconSaturation from '~images/icon-saturation.png'
import iconTemperature from '~images/icon-temperature.png'
import { IThresholdList } from '~models/threshold.model'

import styles from './thresholds.module.scss'

interface ThresholdsProps {
  patientUserId?: string
}

export const Thresholds: FC<ThresholdsProps> = ({ patientUserId }) => {
  const [heartRatePopupOpen, setHeartRatePopupOpen] = useState(false)
  const [temperaturePopupOpen, setTemperaturePopupOpen] = useState(false)
  const [saturationPopupOpen, setSaturationPopupOpen] = useState(false)
  const [respirationRatePopupOpen, setRespirationRatePopupOpen] = useState(false)
  const [bloodPressurePopupOpen, setBloodPressurePopupOpen] = useState(false)

  const { thresholds, isLoading } = useThresholds({ patientUserId })

  const thresholdsList: IThresholdList[] | undefined = useMemo(() => {
    if (thresholds) {
      return [
        {
          title: VitalType.hr,
          icon: iconHeartRate,
          values: {
            min: thresholds.minHr,
            max: thresholds.maxHr,
          },
          setBy: thresholds.hrSetBy,
          units: 'bpm',
          onClick: () => setHeartRatePopupOpen(true),
        },
        {
          title: VitalType.temp,
          icon: iconTemperature,
          values: {
            min: thresholds.minTemp,
            max: thresholds.maxTemp,
          },
          setBy: thresholds.tempSetBy,
          units: '°C',
          onClick: () => setTemperaturePopupOpen(true),
        },
        {
          title: VitalType.bp,
          icon: iconBloodPressure,
          className: 'vitalItemBlood',
          values: [
            {
              title: 'DPB',
              min: thresholds.minDbp,
              max: thresholds.maxDbp,
            },
            {
              title: 'SPB',
              min: thresholds.minSbp,
              max: thresholds.maxSbp,
            },
          ],
          setBy: thresholds.spo2SetBy,
          units: 'mmHg',
          onClick: () => setBloodPressurePopupOpen(true),
        },
        {
          title: VitalType.spo2,
          icon: iconSaturation,
          values: {
            min: thresholds.minSpo2,
          },
          setBy: thresholds.spo2SetBy,
          units: '%',
          onClick: () => setSaturationPopupOpen(true),
        },
        {
          title: VitalType.rr,
          icon: iconRespiration,
          values: {
            min: thresholds.minRr,
            max: thresholds.maxRr,
          },
          setBy: thresholds.rrSetBy,
          units: 'rpm',
          onClick: () => setRespirationRatePopupOpen(true),
        },
      ]
    }
  }, [thresholds])

  if (isLoading) {
    return <Spinner />
  }

  if (!thresholds || !thresholdsList) {
    return <EmptyBox />
  }

  return (
    <>
      <div className={styles.vitalContainer}>
        {thresholdsList.map((threshold, index) => (
          <ThresholdItem key={index} patientUserId={patientUserId} threshold={threshold} />
        ))}
      </div>
      {patientUserId && (
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
