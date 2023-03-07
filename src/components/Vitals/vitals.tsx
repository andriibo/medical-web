import { Alert, AlertTitle, Box, CircularProgress, Typography } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'

import { VitalsChartTab, VitalsChartTabKeys, VitalType, VitalTypeKeys } from '~/enums/vital-type.enum'
import { useThresholds } from '~/hooks/use-thresholds'
import styles from '~components/Thresholds/thresholds.module.scss'
import { VitalChartPopup } from '~components/VitalChart/vital-chart-popup'
import { VitalItem } from '~components/Vitals/vital-item'
import { getVitalSettings } from '~helpers/get-vital-settings'
import { IVitalsCard } from '~models/vital.model'
import { useSocket } from '~stores/hooks'
import { useUserId } from '~stores/slices/auth.slice'

type SocketVitalsData = {
  hr: number | null
  temp: number | null
  spo: number | null
  rr: number | null
  bp: number | null
  fall: number | null
}

interface VitalsProps {
  patientUserId?: string
}

const FIRST_LOAD_INTERVAL = 5000
const UPDATE_INTERVAL = 15000

export const Vitals: FC<VitalsProps> = ({ patientUserId }) => {
  const socket = useSocket()
  const userId = useUserId()

  const [isConnected, setIsConnected] = useState(socket.connected)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingEnd, setIsUpdatingEnd] = useState(false)

  const [lastUpdate, setLastUpdate] = useState('')

  const [initialStartDate, setInitialStartDate] = useState<Dayjs>()
  const [initialEndDate, setInitialEndDate] = useState<Dayjs>()
  const [vitalsType, setVitalsType] = useState<VitalsChartTabKeys | null>(null)
  const [vitalChartPopupOpen, setVitalChartPopupOpen] = useState(false)

  const socketPatientUserId = useMemo(() => patientUserId || userId, [patientUserId, userId])

  const updatingTimeout = useRef<any>()

  const { threshold } = useThresholds({ patientUserId })

  const [vitals, setVitals] = useState<SocketVitalsData>({
    hr: null,
    temp: null,
    spo: null,
    rr: null,
    bp: null,
    fall: null,
  })

  useEffect(() => {
    setTimeout(() => setIsLoading(false), FIRST_LOAD_INTERVAL)
  }, [])

  useEffect(() => {
    if (lastUpdate) {
      if (updatingTimeout.current) {
        clearTimeout(updatingTimeout.current)
      }

      updatingTimeout.current = setTimeout(() => setIsUpdatingEnd(true), UPDATE_INTERVAL)
    }
  }, [lastUpdate])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connect')
      setIsConnected(true)
    })

    socket.on('disconnect', (reason) => {
      console.log('disconnect reason-', reason)
      setIsConnected(false)
      if (reason === 'io server disconnect') {
        socket.connect()
      }
    })

    socket.on('messageToClient', (response: any) => {
      setVitals((prev) => ({ ...prev, ...response.data }))
      setIsUpdatingEnd(false)
      setLastUpdate(new Date().toISOString())
      if (isLoading) {
        setIsLoading(false)
      }
    })

    socket.on('joinedRoom', (messages: any) => {
      console.log('joinedRoom', messages)
    })

    socket.on('exception', (error: any) => {
      console.log('exception', error)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('messageToClient')
      socket.off('joinedRoom')
      socket.off('exception')
    }
  }, [isLoading, socket])

  useEffect(() => {
    if (isConnected) {
      console.log('user join room')
      socket.emit('joinRoom', { patientUserId: socketPatientUserId }, (roomData: any) => {
        console.log('emit joinRoom', roomData)
      })
    }

    return () => {
      if (isConnected) {
        console.log('user leave room')
        socket.emit('leaveRoom', { patientUserId: socketPatientUserId }, (roomData: any) => {
          console.log('emit leaveRoom', roomData)
        })
      }
    }
  }, [socket, isConnected, socketPatientUserId])

  const vitalsList: IVitalsCard[] = useMemo(() => {
    const timestamp = 0

    return [
      {
        ...getVitalSettings('hr'),
        timestamp,
        value: vitals.hr,
        threshold: {
          min: threshold?.minHr,
          max: threshold?.maxHr,
        },
      },
      {
        ...getVitalSettings('temp'),
        timestamp,
        value: vitals.temp,
        threshold: {
          min: threshold?.minTemp,
          max: threshold?.maxTemp,
        },
      },
      {
        ...getVitalSettings('spo2'),
        timestamp,
        value: vitals.spo,
        threshold: {
          min: threshold?.minSpo2,
        },
      },
      {
        ...getVitalSettings('rr'),
        timestamp,
        value: vitals.rr,
        threshold: {
          min: threshold?.minRr,
          max: threshold?.maxRr,
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
  }, [vitals, threshold])

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
            <VitalItem key={index} vital={vital} />
          ) : (
            <VitalItem key={index} onClick={() => handleOpenPopup(vital.type)} tag="button" vital={vital} />
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
