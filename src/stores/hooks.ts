import { useMemo } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'

import { useToken } from '~stores/slices/auth.slice'

import type { AppDispatch, RootState } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useSocket = () => {
  const token = useToken()

  return useMemo(() => {
    const socketOptions = {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    }

    return io(`${process.env.REACT_APP_API_URL}/ws/current-vitals`, socketOptions)
  }, [token])
}
