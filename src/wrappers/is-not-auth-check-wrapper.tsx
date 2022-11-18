import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useIsAuth } from '~stores/slices/auth.slice'

export const IsNotAuthCheckWrapper = () => {
  const isAuth = useIsAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) {
      navigate('/')
    }
  }, [])

  if (isAuth) {
    return null
  }

  return <Outlet />
}
