import { PersonAdd } from '@mui/icons-material'
import { Button, List, ListItem, Tab, Tabs, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useEffect, useState } from 'react'

import { PatientCategory } from '~/enums/patient-category.enum'
import { InvitePatientPopup } from '~components/Modal/InvitePatientPopup/invite-patient-popup'
import { Spinner } from '~components/Spinner/spinner'
import { sortByName } from '~helpers/sort-by-name'
import { IDoctorPatients } from '~models/profie.model'
import { GrantedUserPatientItem } from '~pages/GrantedUser/Patients/components/granted-user-patient-item'
import { useAppDispatch } from '~stores/hooks'
import { useGetMyPatientsQuery } from '~stores/services/profile.api'
import { setDataAccessHasChanges, useDataAccessHasChanges } from '~stores/slices/data-access.slice'

export const GrantedUserPatients = () => {
  const dispatch = useAppDispatch()
  const dataAccessHasChanges = useDataAccessHasChanges()

  const [activeTab, setActiveTab] = useState<PatientCategory>(PatientCategory.Abnormal)
  const [invitePopupOpen, setInvitePopupOpen] = useState(false)
  const [filteredPatients, setFilteredPatients] = useState<IDoctorPatients[] | null>(null)

  const {
    data: grantedUserPatients,
    isLoading: grantedUserPatientsIsLoading,
    refetch: refetchGrantedUserPatients,
  } = useGetMyPatientsQuery()

  useEffect(() => {
    if (dataAccessHasChanges) {
      refetchGrantedUserPatients()
      dispatch(setDataAccessHasChanges(false))
    }
  }, [dataAccessHasChanges, dispatch, refetchGrantedUserPatients])

  const handleInvitePopupOpen = () => {
    setInvitePopupOpen(true)
  }

  const handleInvitePopupClose = () => {
    setInvitePopupOpen(false)
  }

  const handleChangeTab = (event: React.SyntheticEvent, value: PatientCategory) => {
    setActiveTab(value)
  }

  useEffect(() => {
    if (grantedUserPatients) {
      const filtered = grantedUserPatients.filter((data) => data.category === activeTab)

      setFilteredPatients(sortByName(filtered))
    }
  }, [grantedUserPatients, activeTab])

  return (
    <>
      <div className="white-box content-md">
        <Typography sx={{ mb: 1 }} variant="h5">
          Patients
        </Typography>
        <Grid container spacing={3}>
          <Grid xs>
            <Tabs onChange={handleChangeTab} value={activeTab}>
              <Tab label="Abnormal" value={PatientCategory.Abnormal} />
              <Tab label="Borderline" value={PatientCategory.Borderline} />
              <Tab label="Normal" value={PatientCategory.Normal} />
            </Tabs>
          </Grid>
          <Grid>
            <Button onClick={handleInvitePopupOpen} startIcon={<PersonAdd />} variant="outlined">
              Invite
            </Button>
          </Grid>
        </Grid>
        <List className="list-divided">
          {grantedUserPatientsIsLoading ? (
            <Spinner />
          ) : filteredPatients?.length ? (
            filteredPatients.map((patient) => (
              <GrantedUserPatientItem activeCategory={activeTab} key={patient.userId} patient={patient} />
            ))
          ) : (
            <ListItem className="empty-list-item">No patients in this category</ListItem>
          )}
        </List>
      </div>
      <InvitePatientPopup handleClose={handleInvitePopupClose} open={invitePopupOpen} />
    </>
  )
}
