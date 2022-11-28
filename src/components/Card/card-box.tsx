import React, { FC, ReactNode } from 'react'

import styles from './card-box.module.scss'

interface CardBoxProps {
  header?: ReactNode
  children: ReactNode
}

export const CardBox: FC<CardBoxProps> = ({ children, header }) => {
  console.log(111)

  return (
    <div className={styles.card}>
      {header && <div className={styles.cardHeader}>{header}</div>}
      {children}
    </div>
  )
}
