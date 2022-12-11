import { Tab, Tabs } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { PatientTab } from '~/enums/patient-tab.enum';
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { PatientTreatment } from '~components/PatientTreatment/patient-treatment';
import { Spinner } from '~components/Spinner/spinner'
import { TabPanel } from '~components/TabPanel/tab-panel';
import { Thresholds } from '~components/Thresholds/thresholds'
import { DoctorPatientInfo } from '~pages/Doctor/Patient/components/doctor-patient-info'
import { useGetDoctorPatientProfileQuery } from '~stores/services/profile.api'

import styles from './doctor-patient.module.scss'

export const DoctorPatient = () => {
  const { patientUserId } = useParams() as { patientUserId: string }
  const [activeTab, setActiveTab] = useState<PatientTab>(PatientTab.treatment)

  const { data: patientData, isLoading } = useGetDoctorPatientProfileQuery(
    patientUserId ? { patientUserId } : skipToken,
  )

  const handleChangeTab = (event: React.SyntheticEvent, value: PatientTab) => {
    setActiveTab(value)
  }

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
        <div>
          <Tabs className="tabs" onChange={handleChangeTab} value={activeTab}>
            <Tab label="Vitals" value={PatientTab.vitals} />
            <Tab label="Thresholds" value={PatientTab.thresholds} />
            <Tab label="Treatment" value={PatientTab.treatment} />
            <Tab label="Emergency contacts" value={PatientTab.emergencyContacts} />
          </Tabs>
          <TabPanel activeTab={activeTab} value={PatientTab.thresholds}>
            <Thresholds patientUserId={patientUserId} />
          </TabPanel>
          <TabPanel activeTab={activeTab} value={PatientTab.treatment}>
            <PatientTreatment patientUserId={patientUserId} />
          </TabPanel>
        </div>
      </div>
    </div>
  )
}
