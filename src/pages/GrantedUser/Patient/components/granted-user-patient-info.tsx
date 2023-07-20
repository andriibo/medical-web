import { Add, InfoOutlined, MailOutline, PersonRemove, PhoneInTalk } from '@mui/icons-material'
import { Box, Button, Divider, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React, { FC, useState } from 'react'

import { PageUrls } from '~/enums/page-urls.enum'
import { useDeletePatient } from '~/hooks/use-delete-patient'
import { useUserRoles } from '~/hooks/use-user-roles'
import { PatientMedications } from '~components/PatientMedications/patient-medications'
import { UserAvatar } from '~components/UserAvatar/user-avatar'
import { getAge } from '~helpers/get-age'
import iconHeight from '~images/icon-height.png'
import iconRx from '~images/icon-rx.png'
import iconWeigher from '~images/icon-weigher.png'
import { IDoctorPatients } from '~models/profie.model'
import { GrantedUserPatientDiagnoses } from '~pages/GrantedUser/Patient/components/granred-user-patient-diagnoses'

import styles from '../granted-user-patient.module.scss'

interface GrantedUserPatientInfoProps {
  patientData: IDoctorPatients
}

export const GrantedUserPatientInfo: FC<GrantedUserPatientInfoProps> = ({
  patientData: { firstName, lastName, email, avatar, gender, dob, weight, height, phone, accessId, userId },
}) => {
  const { isUserRoleDoctor } = useUserRoles()

  const [isMedicationPopupOpen, setIsMedicationPopupOpen] = useState(false)

  const [deletePatient] = useDeletePatient()

  const handleNewMedicationOpen = () => {
    setIsMedicationPopupOpen(true)
  }

  const handleNewMedicationClose = () => {
    setIsMedicationPopupOpen(false)
  }

  return (
    <div className={styles.patientAside}>
      <UserAvatar
        avatar={avatar}
        firstName={firstName}
        lastName={lastName}
        sx={{ width: '120px', m: '0 auto 1rem', fontSize: '3.5rem' }}
      />
      <Typography textAlign="center" variant="h6">
        {firstName} {lastName}
      </Typography>
      <Typography textAlign="center" variant="body1">
        {gender}
      </Typography>
      <Typography textAlign="center" variant="body1">
        {dayjs(dob).format('MMM DD, YYYY')} ({getAge(dob)} years)
      </Typography>
      <Divider sx={{ my: 2 }} />
      <ul className={`${styles.patientInfoList}`}>
        <li>
          <img alt="height icon" src={iconHeight} />
          {height} cm
        </li>
        <li>
          <img alt="weigher icon" src={iconWeigher} />
          {weight} kg
        </li>
      </ul>
      <Divider sx={{ my: 2 }} />
      <GrantedUserPatientDiagnoses patientUserId={userId} />
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 0 }}>
        <div className={styles.patientAsideHeading}>
          <img alt="Rx" className={styles.patientAsideIcon} src={iconRx} />
          <strong className={styles.patientAsideTitle}>Medication</strong>
          {isUserRoleDoctor && (
            <Button onClick={handleNewMedicationOpen} size="small" startIcon={<Add />} variant="outlined">
              Add New
            </Button>
          )}
        </div>
        <PatientMedications
          handlePopupClose={handleNewMedicationClose}
          patientUserId={userId}
          popupOpen={isMedicationPopupOpen}
        />
      </Box>
      <Divider sx={{ my: 2 }} />
      <div className={styles.patientAsideHeading}>
        <InfoOutlined className={styles.patientAsideIcon} />
        <strong className={styles.patientAsideTitle}>Contact info</strong>
      </div>
      <ul className={`${styles.contactList} ${styles.fullWidth}`}>
        <li>
          <a className={styles.contactListLink} href={`tel:${phone}`}>
            <PhoneInTalk />
            {phone}
          </a>
        </li>
        <li>
          <a className={styles.contactListLink} href={`mailto: ${email}`} title={email}>
            <MailOutline />
            <span>{email}</span>
          </a>
        </li>
      </ul>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          color="error"
          onClick={() => deletePatient({ accessId, navigateTo: PageUrls.Patients })}
          startIcon={<PersonRemove />}
          variant="outlined"
        >
          Remove
        </Button>
      </Box>
    </div>
  )
}
