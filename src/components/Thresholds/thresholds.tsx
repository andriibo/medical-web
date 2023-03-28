import { Alert } from '@mui/material'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { VitalType } from '~/enums/vital-type.enum'
import { useThresholds } from '~/hooks/use-thresholds'
import { useValidationRules } from '~/hooks/use-validation-rules'
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
  const { threshold, users, isLoading } = useThresholds({ patientUserId })

  const [heartRatePopupOpen, setHeartRatePopupOpen] = useState(false)
  const [temperaturePopupOpen, setTemperaturePopupOpen] = useState(false)
  const [saturationPopupOpen, setSaturationPopupOpen] = useState(false)
  const [respirationRatePopupOpen, setRespirationRatePopupOpen] = useState(false)
  const [bloodPressurePopupOpen, setBloodPressurePopupOpen] = useState(false)

  const validationRulesData = useValidationRules({ getAbsoluteVitals: true })

  const getSetByUser = useCallback((id: string | null) => users?.find((user) => user.userId === id) || null, [users])

  const thresholdsList: IThresholdList[] | undefined = useMemo(() => {
    if (threshold) {
      return [
        {
          title: VitalType.hr,
          icon: iconHeartRate,
          values: {
            min: threshold.minHr,
            max: threshold.maxHr,
          },
          setBy: getSetByUser(threshold.hrSetBy),
          units: 'bpm',
          onClick: () => setHeartRatePopupOpen(true),
        },
        {
          title: VitalType.temp,
          icon: iconTemperature,
          values: {
            min: threshold.minTemp,
            max: threshold.maxTemp,
          },
          setBy: getSetByUser(threshold.tempSetBy),
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
              min: threshold.minDbp,
              max: threshold.maxDbp,
            },
            {
              title: 'SPB',
              min: threshold.minSbp,
              max: threshold.maxSbp,
            },
          ],
          setBy: getSetByUser(threshold.spo2SetBy),
          units: 'mmHg',
          onClick: () => setBloodPressurePopupOpen(true),
        },
        {
          title: VitalType.spo2,
          icon: iconSaturation,
          values: {
            min: threshold.minSpo2,
          },
          setBy: getSetByUser(threshold.spo2SetBy),
          units: '%',
          onClick: () => setSaturationPopupOpen(true),
        },
        {
          title: VitalType.rr,
          icon: iconRespiration,
          values: {
            min: threshold.minRr,
            max: threshold.maxRr,
          },
          setBy: getSetByUser(threshold.rrSetBy),
          units: 'rpm',
          onClick: () => setRespirationRatePopupOpen(true),
        },
      ]
    }
  }, [getSetByUser, threshold])

  if (isLoading) {
    return <Spinner />
  }

  if (!threshold || !thresholdsList) {
    return <EmptyBox />
  }

  return (
    <>
      {patientUserId && threshold.isPending && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          The latest threshold changes will be applied when the patient establishes internet connection to the server
        </Alert>
      )}
      <div className={`${styles.vitalContainer} ${patientUserId ? styles.vitalContainerAlt : ''}`}>
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
              min: threshold.minHr,
              max: threshold.maxHr,
            }}
            validationRulesData={validationRulesData}
          />
          <EditPatientTemperaturePopup
            handleClose={() => setTemperaturePopupOpen(false)}
            open={temperaturePopupOpen}
            patientUserId={patientUserId}
            thresholds={{
              min: threshold.minTemp,
              max: threshold.maxTemp,
            }}
            validationRulesData={validationRulesData}
          />
          <EditPatientSaturationPopup
            handleClose={() => setSaturationPopupOpen(false)}
            open={saturationPopupOpen}
            patientUserId={patientUserId}
            thresholds={{
              min: threshold.minSpo2,
            }}
            validationRulesData={validationRulesData}
          />
          <EditPatientRespirationRatePopup
            handleClose={() => setRespirationRatePopupOpen(false)}
            open={respirationRatePopupOpen}
            patientUserId={patientUserId}
            thresholds={{
              min: threshold.minRr,
              max: threshold.maxRr,
            }}
            validationRulesData={validationRulesData}
          />
          <EditPatientBloodPressurePopup
            handleClose={() => setBloodPressurePopupOpen(false)}
            open={bloodPressurePopupOpen}
            patientUserId={patientUserId}
            thresholds={{
              minSBP: threshold.minSbp,
              maxSBP: threshold.maxSbp,
              minDBP: threshold.minDbp,
              maxDBP: threshold.maxDbp,
            }}
            validationRulesData={validationRulesData}
          />
        </>
      )}
    </>
  )
}
