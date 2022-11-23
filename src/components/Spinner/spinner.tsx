import { CircularProgress } from '@mui/material'
import React from 'react'

import styles from './spinner.module.scss'

export const Spinner = () => (
  <div className={`${styles.spinner}`}>
    <CircularProgress />
  </div>
)
