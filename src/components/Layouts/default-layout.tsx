import { Container } from '@mui/material'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { useIsAuth } from '~stores/slices/auth.slice'

import { Header } from '../Header/header'

export const DefaultLayout = () => {
  const isAuth = useIsAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuth) {
      navigate(PageUrls.SignIn, { replace: true })
    }
  }, [isAuth])

  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  )
}
