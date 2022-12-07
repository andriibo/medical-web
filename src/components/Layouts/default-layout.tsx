import { Container } from '@mui/material'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { useIsAuth } from '~stores/slices/auth.slice'

import { Header } from '../Header/header'

export const DefaultLayout = () => {
  const isAuth = useIsAuth()

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
