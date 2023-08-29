import { Typography } from '@mui/material'
import React, { FC, useEffect, useMemo, useState } from 'react'

import { VitalType } from '~/enums/vital-type.enum'
import { getVitalValueWithDigits } from '~helpers/get-vital-value-with-digits'
import iconManFalling from '~images/icon-man-falling.svg'
import iconManWalking from '~images/icon-man-walking.svg'
import { IVitalsCard } from '~models/vital.model'

import styles from './vitals.module.scss'

interface VitalItemProps {
  vital: IVitalsCard
  toggleVitals?: boolean
  onClick?: () => void
  disabled?: boolean
}

export const VitalItem: FC<VitalItemProps> = ({
  vital: { title, value, units, icon, thresholds, limits, type },
  toggleVitals,
  onClick,
  disabled,
}) => {
  const [changedClass, setChangedClass] = useState('')
  const [blinkClass, setBlinkClass] = useState('')

  const isFall = useMemo(() => title === VitalType.fall, [title])

  const isAbnormal = useMemo(
    () => value && ((thresholds?.min && value < thresholds.min) || (thresholds?.max && value > thresholds.max)),
    [thresholds, value],
  )

  const getValue = useMemo(() => {
    if (value === null || value === undefined) return '-'

    if (isFall) {
      return (
        <div className={styles.vitalFallIcon}>
          <img alt={title} src={value ? iconManFalling : iconManWalking} />
        </div>
      )
    }

    if (limits?.floor && value < limits.floor) {
      return (
        <>
          <span className={styles.vitalLimitText}>below</span>
          {getVitalValueWithDigits(limits.floor, type)}
        </>
      )
    }

    if (limits?.ceiling && value > limits.ceiling) {
      return (
        <>
          <span className={styles.vitalLimitText}>above</span>
          {getVitalValueWithDigits(limits.ceiling, type)}
        </>
      )
    }

    return getVitalValueWithDigits(value, type)
  }, [isFall, limits?.ceiling, limits?.floor, title, value, type])

  const exceedingLimit = useMemo(
    () => value && ((limits?.ceiling && value > limits.ceiling) || (limits?.floor && value < limits.floor)),
    [limits, value],
  )

  const isDanger = useMemo(() => isAbnormal || exceedingLimit, [exceedingLimit, isAbnormal])

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
    <button
      className={`${styles.vitalItem} ${isDanger ? styles.vitalItemDanger : ''}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <div className={styles.vitalHeader}>
        {icon && (
          <div className={styles.vitalIcon}>
            <img alt={title} src={icon} />
          </div>
        )}
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
    </button>
  )
}
