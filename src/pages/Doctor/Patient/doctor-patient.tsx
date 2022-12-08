import { skipToken } from '@reduxjs/toolkit/query'
import React from 'react'
import { useParams } from 'react-router-dom'

import { EmptyBox } from '~components/EmptyBox/empty-box'
import { Spinner } from '~components/Spinner/spinner'
import { DoctorPatientInfo } from '~pages/Doctor/Patient/components/doctor-patient-info'
import { useGetDoctorPatientProfileQuery } from '~stores/services/profile.api'

import styles from './doctor-patient.module.scss'

export const DoctorPatient = () => {
  const { patientUserId } = useParams()

  const { data: patientData, isLoading } = useGetDoctorPatientProfileQuery(
    patientUserId ? { patientUserId } : skipToken,
  )

  if (isLoading) {
    return <Spinner />
  }

  if (!patientData) {
    return <EmptyBox />
  }

  return (
    <div className="white-box content-lg">
      <div className={styles.patientContainer}>
        <DoctorPatientInfo patientData={patientData} />
        <div>Patient {patientUserId}</div>
      </div>
    </div>
  )
}
