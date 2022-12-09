import { ChevronRightOutlined, PersonAdd } from '@mui/icons-material'
import { Button, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { DoctorInvitePopup } from '~components/Modal/DoctorInvitePopup/doctor-invite-popup'
import { Spinner } from '~components/Spinner/spinner'
import { getRequestedUserName } from '~helpers/get-requested-user-name'
import { useAppDispatch } from '~stores/hooks'
import { useGetProfilePatientsQuery } from '~stores/services/profile.api'
import { setDataAccessHasChanges, useDataAccessHasChanges } from '~stores/slices/data-access.slice'

export const DoctorPatients = () => {
  const dispatch = useAppDispatch()

  const [invitePopupOpen, setInvitePopupOpen] = useState(false)
  const dataAccessHasChanges = useDataAccessHasChanges()

  const {
    data: doctorPatients,
    isLoading: doctorPatientsIsLoading,
    refetch: refetchDoctorPatients,
  } = useGetProfilePatientsQuery()

  useEffect(() => {
    if (dataAccessHasChanges) {
      refetchDoctorPatients()
      dispatch(setDataAccessHasChanges(false))
    }
  }, [dataAccessHasChanges, dispatch, refetchDoctorPatients])

  const handleInvitePopupOpen = () => {
    setInvitePopupOpen(true)
  }

  const handleInvitePopupClose = () => {
    setInvitePopupOpen(false)
  }

  return (
    <>
      <div className="white-box content-md">
        <Grid container spacing={3} sx={{ mb: 1 }}>
          <Grid xs>
            <Typography variant="h5">Patients</Typography>
          </Grid>
          <Grid>
            <Button onClick={handleInvitePopupOpen} startIcon={<PersonAdd />} variant="outlined">
              Invite
            </Button>
          </Grid>
        </Grid>
        <List className="list-divided">
          {doctorPatientsIsLoading ? (
            <Spinner />
          ) : doctorPatients?.length ? (
            doctorPatients.map((patient) => (
              <ListItem
                disablePadding
                key={patient.accessId}
                secondaryAction={
                  <IconButton edge="end">
                    <ChevronRightOutlined />
                  </IconButton>
                }
                sx={{
                  '& .MuiListItemSecondaryAction-root': {
                    pointerEvents: 'none',
                  },
                }}
              >
                <ListItemButton component={NavLink} dense to={`${PageUrls.Patient}/${patient.userId}`}>
                  <ListItemText primary={getRequestedUserName(patient)} secondary="Connected" />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem className="empty-list-item">No patients</ListItem>
          )}
        </List>
      </div>
      <DoctorInvitePopup handleClose={handleInvitePopupClose} open={invitePopupOpen} />
    </>
  )
}
