import '~/assets/styles/styles.scss'

import { Container } from '@mui/material'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import styles from '~pages/Auth/auth.module.scss'
import { useIsAuth } from '~stores/slices/auth.slice'

export const AuthLayout = () => {
  const isAuth = useIsAuth()

  if (isAuth) {
    return <Navigate replace to="/" />
  }

  return (
    <Container>
      <div className={styles.authContainer}>
        <Outlet />
      </div>
    </Container>
  )
}
