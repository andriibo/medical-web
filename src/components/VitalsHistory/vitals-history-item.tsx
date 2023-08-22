import { Typography } from '@mui/material'
import React, { FC, useMemo } from 'react'

import { VitalsTypeFilterKeys, VitalTypeKeys } from '~/enums/vital-type.enum'
import { VITAL_SETTINGS } from '~constants/constants'
import { IThresholds } from '~models/threshold.model'
import { IHistoryItemMetadata } from '~models/vital.model'

import styles from './vitals-history.module.scss'

interface VitalItemProps {
  vital: IHistoryItemMetadata
  threshold: IThresholds | null
  filterType?: VitalsTypeFilterKeys
  disabled?: boolean
  onClick?: () => void
}

export const VitalHistoryItem: FC<VitalItemProps> = ({ vital, threshold, filterType, disabled, onClick }) => {
  const {
    name,
    historyVitalMetadataDto: { isNormal, abnormalMinValue, abnormalMaxValue, totalMean },
  } = vital

  const isBp = useMemo(() => name === 'bp', [name])

  const abnormalClass = useMemo(() => {
    if (isNormal) return ''

    if (name === filterType) return styles.vitalItemDangerActive

    return styles.vitalItemDanger
  }, [isNormal, filterType, name])

  const getValue = useMemo(() => {
    if (abnormalMinValue && abnormalMaxValue) {
      if (name === 'temp') {
        return abnormalMinValue === abnormalMaxValue ? abnormalMinValue : `${abnormalMinValue}-${abnormalMaxValue}`
      }

      const roundedMinValue = Math.round(abnormalMinValue)
      const roundedMaxValue = Math.round(abnormalMaxValue)

      return roundedMinValue === roundedMaxValue ? roundedMinValue : `${roundedMinValue}-${roundedMaxValue}`
    }

    if (name === 'temp') {
      return totalMean || '-'
    }

    return Math.round(totalMean) || '-'
  }, [abnormalMaxValue, abnormalMinValue, name, totalMean])

  const { icon, title, units, min, max, bpMinMax } = VITAL_SETTINGS[name as VitalTypeKeys]

  return (
    <button className={`${styles.vitalItem} ${abnormalClass}`} disabled={disabled} onClick={onClick} type="button">
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
      <div className={styles.vitalText}>
        <strong>{getValue}</strong> {units && <span>{units}</span>}
      </div>
      {threshold && (
        <ul className={styles.thresholdInfo}>
          {isBp && bpMinMax ? (
            bpMinMax.map(({ title, min, max }) => (
              <li key={title}>
                <span>{title}</span> {threshold[min]} / {threshold[max]}
              </li>
            ))
          ) : (
            <>
              {min && (
                <li>
                  <span className={styles.thresholdInfoLabel}>Min</span>
                  {threshold[min]}
                </li>
              )}
              {max && (
                <li>
                  <span className={styles.thresholdInfoLabel}>Max</span>
                  {threshold[max]}
                </li>
              )}
            </>
          )}
        </ul>
      )}
    </button>
  )
}
