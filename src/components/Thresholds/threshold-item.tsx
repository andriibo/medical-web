import { Edit } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
import React, { FC } from 'react'

import { useUserRoles } from '~/hooks/use-user-roles'
import { IThresholdList, IThresholdListValues } from '~models/threshold.model'
import { IUserModel } from '~models/user.model'

import styles from './thresholds.module.scss'

interface ThresholdInfoProps extends IThresholdListValues {
  units: string
  fractionDigits?: number
}

const ThresholdInfo: FC<ThresholdInfoProps> = ({ title, min, max, units, fractionDigits = 0 }) => (
  <ul className={styles.thresholdInfo}>
    {title && <li>{title}:</li>}
    <li>
      <span className={styles.thresholdInfoLabel}>Min</span>
      <span className={styles.thresholdInfoValue}>{min.toFixed(fractionDigits)}</span>
    </li>
    {max && (
      <li>
        <span className={styles.thresholdInfoLabel}>Max</span>
        <span className={styles.thresholdInfoValue}>{max.toFixed(fractionDigits)}</span>
      </li>
    )}
    <li className={styles.thresholdInfoMeasure}>{units}</li>
  </ul>
)

interface ThresholdItemProps {
  threshold: IThresholdList
  patientUserId?: string
}

export const ThresholdItem: FC<ThresholdItemProps> = ({
  patientUserId,
  threshold: { title, icon, className, values, fractionDigits, units, setBy, onClick },
}) => {
  const { isUserRoleDoctor } = useUserRoles()

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
        {patientUserId && isUserRoleDoctor && onClick && (
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
            <ThresholdInfo
              fractionDigits={fractionDigits}
              key={index}
              max={max}
              min={min}
              title={title}
              units={units}
            />
          ))}
        </div>
      ) : (
        <ThresholdInfo
          fractionDigits={fractionDigits}
          max={values.max}
          min={values.min}
          title={values.title}
          units={units}
        />
      )}
    </div>
  )
}
