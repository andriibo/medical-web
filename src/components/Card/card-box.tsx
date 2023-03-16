import { List } from '@mui/material'
import React, { FC, ReactNode } from 'react'

import styles from './card-box.module.scss'

interface CardBoxProps {
  header?: ReactNode
  infoListItems?: ReactNode
  children?: ReactNode
  disable?: boolean
}

export const CardBox: FC<CardBoxProps> = ({ children, header, disable, infoListItems }) => (
  <div className={`${styles.card} ${disable ? styles.disable : ''}`}>
    {header && <div className={styles.cardHeader}>{header}</div>}
    {infoListItems && <List className={styles.cardInfoList}>{infoListItems}</List>}
    {children}
  </div>
)
