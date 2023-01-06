import { PersonAdd } from '@mui/icons-material'
import { Button, Tab, Tabs, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { skipToken } from '@reduxjs/toolkit/query'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { PatientTab } from '~/enums/patient-tab.enum'
import { EmergencyContacts } from '~components/EmergencyContacts/emergency-contacts'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { SuggestedContactPopup } from '~components/Modal/SuggestedContactPopup/suggested-contact-popup'
import { PatientTreatment } from '~components/PatientTreatment/patient-treatment'
import { Spinner } from '~components/Spinner/spinner'
import { SuggestedContacts } from '~components/SuggestedContacts/suggested-contacts'
import { TabPanel } from '~components/TabPanel/tab-panel'
import { Thresholds } from '~components/Thresholds/thresholds'
import { GrantedUserPatientInfo } from '~pages/GrantedUser/Patient/components/granted-user-patient-info'
import { useGetPatientProfileQuery } from '~stores/services/profile.api'

import styles from './granted-user-patient.module.scss'

export const GrantedUserPatient = () => {
  const { patientUserId } = useParams() as { patientUserId: string }
  const [activeTab, setActiveTab] = useState<PatientTab>(PatientTab.vitals)
  const [suggestedContactPopupOpen, setSuggestedContactPopupOpen] = useState(false)
  const [hasSuggestedContact, setHasSuggestedContact] = useState(true)

  const { data: patientData, isLoading } = useGetPatientProfileQuery(patientUserId ? { patientUserId } : skipToken)

  const handleChangeTab = (event: React.SyntheticEvent, value: PatientTab) => {
    setActiveTab(value)
  }

  const handleSuggestedContactPopupOpen = () => {
    setSuggestedContactPopupOpen(true)
  }

  const handleSuggestedContactPopupClose = () => {
    setSuggestedContactPopupOpen(false)
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
            <Tab label="Treatment" value={PatientTab.treatment} />
            <Tab label="Emergency contacts" value={PatientTab.emergencyContacts} />
          </Tabs>
          <TabPanel activeTab={activeTab} value={PatientTab.thresholds}>
            <Thresholds patientUserId={patientUserId} />
          </TabPanel>
          <TabPanel activeTab={activeTab} value={PatientTab.treatment}>
            <PatientTreatment patientUserId={patientUserId} />
          </TabPanel>
          <TabPanel activeTab={activeTab} value={PatientTab.emergencyContacts}>
            <SuggestedContacts
              heading={
                <>
                  <Grid container spacing={3} sx={{ mb: 1 }}>
                    <Grid xs>
                      <Typography variant="h5">Suggested by me</Typography>
                    </Grid>
                    <Grid>
                      <Button onClick={handleSuggestedContactPopupOpen} startIcon={<PersonAdd />} variant="outlined">
                        Suggest contact
                      </Button>
                    </Grid>
                  </Grid>
                </>
              }
              mounted={setHasSuggestedContact}
              patientUserId={patientUserId}
            />
            <Grid container spacing={3} sx={{ mb: 1 }}>
              <Grid xs>
                <Typography variant="h5">Existing</Typography>
              </Grid>
              {!hasSuggestedContact && (
                <Grid>
                  <Button onClick={handleSuggestedContactPopupOpen} startIcon={<PersonAdd />} variant="outlined">
                    Suggest contact
                  </Button>
                </Grid>
              )}
            </Grid>
            <EmergencyContacts patientUserId={patientUserId} />
          </TabPanel>
        </div>
      </div>
      <SuggestedContactPopup
        handleClose={handleSuggestedContactPopupClose}
        open={suggestedContactPopupOpen}
        patientUserId={patientUserId}
      />
    </div>
  )
}
