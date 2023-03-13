import { Container } from '@mui/material'
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { useHasEmergencyContacts, useIsAuth, useUserDeletedAt } from '~stores/slices/auth.slice'

import { Header } from '../Header/header'

export const DefaultLayout = () => {
  const isAuth = useIsAuth()
  const userDeletedAt = useUserDeletedAt()
  const location = useLocation()
  const hasEmergencyContacts = useHasEmergencyContacts()

  if (userDeletedAt && location.pathname !== PageUrls.AccountRecovery) {
    return <Navigate replace to={PageUrls.AccountRecovery} />
  }

  if (isAuth && !hasEmergencyContacts) {
    return <Navigate replace to={PageUrls.AddEmergencyContact} />
  }

  if (!isAuth) {
    return <Navigate replace to={PageUrls.SignIn} />
  }

  return (
    <>
      <Header />
      <Container sx={{ mb: 3 }}>
        <Outlet />
      </Container>
    </>
  )
}
