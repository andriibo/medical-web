import { Edit } from '@mui/icons-material'
import { Button, Chip, Divider, IconButton, Typography } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { EmptyBox } from '~components/EmptyBox/empty-box'
import { ChangePasswordPopup } from '~components/Modal/ChangePasswordPopup/change-password-popup'
import { EditCaregiverProfilePopup } from '~components/Modal/EditCaregiverProfilePopup/edit-caregiver-profile-popup'
import { EditDoctorProfilePopup } from '~components/Modal/EditDoctorProfilePopup/edit-doctor-profile-popup'
import { EditEmailPopup } from '~components/Modal/EditEmailPopup/edit-email-popup'
import { Spinner } from '~components/Spinner/spinner'
import { UserAvatar } from '~components/UserAvatar/user-avatar'
import { isUserRoleCaregiver, isUserRoleDoctor } from '~helpers/user-role'
import { ICaregiverProfile, IDoctorProfile } from '~models/profie.model'
import { useAppDispatch } from '~stores/hooks'
import { useGetMyCaregiverProfileQuery, useGetMyDoctorProfileQuery } from '~stores/services/profile.api'
import { useUserRole } from '~stores/slices/auth.slice'
import { openEditEmailPopup } from '~stores/slices/edit-email.slice'

import styles from '../granted-user-account.module.scss'

export const GrantedUserPersonalInfo = () => {
  const userRole = useUserRole()
  const dispatch = useAppDispatch()
  const [profilePopupOpen, setProfilePopupOpen] = useState(false)
  const [changePasswordPopupOpen, setChangePasswordPopupOpen] = useState(false)
  const [userData, setUserData] = useState<IDoctorProfile | ICaregiverProfile>()
  const [isLoading, setIsLoading] = useState(false)

  const { data: doctorData, isLoading: doctorDataIsLoading } = useGetMyDoctorProfileQuery(
    isUserRoleDoctor(userRole) ? undefined : skipToken,
  )
  const { data: caregiverData, isLoading: caregiverDataIsLoading } = useGetMyCaregiverProfileQuery(
    isUserRoleCaregiver(userRole) ? undefined : skipToken,
  )

  const isDoctor = (data: IDoctorProfile | ICaregiverProfile): data is IDoctorProfile =>
    (data as IDoctorProfile).institution !== undefined

  useEffect(() => {
    if (doctorData && !doctorDataIsLoading) {
      setUserData({ ...doctorData })

      return
    }

    if (caregiverData && !caregiverDataIsLoading) {
      setUserData({ ...caregiverData })
    }
  }, [caregiverData, caregiverDataIsLoading, doctorData, doctorDataIsLoading])

  useEffect(() => {
    if (doctorDataIsLoading || caregiverDataIsLoading) {
      setIsLoading(true)

      return
    }

    setIsLoading(false)
  }, [doctorDataIsLoading, caregiverDataIsLoading])

  const fullName = useMemo(() => `${userData?.firstName} ${userData?.lastName}`, [userData])

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

  if (!userData) {
    return <EmptyBox />
  }

  return (
    <>
      <div className={styles.personal}>
        <div className={styles.personalAside}>
          <UserAvatar avatarSrc={userData.avatar} fullName={fullName} />
        </div>
        <div className={styles.personalContent}>
          <div className={styles.personalHeading}>
            <strong className={styles.userName}>{fullName}</strong>
            <Chip label={userRole} size="small" />
            <Button onClick={handleProfilePopupOpen} sx={{ ml: 'auto' }}>
              Edit
            </Button>
          </div>
          <ul className={styles.personalInfoList}>
            <li>
              <span className={styles.infoListLabel}>Phone</span>+{userData.phone}
            </li>
            {isDoctor(userData) && (
              <li>
                <span className={styles.infoListLabel}>Institution</span>
                {userData.institution ? userData.institution : '-'}
              </li>
            )}
          </ul>
          <Divider sx={{ mt: '2rem', mb: '1.5rem' }} />
          <Typography sx={{ mb: 2 }} variant="h6">
            Login & Security
          </Typography>
          <ul className={`${styles.personalInfoList} ${styles.fullWidth}`}>
            <li>
              <span className={styles.infoListLabel}>Email</span>
              {userData.email}
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
      {isDoctor(userData) ? (
        <EditDoctorProfilePopup doctorData={userData} handleClose={handleProfilePopupClose} open={profilePopupOpen} />
      ) : (
        <EditCaregiverProfilePopup
          caregiverData={userData}
          handleClose={handleProfilePopupClose}
          open={profilePopupOpen}
        />
      )}
      <EditEmailPopup />
      <ChangePasswordPopup handleClose={handleChangePasswordPopupClose} open={changePasswordPopupOpen} />
    </>
  )
}
