import { Container } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

import styles from '~pages/Auth/auth.module.scss'

export const AuthLayout = () => (
  <Container>
    <div className={styles.authContainer}>
      <Outlet />
    </div>
  </Container>
)
