import { Edit } from '@mui/icons-material'
import { Avatar, Button, Chip, Divider, IconButton, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React, { useCallback, useMemo, useState } from 'react'

import { EmptyBox } from '~components/EmptyBox/empty-box'
import { ChangePasswordPopup } from '~components/Modal/ChangePasswordPopup/change-password-popup'
import { EditEmailPopup } from '~components/Modal/EditEmailPopup/edit-email-popup'
import { EditPatientProfilePopup } from '~components/Modal/EditPatientProfilePopup/edit-patient-profile-popup'
import { Spinner } from '~components/Spinner/spinner'
import { getAcronym } from '~helpers/get-acronym'
import { useAppDispatch } from '~stores/hooks'
import { useGetPatientProfileQuery } from '~stores/services/profile.api'
import { openEditEmailPopup } from '~stores/slices/edit-email.slice'

import styles from '../patient-account.module.scss'

export const PatientPersonalInfo = () => {
  const dispatch = useAppDispatch()
  const [profilePopupOpen, setProfilePopupOpen] = useState(false)
  const [changePasswordPopupOpen, setChangePasswordPopupOpen] = useState(false)

  const { data: patientData, isLoading } = useGetPatientProfileQuery()

  const fullName = useMemo(() => `${patientData?.firstName} ${patientData?.lastName}`, [patientData])

  const handleProfilePopupOpen = () => {
    setProfilePopupOpen(true)
  }

  const handleProfilePopupClose = () => {
    setProfilePopupOpen(false)
  }

  const handleOpenEditEmailPopup = useCallback(() => {
    dispatch(openEditEmailPopup())
  }, [])

  const handleChangePasswordPopupOpen = () => {
    setChangePasswordPopupOpen(true)
  }

  const handleChangePasswordPopupClose = () => {
    setChangePasswordPopupOpen(false)
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
              <IconButton className={styles.infoListButton} onClick={handleOpenEditEmailPopup} size="small">
                <Edit fontSize="inherit" />
              </IconButton>
            </li>
            <li>
              <span className={styles.infoListLabel}>Password</span>
              <span className={styles.infoListText}>
                Last updated on September 5, 2022
                <IconButton className={styles.infoListButton} onClick={handleChangePasswordPopupOpen} size="small">
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
      <EditPatientProfilePopup
        handleClose={handleProfilePopupClose}
        open={profilePopupOpen}
        patientData={patientData}
      />
      <EditEmailPopup />
      <ChangePasswordPopup handleClose={handleChangePasswordPopupClose} open={changePasswordPopupOpen} />
    </>
  )
}