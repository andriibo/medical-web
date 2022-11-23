import { Edit } from '@mui/icons-material'
import { Avatar, Button, Chip, Divider, IconButton, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'

import { EmptyBox } from '~components/EmptyBox/empty-box'
import { EditDoctorProfilePopup } from '~components/Modal/EditDoctorProfilePopup/edit-doctor-profile-popup'
import { Spinner } from '~components/Spinner/spinner'
import { getAcronym } from '~helpers/get-acronym'
import { useGetDoctorProfileQuery } from '~stores/services/profile.api'

import styles from '../doctor-account.module.scss'

export const DoctorPersonalInfo = () => {
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false)

  const { data: doctorData, isLoading } = useGetDoctorProfileQuery()

  const fullName = useMemo(() => `${doctorData?.firstName} ${doctorData?.lastName}`, [doctorData])

  const handleProfilePopupOpen = () => {
    setIsProfilePopupOpen(true)
  }

  const handleProfilePopupClose = () => {
    setIsProfilePopupOpen(false)
  }

  if (isLoading) {
    return <Spinner />
  }

  if (!doctorData) {
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
            <Chip label="Doctor" size="small" />
            <Button onClick={handleProfilePopupOpen} sx={{ ml: 'auto' }}>
              Edit
            </Button>
          </div>
          <ul className={styles.personalInfoList}>
            <li>
              <span className={styles.infoListLabel}>Phone</span>+{doctorData.phone}
            </li>
            <li>
              <span className={styles.infoListLabel}>Institution</span>
              {doctorData.institution ? doctorData.institution : '-'}
            </li>
          </ul>
          <Divider sx={{ mt: '2rem', mb: '1.5rem' }} />
          <Typography sx={{ mb: 2 }} variant="h6">
            Login & Security
          </Typography>
          <ul className={`${styles.personalInfoList} ${styles.fullWidth}`}>
            <li>
              <span className={styles.infoListLabel}>Email</span>
              {doctorData.email}
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
          <Button className={styles.deleteAccountBtn} color="inherit">
            Delete my account
          </Button>
        </div>
      </div>
      <EditDoctorProfilePopup doctorData={doctorData} handleClose={handleProfilePopupClose} open={isProfilePopupOpen} />
    </>
  )
}
