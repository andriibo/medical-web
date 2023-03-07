import { Box, Typography } from '@mui/material'
import React, { FC, useMemo } from 'react'

import { IVitalsCard } from '~models/vital.model'

import styles from './vitals.module.scss'

interface VitalItemProps {
  vital: IVitalsCard
  onClick?: () => void
  tag?: 'div' | 'button'
}

export const VitalItem: FC<VitalItemProps> = ({
  vital: { title, value, units, icon, thresholds },
  onClick,
  tag = 'div',
}) => {
  const isAbnormal = useMemo(
    () => value && ((thresholds?.min && value < thresholds.min) || (thresholds?.max && value > thresholds.max)),
    [thresholds, value],
  )

  const isButton = useMemo(() => {
    if (tag === 'button') {
      return {
        type: 'button',
      }
    }
  }, [tag])

  return (
    <Box
      className={`${styles.vitalItem} ${isAbnormal ? styles.vitalItemAbnormal : ''}`}
      component={tag}
      onClick={onClick}
      {...isButton}
    >
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
    </Box>
  )
}
