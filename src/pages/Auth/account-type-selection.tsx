import { Button, Typography } from '@mui/material'
import React from 'react'
import { NavLink } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import iconCaregiver from '~images/icon-caregiver.png'
import iconDoctor from '~images/icon-doctor.png'
import iconPatient from '~images/icon-patient.png'
import styles from '~pages/Auth/auth.module.scss'

export const AccountTypeSelection = () => (
  <>
    <div className={styles.authHeader}>
      <Typography variant="h6">Create a new account</Typography>
    </div>
    <nav className={styles.accountSwitcher}>
      <NavLink className={styles.accountSwitcherLink} to={PageUrls.SignUpPatient}>
        <div className={styles.accountSwitcherVisual}>
          <img alt="patient" src={iconPatient} />
        </div>
        <strong className={styles.accountSwitcherTitle}>Patient</strong>
      </NavLink>
      <NavLink className={styles.accountSwitcherLink} to={PageUrls.SignUpDoctor}>
        <div className={styles.accountSwitcherVisual}>
          <img alt="MD" src={iconDoctor} />
        </div>
        <strong className={styles.accountSwitcherTitle}>MD</strong>
      </NavLink>
      <NavLink className={`${styles.accountSwitcherLink} ${styles.disabled}`} to="">
        <div className={styles.accountSwitcherVisual}>
          <img alt="caregiver" src={iconCaregiver} />
        </div>
        <strong className={styles.accountSwitcherTitle}>Caregiver</strong>
      </NavLink>
    </nav>
    <div className={styles.authFooter}>
      <span className={styles.authFooterText}>Have an account?</span>
      <Button component={NavLink} size="small" to={PageUrls.SignIn}>
        Sign In
      </Button>
    </div>
  </>
)
