import '~/assets/styles/styles.scss'

import { Container } from '@mui/material'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import styles from '~pages/Auth/auth.module.scss'
import { useHasEmergencyContacts, useIsAuth } from '~stores/slices/auth.slice'

export const AuthLayout = () => {
  const isAuth = useIsAuth()
  const hasEmergencyContacts = useHasEmergencyContacts()

  if (isAuth && !hasEmergencyContacts) {
    return <Navigate replace to={PageUrls.AddEmergencyContact} />
  }

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
