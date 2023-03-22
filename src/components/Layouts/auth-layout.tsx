import '~/assets/styles/styles.scss'

import { Container } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { useEmailParam } from '~/hooks/use-email-param'
import styles from '~pages/Auth/auth.module.scss'
import { useAppDispatch } from '~stores/hooks'
import { clearPersist, useIsAuth, useUserEmail } from '~stores/slices/auth.slice'
import { useEmergencyContactIsLoading } from '~stores/slices/emergency-contact.slice'

export const AuthLayout = () => {
  const dispatch = useAppDispatch()
  const isAuth = useIsAuth()
  const userEmail = useUserEmail()
  const emailParam = useEmailParam()
  const emergencyContactIsLoading = useEmergencyContactIsLoading()

  const theSameEmail = useMemo(() => userEmail === emailParam, [emailParam, userEmail])

  useEffect(() => {
    if (emailParam && !theSameEmail) {
      dispatch(clearPersist())
    }
  }, [dispatch, emailParam, theSameEmail])

  if (isAuth && (!emailParam || theSameEmail) && !emergencyContactIsLoading) {
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
