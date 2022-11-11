import { Button } from '@mui/material'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch } from '~stores/hooks'
import { clearPersist } from '~stores/slices/auth.slice'

export const LogoutButton = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
    await dispatch(clearPersist())

    navigate('/', { replace: true, state: undefined })
  }, [dispatch, navigate])

  return <Button onClick={handleLogout}>Logout</Button>
}
