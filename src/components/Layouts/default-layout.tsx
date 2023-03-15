import { Container } from '@mui/material'
import React, { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { useAppDispatch } from '~stores/hooks'
import { useIsAuth, useUserDeletedAt } from '~stores/slices/auth.slice'
import { combineApi } from '~stores/store'

import { Header } from '../Header/header'

export const DefaultLayout = () => {
  const dispatch = useAppDispatch()
  const isAuth = useIsAuth()
  const userDeletedAt = useUserDeletedAt()
  const location = useLocation()

  useEffect(() => {
    if (!isAuth) {
      combineApi.map((api) => {
        dispatch(api.util.resetApiState())
      })
    }
  }, [dispatch, isAuth])

  if (userDeletedAt && location.pathname !== PageUrls.AccountRecovery) {
    return <Navigate replace to={PageUrls.AccountRecovery} />
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
