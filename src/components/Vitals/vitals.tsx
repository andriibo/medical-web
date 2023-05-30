import { Alert, AlertTitle, Box, CircularProgress, Typography } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import React, { FC, useEffect, useMemo, useState } from 'react'

import { VitalsChartTab, VitalsChartTabKeys, VitalType, VitalTypeKeys } from '~/enums/vital-type.enum'
import { useThresholds } from '~/hooks/use-thresholds'
import styles from '~components/Thresholds/thresholds.module.scss'
import { VitalChartPopup } from '~components/VitalChart/vital-chart-popup'
import { VitalItem } from '~components/Vitals/vital-item'
import { getVitalSettings } from '~helpers/get-vital-settings'
import { ISocketVitals, IVitalsCard } from '~models/vital.model'
import { useGetVitalsAbsoluteQuery } from '~stores/services/vitals.api'

interface VitalsProps {
  isLoading: boolean
  isUpdatingEnd: boolean
  lastUpdate: string
  vitals: ISocketVitals
  patientUserId?: string
}

export const Vitals: FC<VitalsProps> = ({ patientUserId, isLoading, isUpdatingEnd, lastUpdate, vitals }) => {
  const [toggleVitals, setToggleVitals] = useState(false)

  const [initialStartDate, setInitialStartDate] = useState<Dayjs>()
  const [initialEndDate, setInitialEndDate] = useState<Dayjs>()
  const [vitalsType, setVitalsType] = useState<VitalsChartTabKeys | null>(null)
  const [vitalChartPopupOpen, setVitalChartPopupOpen] = useState(false)

  const { threshold } = useThresholds({ patientUserId })

  const { data: vitalsAbsolute } = useGetVitalsAbsoluteQuery()

  const vitalsList = useMemo(() => {
    const timestamp = 0

    const result: IVitalsCard[] = [
      {
        ...getVitalSettings('hr'),
        timestamp,
        value: vitals.hr,
        thresholds: {
          min: threshold?.minHr,
          max: threshold?.maxHr,
        },
        limits: {
          floor: vitalsAbsolute?.minHr,
          ceiling: vitalsAbsolute?.maxHr,
        },
      },
      {
        ...getVitalSettings('temp'),
        timestamp,
        value: vitals.temp,
        thresholds: {
          min: threshold?.minTemp,
          max: threshold?.maxTemp,
        },
        limits: {
          floor: vitalsAbsolute?.minTemp,
          ceiling: vitalsAbsolute?.maxTemp,
        },
      },
      {
        ...getVitalSettings('spo2'),
        timestamp,
        value: vitals.spo,
        thresholds: {
          min: threshold?.minSpo2,
        },
        limits: {
          floor: vitalsAbsolute?.minSpo2,
          ceiling: vitalsAbsolute?.maxSpo2,
        },
      },
      {
        ...getVitalSettings('rr'),
        timestamp,
        value: vitals.rr,
        thresholds: {
          min: threshold?.minRr,
          max: threshold?.maxRr,
        },
        limits: {
          floor: vitalsAbsolute?.minRr,
          ceiling: vitalsAbsolute?.maxRr,
        },
      },
      {
        ...getVitalSettings('bp'),
        timestamp,
        value: vitals.bp,
      },
      {
        ...getVitalSettings('fall'),
        timestamp,
        value: vitals.fall,
      },
    ]

    return result
  }, [vitals, threshold, vitalsAbsolute])

  useEffect(() => {
    setToggleVitals((prev) => !prev)
  }, [vitals])

  const handleOpenPopup = (type: VitalTypeKeys) => {
    setInitialStartDate(dayjs().subtract(2, 'hours'))
    setInitialEndDate(dayjs())

    if (type in VitalsChartTab) {
      const typeAsChartTab = type as VitalsChartTabKeys

      setVitalsType(typeAsChartTab)
    }

    setVitalChartPopupOpen(true)
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        {isLoading && (
          <Alert icon={<CircularProgress size={24} />} severity="info">
            <AlertTitle>Trying to get current values...</AlertTitle>
            This may take 5-10 seconds
          </Alert>
        )}
        {(!isLoading && isUpdatingEnd) || (!isLoading && !isUpdatingEnd && !lastUpdate) ? (
          <Alert severity="warning">
            <AlertTitle>Current values unavailable at the moment.</AlertTitle>
            Once available, they will appear on the screen.
          </Alert>
        ) : (
          !isLoading && (
            <Alert severity="success">
              <strong>Current values available</strong>
            </Alert>
          )
        )}
      </Box>
      {lastUpdate && (
        <Typography sx={{ mb: 1 }} variant="body2">
          Last updated: {dayjs(lastUpdate).format('DD-MMM-YY, h:mm:ss A')}
        </Typography>
      )}
      <div className={styles.vitalContainer}>
        {vitalsList.map((vital, index) =>
          vital.title === VitalType.fall || vital.title === VitalType.bp ? (
            <VitalItem key={index} toggleVitals={toggleVitals} vital={vital} />
          ) : (
            <VitalItem
              key={index}
              onClick={() => handleOpenPopup(vital.type)}
              tag="button"
              toggleVitals={toggleVitals}
              vital={vital}
            />
          ),
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
