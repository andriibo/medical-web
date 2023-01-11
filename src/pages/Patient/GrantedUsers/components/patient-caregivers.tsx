import { Clear, MailOutline, Phone } from '@mui/icons-material'
import { IconButton, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'

import { CardBox } from '~components/Card/card-box'
import { Spinner } from '~components/Spinner/spinner'
import { UserAvatar } from '~components/UserAvatar/user-avatar'
import styles from '~pages/Patient/GrantedUsers/patient-granted-users.module.scss'
import { useAppDispatch } from '~stores/hooks'
import { useDeletePatientDataAccessMutation } from '~stores/services/patient-data-access.api'
import { useGetMyCaregiversQuery } from '~stores/services/profile.api'
import { setDataAccessHasChanges, useDataAccessHasChanges } from '~stores/slices/data-access.slice'

export const PatientCaregivers = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()

  const dataAccessHasChanges = useDataAccessHasChanges()

  const {
    data: patientCaregivers,
    isLoading: patientCaregiversIsLoading,
    refetch: refetchPatientCaregivers,
  } = useGetMyCaregiversQuery()

  const [deleteCaregiver] = useDeletePatientDataAccessMutation()
  const [deletingCaregiverId, setDeletingCaregiverId] = useState<string | null>(null)

  const handleRemoveCaregiver = useCallback(
    async (accessId: string) => {
      try {
        await confirm({
          title: 'Remove caregiver?',
          description: 'The caregiver will lost access to your account information.',
          confirmationText: 'Remove',
        })

        setDeletingCaregiverId(accessId)

        await deleteCaregiver({ accessId }).unwrap()
        refetchPatientCaregivers()
        enqueueSnackbar('Caregiver removed')
      } catch (err) {
        console.error(err)
        setDeletingCaregiverId(null)
        if (err) {
          enqueueSnackbar('Caregiver not removed', { variant: 'warning' })
        }
      }
    },
    [confirm, deleteCaregiver, enqueueSnackbar, refetchPatientCaregivers],
  )

  useEffect(() => {
    if (dataAccessHasChanges) {
      refetchPatientCaregivers()
      dispatch(setDataAccessHasChanges(false))
    }
  }, [dataAccessHasChanges, dispatch, refetchPatientCaregivers])

  if (patientCaregiversIsLoading) {
    return <Spinner />
  }

  return (
    <Grid container spacing={3} sx={{ mb: 1 }}>
      {patientCaregivers?.length ? (
        patientCaregivers.map(({ lastName, firstName, phone, email, accessId, avatar }) => (
          <Grid key={lastName} xs={6}>
            <CardBox
              disable={deletingCaregiverId === accessId}
              header={
                <>
                  <UserAvatar avatarSrc={avatar} className={styles.userAvatar} fullName={`${firstName} ${lastName}`} />
                  <Typography variant="subtitle1">
                    {firstName} {lastName}
                  </Typography>
                  <div style={{ marginLeft: 'auto' }} />
                  <IconButton edge="end" onClick={() => handleRemoveCaregiver(accessId)}>
                    <Clear fontSize="inherit" />
                  </IconButton>
                </>
              }
              infoListItems={
                <>
                  <ListItem disableGutters>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText>
                      <a className="simple-link" href={`tel:+${phone}`}>
                        +{phone}
                      </a>
                    </ListItemText>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon>
                      <MailOutline />
                    </ListItemIcon>
                    <ListItemText>
                      <a className="simple-link" href={`mailto:${email}`}>
                        {email}
                      </a>
                    </ListItemText>
                  </ListItem>
                </>
              }
            />
          </Grid>
        ))
      ) : (
        <Grid textAlign="center" xs>
          No caregivers added
        </Grid>
      )}
    </Grid>
  )
}
