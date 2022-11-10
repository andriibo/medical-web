import { ArrowBack } from '@mui/icons-material'
import { Button, IconButton, Typography } from '@mui/material'
import React from 'react'
import { NavLink } from 'react-router-dom'

import styles from '~pages/Auth/auth.module.scss'

export const SignIn = () => {
  console.log('sdfsf')

  return (
    <>
      <div className={styles.authHeader}>
        <Typography variant="h6">Sign in to your account</Typography>
      </div>
      <div className={styles.authFooter}>
        <span className={styles.authFooterText}>Don’t have an account?</span>
        <Button component={NavLink} size="small" to="/account-type">
          Sign Up
        </Button>
      </div>
    </>
  )
}
