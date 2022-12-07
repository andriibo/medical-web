import { Close, PersonAdd } from '@mui/icons-material'
import { Button, IconButton, List, ListItem, ListItemText, Tab, Tabs, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'

import { AccountTab } from '~/enums/account-tab.enum'
import { DoctorInvitePopup } from '~components/Modal/DoctorInvitePopup/doctor-invite-popup'
import { Spinner } from '~components/Spinner/spinner'
import { getRequestedUserName } from '~helpers/get-requested-user-name'
import { useAppDispatch } from '~stores/hooks'
import { useDeleteDataAccessMutation } from '~stores/services/patient-data-access.api'
import { useGetProfilePatientsQuery } from '~stores/services/profile.api'
import { setDataAccessHasChanges, useDataAccessHasChanges } from '~stores/slices/data-access.slice'

export const DoctorPatients = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()

  const [activeTab, setActiveTab] = useState<AccountTab>(AccountTab.personalInfo)
  const [invitePopupOpen, setInvitePopupOpen] = useState(false)
  const dataAccessHasChanges = useDataAccessHasChanges()

  const [deletePatient] = useDeleteDataAccessMutation()
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null)

  const {
    data: doctorPatients,
    isLoading: doctorPatientsIsLoading,
    refetch: refetchDoctorPatients,
  } = useGetProfilePatientsQuery()

  const handleChangeTab = (event: React.SyntheticEvent, value: AccountTab) => {
    setActiveTab(value)
  }

  const handleRemovePatient = useCallback(
    async (accessId: string) => {
      try {
        await confirm({
          title: 'Remove patient?',
          description: 'You will lose access to patient data.',
          confirmationText: 'Remove',
        })

        setDeletingPatientId(accessId)

        await deletePatient({ accessId }).unwrap()
        refetchDoctorPatients()
        enqueueSnackbar('Patient removed')
      } catch (err) {
        console.error(err)
        setDeletingPatientId(null)
        if (err) {
          enqueueSnackbar('Patient was not removed', { variant: 'warning' })
        }
      }
    },
    [confirm, deletePatient, enqueueSnackbar, refetchDoctorPatients],
  )

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
        <Typography variant="h5">My Account</Typography>
        <Grid container spacing={3} sx={{ mb: 1 }}>
          <Grid xs>
            <Tabs onChange={handleChangeTab} value={activeTab}>
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
        <List className="list-divided">
          {doctorPatientsIsLoading ? (
            <Spinner />
          ) : doctorPatients?.length ? (
            doctorPatients.map((patient) => (
              <ListItem
                className={deletingPatientId === patient.accessId ? 'disabled' : ''}
                key={patient.accessId}
                secondaryAction={
                  <IconButton aria-label="delete" edge="end" onClick={() => handleRemovePatient(patient.accessId)}>
                    <Close />
                  </IconButton>
                }
              >
                <ListItemText primary={getRequestedUserName(patient)} secondary="Connected" />
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
