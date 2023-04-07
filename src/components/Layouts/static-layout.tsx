import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import styles from './static-layout.module.scss'

export const StaticLayout = () => {
  useEffect(() => {
    document.querySelector('html')?.scrollTo(0, 0)
  }, [])

  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  )
}
