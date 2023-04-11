import { Box, Button, Divider, Typography } from '@mui/material'
import React, { FC } from 'react'

import { PageUrls } from '~/enums/page-urls.enum'
import { useDeletePatient } from '~/hooks/use-delete-patient'
import { UserAvatar } from '~components/UserAvatar/user-avatar'
import { getAge } from '~helpers/get-age'
import { IDoctorPatients } from '~models/profie.model'

import styles from '../granted-user-patient.module.scss'

interface GrantedUserPatientInfoProps {
  patientData: IDoctorPatients
}

export const GrantedUserPatientInfo: FC<GrantedUserPatientInfoProps> = ({
  patientData: { firstName, lastName, email, avatar, gender, dob, weight, height, phone, accessId },
}) => {
  const [deletePatient] = useDeletePatient()

  return (
    <div className={styles.patientAside}>
      <UserAvatar
        avatar={avatar}
        firstName={firstName}
        lastName={lastName}
        sx={{ width: '120px', m: '0 auto 1rem', fontSize: '3.5rem' }}
      />
      <Typography textAlign="center" variant="body1">
        {firstName} {lastName}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <ul className={styles.personalInfoList}>
        <li>
          <span className={styles.infoListLabel}>Gender</span>
          {gender}
        </li>
        <li>
          <span className={styles.infoListLabel}>Age</span>
          {getAge(dob)}
        </li>
        <li>
          <span className={styles.infoListLabel}>Height</span>
          {height} cm
        </li>
        <li>
          <span className={styles.infoListLabel}>Weight</span>
          {weight} kg
        </li>
      </ul>
      <Divider sx={{ my: 2 }} />
      <ul className={`${styles.personalInfoList} ${styles.fullWidth}`}>
        <li>
          <span className={styles.infoListLabel}>Phone</span>
          <a className="simple-link" href={`tel:${phone}`}>
            {phone}
          </a>
        </li>
        <li>
          <span className={styles.infoListLabel}>Email</span>
          <a className="simple-link text-ellipsis" href={`mailto: ${email}`} title={email}>
            {email}
          </a>
        </li>
      </ul>
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          color="error"
          onClick={() => deletePatient({ accessId, navigateTo: PageUrls.Patients })}
          variant="outlined"
        >
          Remove
        </Button>
      </Box>
    </div>
  )
}
