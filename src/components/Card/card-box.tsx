import React, { FC, ReactNode } from 'react'

import styles from './card-box.module.scss'

interface CardBoxProps {
  header?: ReactNode
  children: ReactNode
  disable?: boolean
}

export const CardBox: FC<CardBoxProps> = ({ children, header, disable }) => {
  console.log(111)

  return (
    <div className={`${styles.card} ${disable ? styles.disable : ''}`}>
      {header && <div className={styles.cardHeader}>{header}</div>}
      {children}
    </div>
  )
}
