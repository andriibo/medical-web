import { Box, Typography } from '@mui/material'
import React, { FC, useEffect, useMemo, useState } from 'react'

import { IVitalsCard } from '~models/vital.model'

import styles from './vitals.module.scss'

interface VitalItemProps {
  vital: IVitalsCard
  toggleVitals?: boolean
  onClick?: () => void
  tag?: 'div' | 'button'
}

export const VitalItem: FC<VitalItemProps> = ({
  vital: { title, value, units, icon, thresholds },
  toggleVitals,
  onClick,
  tag = 'div',
}) => {
  const [changeClass, setChangeClass] = useState('')
  const [blinkClass, setBlinkClass] = useState('')

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

  useEffect(() => {
    setChangeClass(styles.changed)
  }, [toggleVitals])

  useEffect(() => {
    if (value) {
      setBlinkClass(styles.blink)
    }
  }, [value])

  const onAnimationEnd = () => {
    setChangeClass('')
    setBlinkClass('')
  }

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
        <strong className={`${blinkClass} ${changeClass}`} onAnimationEnd={onAnimationEnd}>
          {value ? value : '-'}
        </strong>
        <span>{units && units}</span>
      </div>
    </Box>
  )
}
