import { Box, Typography } from '@mui/material'
import React, { FC, Fragment, useMemo } from 'react'

import { VitalType } from '~/enums/vital-type.enum'
import iconManFalling from '~images/icon-man-falling.svg'
import iconManWalking from '~images/icon-man-walking.svg'
import { IVitalsHistoryCardItems } from '~models/vital.model'

import styles from './vitals-history.module.scss'

interface VitalItemProps {
  vital: IVitalsHistoryCardItems
  onClick?: () => void
  tag?: 'div' | 'button'
}

export const VitalHistoryItem: FC<VitalItemProps> = ({ vital, onClick, tag = 'div' }) => {
  const { isNormal, title, value, threshold, units, icon, type } = vital

  const isFall = useMemo(() => title === VitalType.fall, [title])
  const isBp = useMemo(() => title === VitalType.bp, [title])

  const abnormalClass = useMemo(() => {
    if (isFall) {
      return value && styles.vitalItemDanger
    }

    return !isNormal && styles.vitalItemDanger
  }, [isFall, isNormal, value])

  const isButton = useMemo(() => {
    if (tag === 'button') {
      return {
        type: 'button',
      }
    }
  }, [tag])

  return (
    <Box
      className={`${styles.vitalItem} ${abnormalClass} ${isBp ? styles.vitalItemBp : ''}`}
      component={tag}
      onClick={onClick}
      {...isButton}
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
      {isFall ? (
        <div className={styles.vitalFallIcon}>
          <img alt={title} src={value ? iconManFalling : iconManWalking} />
        </div>
      ) : (
        <div className={styles.vitalText}>
          <strong>{value ? value : '-'}</strong> {units && <span>{units}</span>}
        </div>
      )}
      {threshold && (
        <ul className={styles.thresholdInfo}>
          {threshold.map(({ min, max, title }, index) => {
            if (type === 'bp') {
              return (
                <li key={index}>
                  <span>{title}</span> {min} / {max}
                </li>
              )
            }

            return (
              <Fragment key={index}>
                {min && (
                  <li>
                    <span className={styles.thresholdInfoLabel}>Min</span>
                    {min}
                  </li>
                )}
                {max && (
                  <li>
                    <span className={styles.thresholdInfoLabel}>Max</span>
                    {max}
                  </li>
                )}
              </Fragment>
            )
          })}
        </ul>
      )}
    </Box>
  )
}
