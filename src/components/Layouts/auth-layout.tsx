import '~/assets/styles/styles.scss'

import { Container } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { useEmailParam } from '~/hooks/use-email-param'
import styles from '~pages/Auth/auth.module.scss'
import { useHasEmergencyContacts, useIsAuth } from '~stores/slices/auth.slice'
import { useAppDispatch } from '~stores/hooks'
import { clearPersist, useIsAuth, useUserEmail } from '~stores/slices/auth.slice'

export const AuthLayout = () => {
  const dispatch = useAppDispatch()
  const isAuth = useIsAuth()
  const userEmail = useUserEmail()
  const emailParam = useEmailParam()

  const theSameEmail = useMemo(() => userEmail === emailParam, [emailParam, userEmail])
  const hasEmergencyContacts = useHasEmergencyContacts()

  if (isAuth && !hasEmergencyContacts) {
    return <Navigate replace to={PageUrls.AddEmergencyContact} />
  }

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
