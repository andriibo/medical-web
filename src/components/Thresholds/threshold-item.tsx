import { Edit } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
import React, { FC } from 'react'

import { IThresholdData, IThresholdListValues } from '~models/threshold.model'
import { IUserModel } from '~models/user.model'

import styles from './thresholds.module.scss'

interface ThresholdInfoProps extends IThresholdListValues {
  units: string
}

const ThresholdInfo: FC<ThresholdInfoProps> = ({ title, min, max, units }) => (
  <ul className={styles.thresholdInfo}>
    {title && <li>{title}:</li>}
    <li>
      <span className={styles.thresholdInfoLabel}>Min</span>
      <span className={styles.thresholdInfoValue}>{min}</span>
    </li>
    {max && (
      <li>
        <span className={styles.thresholdInfoLabel}>Max</span>
        <span className={styles.thresholdInfoValue}>{max}</span>
      </li>
    )}
    <li className={styles.thresholdInfoMeasure}>{units}</li>
  </ul>
)

interface ThresholdItemProps {
  threshold: IThresholdData
  patientUserId?: string
}

export const ThresholdItem: FC<ThresholdItemProps> = ({
  patientUserId,
  threshold: { title, icon, className, values, units, setBy, onClick },
}) => {
  const getSetByName = (setByUser: IUserModel | null) => {
    if (setByUser) {
      return `updated by ${setByUser.firstName} ${setByUser.lastName}`
    }

    return 'default'
  }

  return (
    <div className={`${styles.vitalItem} ${className ? styles[className] : ''}`}>
      <div className={styles.vitalHeader}>
        <div className={styles.vitalIcon}>
          <img alt={title} src={icon} />
        </div>
        <div className={styles.vitalHeaderText}>
          <Typography variant="body1">{title}</Typography>
          <Typography variant="body2">{getSetByName(setBy)}</Typography>
        </div>
        {patientUserId && onClick && (
          <div className={styles.vitalActions}>
            <IconButton edge="end" onClick={onClick}>
              <Edit />
            </IconButton>
          </div>
        )}
      </div>
      {Array.isArray(values) ? (
        <div className={styles.thresholdInfoGroup}>
          {values.map(({ min, max, title }, index) => (
            <ThresholdInfo key={index} max={max} min={min} title={title} units={units} />
          ))}
        </div>
      ) : (
        <ThresholdInfo max={values.max} min={values.min} title={values.title} units={units} />
      )}
    </div>
  )
}
