import { useEffect, useMemo, useRef, useState } from 'react'

import { ISocketVitals, ISocketVitalsResponse } from '~models/vital.model'
import { useSocket } from '~stores/hooks'
import { useUserId } from '~stores/slices/auth.slice'

const UPDATE_INTERVAL = 15000

interface CurrentVitalsSocketProps {
  patientUserId?: string
}

export const useCurrentVitalsSocket = ({ patientUserId }: CurrentVitalsSocketProps) => {
  const socket = useSocket()
  const userId = useUserId()

  const [isConnected, setIsConnected] = useState(socket.connected)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdatingEnd, setIsUpdatingEnd] = useState(false)

  const [lastUpdate, setLastUpdate] = useState('')

  const socketPatientUserId = useMemo(() => patientUserId || userId, [patientUserId, userId])

  const updatingTimeout = useRef<any>()

  const [vitals, setVitals] = useState<ISocketVitals>({
    hr: null,
    temp: null,
    spo: null,
    rr: null,
    bp: null,
    fall: null,
  })

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

    socket.on('messageToClient', (response: ISocketVitalsResponse) => {
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

  return {
    vitals,
    isLoading,
    isUpdatingEnd,
    lastUpdate,
  }
}
