import { ArrowBack } from '@mui/icons-material'
import { Button } from '@mui/material'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import styles from './static-layout.module.scss'

export const StaticLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    document.querySelector('html')?.scrollTo(0, 0)
  }, [])

  return (
    <div className={styles.staticContainer}>
      <div className="white-box">
        <Button className={styles.staticBack} onClick={() => navigate(-1)} size="large">
          <ArrowBack />
        </Button>
        <Outlet />
      </div>
    </div>
  )
}
