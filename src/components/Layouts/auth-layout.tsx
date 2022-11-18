import '~/assets/styles/styles.scss'

import { Container } from '@mui/material'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import styles from '~pages/Auth/auth.module.scss'

export const AuthLayout = () => {
  useEffect(() => {
    const body = document.querySelector('body')

    if (body) {
      body.classList.add('auth-layout')

      return () => {
        body.classList.remove('auth-layout')
      }
    }
  }, [])

  return (
    <Container>
      <div className={styles.authContainer}>
        <Outlet />
      </div>
    </Container>
  )
}
