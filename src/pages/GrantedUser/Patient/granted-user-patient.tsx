import { Tab, Tabs } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { PatientTab } from '~/enums/patient-tab.enum'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { Spinner } from '~components/Spinner/spinner'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { Thresholds } from '~components/Thresholds/thresholds'
import { GrantedUserPatientEmergencyContacts } from '~pages/GrantedUser/Patient/components/granted-user-patient-emergency-contacts'
import { GrantedUserPatientInfo } from '~pages/GrantedUser/Patient/components/granted-user-patient-info'
import { GrantedUserPatientVitals } from '~pages/GrantedUser/Patient/components/granted-user-patient-vitals'
import { useGetPatientProfileQuery } from '~stores/services/profile.api'

import styles from './granted-user-patient.module.scss'

export const GrantedUserPatient = () => {
  const { patientUserId } = useParams() as { patientUserId: string }
  const [activeTab, setActiveTab] = useState<PatientTab>(PatientTab.vitals)

  const { data: patientData, isLoading } = useGetPatientProfileQuery(patientUserId ? { patientUserId } : skipToken)

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
        <GrantedUserPatientInfo patientData={patientData} />
        <div className={styles.patientContent}>
          <Tabs className="tabs" onChange={handleChangeTab} value={activeTab}>
            <Tab label="Vitals" value={PatientTab.vitals} />
            <Tab label="Thresholds" value={PatientTab.thresholds} />
            <Tab label="Emergency contacts" value={PatientTab.emergencyContacts} />
          </Tabs>
          <TabPanel activeTab={activeTab} value={PatientTab.vitals}>
            <GrantedUserPatientVitals patientUserId={patientUserId} />
          </TabPanel>
          <TabPanel activeTab={activeTab} value={PatientTab.thresholds}>
            <Thresholds patientUserId={patientUserId} />
          </TabPanel>
          <TabPanel activeTab={activeTab} value={PatientTab.emergencyContacts}>
            <GrantedUserPatientEmergencyContacts patientUserId={patientUserId} />
          </TabPanel>
        </div>
      </div>
    </div>
  )
}
