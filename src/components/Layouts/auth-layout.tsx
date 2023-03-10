import '~/assets/styles/styles.scss'

import { Container } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { Navigate, Outlet, useSearchParams } from 'react-router-dom'

import styles from '~pages/Auth/auth.module.scss'
import { useAppDispatch } from '~stores/hooks'
import { clearPersist, useIsAuth, useUserEmail } from '~stores/slices/auth.slice'

export const AuthLayout = () => {
  const dispatch = useAppDispatch()
  const isAuth = useIsAuth()
  const userEmail = useUserEmail()
  const [searchParams] = useSearchParams()

  const emailParam = useMemo(() => searchParams.get('email'), [searchParams])
  const theSameEmail = useMemo(() => userEmail === emailParam?.replace(' ', '+'), [emailParam, userEmail])

  useEffect(() => {
    if (emailParam && !theSameEmail) {
      dispatch(clearPersist())
    }
  }, [dispatch, emailParam, theSameEmail])

  if (isAuth && (!emailParam || theSameEmail)) {
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
