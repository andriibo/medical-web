import React, { FC } from 'react'

import styles from './empty-box.module.scss'

interface EmptyBoxProps {
  message?: string
}

export const EmptyBox: FC<EmptyBoxProps> = ({ message }) => (
  <div className={styles.emptyBox}>{message ? message : 'No data'}</div>
)
