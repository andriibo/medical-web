import React, { FC } from 'react'

import styles from './empty-box.module.scss'

interface EmptyBoxProps {
  text?: string
}

export const EmptyBox: FC<EmptyBoxProps> = ({ text }) => <div className={styles.emptyBox}>{text || 'No data'}</div>
