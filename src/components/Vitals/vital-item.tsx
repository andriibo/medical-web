import { Typography } from '@mui/material'
import React, { FC, useMemo } from 'react'

import { IVitalsCard } from '~models/vital.model'

import styles from './vitals.module.scss'

interface VitalItemProps {
  vital: IVitalsCard
}

export const VitalItem: FC<VitalItemProps> = ({ vital: { title, value, units, icon, thresholds } }) => {
  const isAbnormal = useMemo(
    () => value && ((thresholds?.min && value < thresholds.min) || (thresholds?.max && value > thresholds.max)),
    [thresholds, value],
  )

  return (
    <div className={`${styles.vitalItem} ${isAbnormal ? styles.vitalItemAbnormal : 'xx'}`}>
      <div className={styles.vitalHeader}>
        <div className={styles.vitalIcon}>
          <img alt={title} src={icon} />
        </div>
        <div className={styles.vitalHeaderText}>
          <Typography variant="body1">{title}</Typography>
        </div>
      </div>
      <div className={styles.vitalValue}>
        <strong>{value ? value : '-'}</strong> {units && <span>{units}</span>}
      </div>
    </div>
  )
}
