import { Edit } from '@mui/icons-material'
import { Button, Chip, Divider, IconButton, Typography } from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'

import { EmptyBox } from '~components/EmptyBox/empty-box'
import { ChangePasswordPopup } from '~components/Modal/ChangePasswordPopup/change-password-popup'
import { EditCaregiverProfilePopup } from '~components/Modal/EditCaregiverProfilePopup/edit-caregiver-profile-popup'
import { EditEmailPopup } from '~components/Modal/EditEmailPopup/edit-email-popup'
import { Spinner } from '~components/Spinner/spinner'
import { UserAvatar } from '~components/UserAvatar/user-avatar'
import { useAppDispatch } from '~stores/hooks'
import { useGetMyCaregiverProfileQuery } from '~stores/services/profile.api'
import { openEditEmailPopup } from '~stores/slices/edit-email.slice'

import styles from '../caregiver-account.module.scss'

export const CaregiverPersonalInfo = () => {
  const dispatch = useAppDispatch()
  const [profilePopupOpen, setProfilePopupOpen] = useState(false)
  const [changePasswordPopupOpen, setChangePasswordPopupOpen] = useState(false)

  const { data: caregiverData, isLoading } = useGetMyCaregiverProfileQuery()

  const fullName = useMemo(() => `${caregiverData?.firstName} ${caregiverData?.lastName}`, [caregiverData])

  const handleProfilePopupOpen = () => {
    setProfilePopupOpen(true)
  }

  const handleProfilePopupClose = () => {
    setProfilePopupOpen(false)
  }

  const handleChangePasswordPopupOpen = () => {
    setChangePasswordPopupOpen(true)
  }

  const handleChangePasswordPopupClose = () => {
    setChangePasswordPopupOpen(false)
  }

  const handleOpenEditEmailPopup = useCallback(() => {
    dispatch(openEditEmailPopup())
  }, [dispatch])

  if (isLoading) {
    return <Spinner />
  }

  if (!caregiverData) {
    return <EmptyBox />
  }

  return (
    <>
      <div className={styles.personal}>
        <div className={styles.personalAside}>
          <UserAvatar avatarSrc={caregiverData.avatar} fullName={fullName} />
        </div>
        <div className={styles.personalContent}>
          <div className={styles.personalHeading}>
            <strong className={styles.userName}>{fullName}</strong>
            <Chip label="Caregiver" size="small" />
            <Button onClick={handleProfilePopupOpen} sx={{ ml: 'auto' }}>
              Edit
            </Button>
          </div>
          <ul className={styles.personalInfoList}>
            <li>
              <span className={styles.infoListLabel}>Phone</span>+{caregiverData.phone}
            </li>
          </ul>
          <Divider sx={{ mt: '2rem', mb: '1.5rem' }} />
          <Typography sx={{ mb: 2 }} variant="h6">
            Login & Security
          </Typography>
          <ul className={`${styles.personalInfoList} ${styles.fullWidth}`}>
            <li>
              <span className={styles.infoListLabel}>Email</span>
              {caregiverData.email}
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
      <EditCaregiverProfilePopup
        caregiverData={caregiverData}
        handleClose={handleProfilePopupClose}
        open={profilePopupOpen}
      />
      <EditEmailPopup />
      <ChangePasswordPopup handleClose={handleChangePasswordPopupClose} open={changePasswordPopupOpen} />
    </>
  )
}
