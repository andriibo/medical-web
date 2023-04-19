import { Box, Typography } from '@mui/material'
import React, { FC, useMemo } from 'react'

import { VitalType } from '~/enums/vital-type.enum'
import { IVitalsHistoryCardItems } from '~models/vital.model'

import styles from './vitals-history.module.scss'

interface VitalItemProps {
  vital: IVitalsHistoryCardItems
  onClick?: () => void
  tag?: 'div' | 'button'
}

export const VitalHistoryItem: FC<VitalItemProps> = ({ vital, onClick, tag = 'div' }) => {
  const { isNormal, title, value, threshold, units, icon } = vital

  const isFall = useMemo(() => title === VitalType.fall, [title])

  const abnormalClass = useMemo(() => {
    if (isFall) {
      return value && styles.vitalItemAbnormal
    }

    return !isNormal && styles.vitalItemAbnormal
  }, [isFall, isNormal, value])

  const isButton = useMemo(() => {
    if (tag === 'button') {
      return {
        type: 'button',
      }
    }
  }, [tag])

  return (
    <Box className={`${styles.vitalItem} ${abnormalClass}`} component={tag} onClick={onClick} {...isButton}>
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
        {Array.isArray(threshold) ? (
          threshold.map(({ min, max, title }) => (
            <li key={title}>
              <span>{title}</span> {min} / {max}
            </li>
          ))
        ) : (
          <>
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
          </>
        )}
      </ul>
    </Box>
  )
}
