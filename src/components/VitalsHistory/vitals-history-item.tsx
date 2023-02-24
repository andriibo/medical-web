import { Typography } from '@mui/material'
import React, { FC, useMemo } from 'react'

import { VitalType } from '~/enums/vital-type.enum'
import { IVitalsHistoryCard } from '~models/vital.model'

import styles from './vitals-history.module.scss'

interface VitalItemProps {
  vital: IVitalsHistoryCard
}

export const VitalHistoryItem: FC<VitalItemProps> = ({ vital }) => {
  const { isNormal, title, value, threshold, units, icon } = vital

  const isFall = useMemo(() => title === VitalType.fall, [title])

  const abnormalClass = useMemo(() => {
    if (isFall) {
      return value && styles.vitalItemAbnormal
    }

    return !isNormal && styles.vitalItemAbnormal
  }, [isFall, isNormal, value])

  return (
    <div className={`${styles.vitalItem} ${abnormalClass}`}>
      <div className={styles.vitalHeader}>
        <div className={styles.vitalIcon}>
          <img alt={title} src={icon} />
        </div>
        <div className={styles.vitalHeaderText}>
          <Typography variant="body1">{title}</Typography>
        </div>
      </div>
      {isFall ? (
        <div className={styles.vitalFallText}>{value ? 'Yes' : 'No'}</div>
      ) : (
        <div className={styles.vitalText}>
          <strong>{value ? value : '-'}</strong> {units && <span>{units}</span>}
        </div>
      )}
      <ul className={styles.thresholdInfo}>
        {threshold?.min && (
          <li>
            <span className={styles.thresholdInfoLabel}>Min</span>
            {threshold.min}
          </li>
        )}
        {threshold?.max && (
          <li>
            <span className={styles.thresholdInfoLabel}>Max</span>
            {threshold.max}
          </li>
        )}
      </ul>
    </div>
  )
}
