import { Edit } from '@mui/icons-material'
import { Avatar, Button, Chip, Divider, IconButton, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'

import { EmptyBox } from '~components/EmptyBox/empty-box'
import { EditPatientProfilePopup } from '~components/Modal/EditPatientProfile/edit-patient-profile-popup'
import { Spinner } from '~components/Spinner/spinner'
import { getAcronym } from '~helpers/get-acronym'
import { useGetPatientProfileQuery } from '~stores/services/profile.api'

import styles from '../my-account.module.scss'

export const PatientPersonalInfo = () => {
  const { data: patientData, isLoading, isError } = useGetPatientProfileQuery()

  const fullName = useMemo(() => `${patientData?.firstName} ${patientData?.lastName}`, [patientData])

  const [isProfilePopupOpen, setIsProfilePopupOpen] = React.useState(false)

  const handleProfilePopupOpen = () => {
    setIsProfilePopupOpen(true)
  }

  const handleProfilePopupClose = () => {
    setIsProfilePopupOpen(false)
  }

  if (isLoading) {
    return <Spinner />
  }

  if (!patientData) {
    return <EmptyBox />
  }

  return (
    <>
      <div className={styles.personal}>
        <div className={styles.personalAside}>
          <Avatar className={styles.userAvatar}>{getAcronym(fullName)}</Avatar>
        </div>
        <div className={styles.personalContent}>
          <div className={styles.personalHeading}>
            <strong className={styles.userName}>{fullName}</strong>
            <Chip label="Patient" size="small" />
            <Button onClick={handleProfilePopupOpen} sx={{ ml: 'auto' }}>
              Edit
            </Button>
          </div>
          <ul className={styles.personalInfoList}>
            <li>
              <span className={styles.infoListLabel}>Date of birth</span>
              {dayjs(patientData.dob).format('MMMM D, YYYY')}
            </li>
            <li>
              <span className={styles.infoListLabel}>Gender</span>
              {patientData.gender}
            </li>
            <li>
              <span className={styles.infoListLabel}>Height</span>
              {patientData.height} cm
            </li>
            <li>
              <span className={styles.infoListLabel}>Weight</span>
              {patientData.weight} kg
            </li>
            <li>
              <span className={styles.infoListLabel}>Phone</span>+{patientData.phone}
            </li>
          </ul>
          <Divider sx={{ mt: '2rem', mb: '1.5rem' }} />
          <Typography sx={{ mb: 2 }} variant="h6">
            Login & Security
          </Typography>
          <ul className={`${styles.personalInfoList} ${styles.fullWidth}`}>
            <li>
              <span className={styles.infoListLabel}>Email</span>
              {patientData.email}
              <IconButton className={styles.infoListButton} size="small">
                <Edit fontSize="inherit" />
              </IconButton>
            </li>
            <li>
              <span className={styles.infoListLabel}>Password</span>
              <span className={styles.infoListText}>
                Last updated on September 5, 2022
                <IconButton className={styles.infoListButton} size="small">
                  <Edit fontSize="inherit" />
                </IconButton>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <EditPatientProfilePopup
        handleClose={handleProfilePopupClose}
        open={isProfilePopupOpen}
        patientData={patientData}
      />
    </>
  )
}
