import { Close, PersonAdd } from '@mui/icons-material'
import { Button, IconButton, List, ListItem, ListItemText, Tab, Tabs, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'

import { AccountTab } from '~/enums/account-tab'
import { DoctorInvitePopup } from '~components/Modal/DoctorInvitePopup/doctor-invite-popup'
import { Spinner } from '~components/Spinner/spinner'
import { getRequestedUserName } from '~helpers/get-requested-user-name'
import { useAppDispatch } from '~stores/hooks'
import { usePostDoctorDataAccessInitiateMutation } from '~stores/services/patient-data-access.api'
import { useGetDoctorPatientsQuery } from '~stores/services/profile.api'

export const DoctorPatients = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()

  const [activeTab, setActiveTab] = useState<AccountTab>(AccountTab.personalInfo)
  const [invitePopupOpen, setInvitePopupOpen] = useState(false)

  const {
    data: doctorPatients,
    isLoading: doctorPatientsIsLoading,
    refetch: refetchDoctorPatients,
  } = useGetDoctorPatientsQuery()

  const handleChangeTab = (event: React.SyntheticEvent, value: AccountTab) => {
    setActiveTab(value)
  }

  const handleDeletePatient = (accessId: string) => {
    console.log(accessId)
  }

  const handleInvitePopupOpen = () => {
    setInvitePopupOpen(true)
  }

  const handleInvitePopupClose = () => {
    setInvitePopupOpen(false)
  }

  return (
    <>
      <div className="white-box content-md">
        <Typography variant="h5">My Account</Typography>
        <Grid container spacing={3} sx={{ mb: 1 }}>
          <Grid xs>
            <Tabs className="tabs" onChange={handleChangeTab} value={activeTab}>
              <Tab label="Abnormal" value={AccountTab.personalInfo} />
              <Tab label="Borderline" value={AccountTab.personalInfo} />
              <Tab label="Normal" value={AccountTab.settings} />
            </Tabs>
          </Grid>
          <Grid>
            <Button onClick={handleInvitePopupOpen} startIcon={<PersonAdd />} variant="outlined">
              Invite
            </Button>
          </Grid>
        </Grid>
        <List>
          {doctorPatientsIsLoading ? (
            <Spinner />
          ) : doctorPatients?.length ? (
            doctorPatients.map((patient) => (
              <ListItem
                // className={deletingDiagnosisId === patient.accessId ? 'disabled' : ''}
                key={patient.accessId}
                secondaryAction={
                  <IconButton aria-label="delete" edge="end" onClick={() => handleDeletePatient(patient.accessId)}>
                    <Close />
                  </IconButton>
                }
              >
                <ListItemText primary={getRequestedUserName(patient)} secondary="Connected" />
              </ListItem>
            ))
          ) : (
            <ListItem sx={{ justifyContent: 'center' }}>No patients</ListItem>
          )}
        </List>
      </div>
      <DoctorInvitePopup handleClose={handleInvitePopupClose} open={invitePopupOpen} />
    </>
  )
}
