import Grid from '@mui/material/Unstable_Grid2'
import React, { useEffect, useState } from 'react'

import { CardBox } from '~components/Card/card-box'
import { Spinner } from '~components/Spinner/spinner'
import { PatientGrantedUsersCardHeader } from '~pages/Patient/GrantedUsers/components/patient-granted-users-card-header'
import { PatientGrantedUsersCardListItem } from '~pages/Patient/GrantedUsers/components/patient-granted-users-card-list-item'
import { useAppDispatch } from '~stores/hooks'
import { useGetMyCaregiversQuery } from '~stores/services/profile.api'
import { setDataAccessHasChanges, useDataAccessHasChanges } from '~stores/slices/data-access.slice'

export const PatientCaregivers = () => {
  const dispatch = useAppDispatch()
  const dataAccessHasChanges = useDataAccessHasChanges()

  const {
    data: patientCaregivers,
    isLoading: patientCaregiversIsLoading,
    refetch: refetchPatientCaregivers,
  } = useGetMyCaregiversQuery()

  const [deletingCaregiverId, setDeletingCaregiverId] = useState<string | null>(null)

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
        patientCaregivers.map(({ lastName, firstName, phone, email, roleLabel, accessId, avatar, institution }) => (
          <Grid key={lastName} xs={6}>
            <CardBox
              disable={deletingCaregiverId === accessId}
              header={
                <PatientGrantedUsersCardHeader
                  accessId={accessId}
                  avatar={avatar}
                  firstName={firstName}
                  handleDeletingId={setDeletingCaregiverId}
                  handleRefetch={() => refetchPatientCaregivers()}
                  lastName={lastName}
                  roleLabel={roleLabel}
                />
              }
              infoListItems={<PatientGrantedUsersCardListItem email={email} institution={institution} phone={phone} />}
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
