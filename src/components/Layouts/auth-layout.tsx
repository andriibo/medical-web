import '~/assets/styles/styles.scss'

import { Container } from '@mui/material'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import styles from '~pages/Auth/auth.module.scss'
import { useIsAuth } from '~stores/slices/auth.slice'

export const AuthLayout = () => {
  const isAuth = useIsAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) {
      navigate('/', { replace: true })
    }
  }, [isAuth])

  return (
    <Container>
      <div className={styles.authContainer}>
        <Outlet />
      </div>
    </Container>
  )
}
