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
  vital: { title, value, units, icon, thresholds, limits },
  toggleVitals,
  onClick,
  tag = 'div',
}) => {
  const [changedClass, setChangedClass] = useState('')
  const [blinkClass, setBlinkClass] = useState('')

  const isAbnormal = useMemo(
    () => value && ((thresholds?.min && value < thresholds.min) || (thresholds?.max && value > thresholds.max)),
    [thresholds, value],
  )

  const getValue = useMemo(() => {
    if (!value) return '-'

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }

    if (limits?.floor && value < limits.floor) {
      return (
        <>
          <span className={styles.vitalLimitText}>below</span>
          {limits.floor}
        </>
      )
    }

    if (limits?.ceiling && value > limits.ceiling) {
      return (
        <>
          <span className={styles.vitalLimitText}>above</span>
          {limits.ceiling}
        </>
      )
    }

    return value
  }, [limits, value])

  const exceedingLimit = useMemo(
    () => value && ((limits?.ceiling && value > limits.ceiling) || (limits?.floor && value < limits.floor)),
    [limits, value],
  )

  const isDanger = useMemo(() => isAbnormal || exceedingLimit, [exceedingLimit, isAbnormal])

  const isButton = useMemo(() => {
    if (tag === 'button') {
      return {
        type: 'button',
      }
    }
  }, [tag])

  useEffect(() => {
    setChangedClass(styles.changed)
  }, [toggleVitals])

  useEffect(() => {
    if (value) {
      setBlinkClass(styles.blink)
    }
  }, [value])

  const onAnimationEnd = () => {
    setChangedClass('')
    setBlinkClass('')
  }

  return (
    <Box
      className={`${styles.vitalItem} ${isDanger ? styles.vitalItemDanger : ''}`}
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
        <strong className={`${blinkClass} ${changedClass}`} onAnimationEnd={onAnimationEnd}>
          {getValue}
        </strong>
        <span>{units && units}</span>
      </div>
    </Box>
  )
}
