import { Alert, AlertTitle, Box, CircularProgress, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'

import { VitalType } from '~/enums/vital-type.enum'
import { useThresholds } from '~/hooks/use-thresholds'
import styles from '~components/Thresholds/thresholds.module.scss'
import { VitalItem } from '~components/Vitals/vital-item'
import iconBloodPressure from '~images/icon-blood-pressure.png'
import iconFall from '~images/icon-fall.svg'
import iconHeartRate from '~images/icon-heart-rate.png'
import iconRespiration from '~images/icon-respiration.png'
import iconSaturation from '~images/icon-saturation.png'
import iconTemperature from '~images/icon-temperature.png'
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

  const socketPatientUserId = useMemo(() => patientUserId || userId, [patientUserId, userId])

  const updatingTimeout = useRef<any>()

  const { thresholds } = useThresholds({ patientUserId })

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
        timestamp,
        title: VitalType.hr,
        value: vitals.hr,
        thresholds: {
          min: thresholds?.minHr,
          max: thresholds?.maxHr,
        },
        icon: iconHeartRate,
        units: 'bpm',
      },
      {
        timestamp,
        title: VitalType.temp,
        value: vitals.temp,
        thresholds: {
          min: thresholds?.minTemp,
          max: thresholds?.maxTemp,
        },
        icon: iconTemperature,
        units: '°C',
      },
      {
        timestamp,
        title: VitalType.spo2,
        value: vitals.spo,
        thresholds: {
          min: thresholds?.minSpo2,
        },
        icon: iconSaturation,
        units: '%',
      },
      {
        timestamp,
        title: VitalType.rr,
        value: vitals.rr,
        thresholds: {
          min: thresholds?.minRr,
          max: thresholds?.maxRr,
        },
        icon: iconRespiration,
        units: 'rpm',
      },
      {
        timestamp,
        title: VitalType.bp,
        value: vitals.bp,
        icon: iconBloodPressure,
        units: 'mmHg',
      },
      {
        timestamp,
        title: VitalType.fall,
        value: vitals.fall,
        icon: iconFall,
        units: '',
      },
    ]
  }, [vitals, thresholds])

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
        {vitalsList.map((vital, index) => (
          <VitalItem key={index} vital={vital} />
        ))}
      </div>
    </>
  )
}
