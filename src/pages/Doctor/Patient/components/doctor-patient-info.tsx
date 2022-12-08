import { Avatar, Box, Button, Divider, Typography } from '@mui/material'
import React, { FC, useMemo } from 'react'

import { getAcronym } from '~helpers/get-acronym'
import { getAge } from '~helpers/get-age'
import { IPatientProfile } from '~models/profie.model'

import styles from '../doctor-patient.module.scss'

interface DoctorPatientInfoProps {
  patientData: IPatientProfile
}

export const DoctorPatientInfo: FC<DoctorPatientInfoProps> = ({ patientData }) => {
  const fullName = useMemo(() => `${patientData?.firstName} ${patientData?.lastName}`, [patientData])

  return (
    <div className={styles.patientAside}>
      <Avatar className={styles.userAvatar}>{getAcronym(fullName)}</Avatar>
      <Typography textAlign="center" variant="body1">
        {fullName}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <ul className={styles.personalInfoList}>
        <li>
          <span className={styles.infoListLabel}>Gender</span>
          {patientData.gender}
        </li>
        <li>
          <span className={styles.infoListLabel}>Age</span>
          {getAge(patientData.dob)}
        </li>
        <li>
          <span className={styles.infoListLabel}>Height</span>
          {patientData.height} cm
        </li>
        <li>
          <span className={styles.infoListLabel}>Weight</span>
          {patientData.weight} kg
        </li>
      </ul>
      <Divider sx={{ my: 2 }} />
      <ul className={`${styles.personalInfoList} ${styles.fullWidth}`}>
        <li>
          <span className={styles.infoListLabel}>Phone</span>+{patientData.phone}
        </li>
        <li>
          <span className={styles.infoListLabel}>Email</span>
          <span className="text-ellipsis" title={patientData.email}>
            {patientData.email}
          </span>
        </li>
      </ul>
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button color="error" variant="outlined">
          Remove
        </Button>
      </Box>
    </div>
  )
}
