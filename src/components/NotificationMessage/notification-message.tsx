import { Typography } from '@mui/material'
import React, { FC, ReactNode } from 'react'

import styles from './notification-message.module.scss'

interface NotificationMessageProps {
  icon?: ReactNode
  title?: string
  children?: ReactNode
}

export const NotificationMessage: FC<NotificationMessageProps> = ({ icon, title, children }) => (
  <div className={styles.messageBox}>
    <div>
      {icon}
      {title && (
        <Typography sx={{ mb: 3 }} variant="h6">
          {title}
        </Typography>
      )}
      {children}
    </div>
  </div>
)
