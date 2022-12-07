import { Clear, LocationCity, MailOutline, PersonAdd, Phone } from '@mui/icons-material'
import { Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'

import { CardBox } from '~components/Card/card-box'
import { PatientInvitePopup } from '~components/Modal/PatientInvitePopup/patient-invite-popup'
import { Spinner } from '~components/Spinner/spinner'
import { useAppDispatch } from '~stores/hooks'
import { useDeletePatientDataAccessMutation } from '~stores/services/patient-data-access.api'
import { useGetPatientDoctorsQuery } from '~stores/services/profile.api'
import { setDataAccessHasChanges, useDataAccessHasChanges } from '~stores/slices/data-access.slice'

export const PatientMd = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()

  const [invitePopupOpen, setInvitePopupOpen] = useState(false)
  const dataAccessHasChanges = useDataAccessHasChanges()

  const {
    data: patientDoctors,
    isLoading: patientDoctorsIsLoading,
    refetch: refetchPatientDoctors,
  } = useGetPatientDoctorsQuery()

  const [deleteDoctor] = useDeletePatientDataAccessMutation()
  const [deletingDoctorId, setDeletingDoctorId] = useState<string | null>(null)

  const handleRemoveDoctor = useCallback(
    async (accessId: string) => {
      try {
        await confirm({
          title: 'Remove doctor?',
          description: 'The doctor will lost access to your account information.',
          confirmationText: 'Remove',
        })

        setDeletingDoctorId(accessId)

        await deleteDoctor({ accessId }).unwrap()
        refetchPatientDoctors()
        enqueueSnackbar('Doctor removed')
      } catch (err) {
        console.error(err)
        setDeletingDoctorId(null)
        if (err) {
          enqueueSnackbar('Doctor was not removed', { variant: 'warning' })
        }
      }
    },
    [confirm, deleteDoctor, enqueueSnackbar, refetchPatientDoctors],
  )

  useEffect(() => {
    if (dataAccessHasChanges) {
      refetchPatientDoctors()
      dispatch(setDataAccessHasChanges(false))
    }
  }, [dataAccessHasChanges, dispatch, refetchPatientDoctors])

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
            <Typography variant="h5">Medical Doctors</Typography>
          </Grid>
          <Grid>
            <Button onClick={handleInvitePopupOpen} startIcon={<PersonAdd />} variant="outlined">
              Invite
            </Button>
          </Grid>
        </Grid>
        {patientDoctorsIsLoading ? (
          <Spinner />
        ) : (
          <Grid container spacing={3} sx={{ mb: 1 }}>
            {patientDoctors?.map(({ lastName, firstName, phone, email, institution, accessId }) => (
              <Grid key={lastName} xs={6}>
                <CardBox
                  disable={deletingDoctorId === accessId}
                  header={
                    <>
                      <Typography variant="subtitle1">
                        {firstName} {lastName}
                      </Typography>
                      <div style={{ marginLeft: 'auto' }} />
                      <IconButton edge="end" onClick={() => handleRemoveDoctor(accessId)}>
                        <Clear fontSize="inherit" />
                      </IconButton>
                    </>
                  }
                >
                  <List
                    sx={{
                      wordWrap: 'break-word',
                      '& .MuiListItem-root': { py: '0.25rem' },
                      '& .MuiListItemIcon-root': { minWidth: '2.125rem', color: '#323232' },
                      '& .MuiListItemText-root': { m: 0 },
                      '& .MuiTypography-root': { fontSize: '0.875rem', m: 0 },
                    }}
                  >
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText>{phone}</ListItemText>
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <MailOutline />
                      </ListItemIcon>
                      <ListItemText>{email}</ListItemText>
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <LocationCity />
                      </ListItemIcon>
                      <ListItemText>{institution}</ListItemText>
                    </ListItem>
                  </List>
                </CardBox>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
      <PatientInvitePopup handleClose={handleInvitePopupClose} open={invitePopupOpen} />
    </>
  )
}
