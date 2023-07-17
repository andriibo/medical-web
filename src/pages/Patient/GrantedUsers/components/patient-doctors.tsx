import Grid from '@mui/material/Unstable_Grid2'
import React, { useEffect, useState } from 'react'

import { CardBox } from '~components/Card/card-box'
import { Spinner } from '~components/Spinner/spinner'
import { PatientGrantedUsersCardHeader } from '~pages/Patient/GrantedUsers/components/patient-granted-users-card-header'
import { PatientGrantedUsersCardListItem } from '~pages/Patient/GrantedUsers/components/patient-granted-users-card-list-item'
import { useAppDispatch } from '~stores/hooks'
import { useGetMyDoctorsQuery } from '~stores/services/profile.api'
import { setDataAccessHasChanges, useDataAccessHasChanges } from '~stores/slices/data-access.slice'

export const PatientDoctors = () => {
  const dispatch = useAppDispatch()
  const dataAccessHasChanges = useDataAccessHasChanges()

  const {
    data: patientDoctors,
    isLoading: patientDoctorsIsLoading,
    refetch: refetchPatientDoctors,
  } = useGetMyDoctorsQuery()

  const [deletingDoctorId, setDeletingDoctorId] = useState<string | null>(null)

  useEffect(() => {
    if (dataAccessHasChanges) {
      refetchPatientDoctors()
      dispatch(setDataAccessHasChanges(false))
    }
  }, [dataAccessHasChanges, dispatch, refetchPatientDoctors])

  if (patientDoctorsIsLoading) {
    return <Spinner />
  }

  return (
    <Grid container spacing={3} sx={{ mb: 1 }}>
      {patientDoctors?.length ? (
        patientDoctors.map(({ lastName, firstName, phone, email, roleLabel, institution, accessId, avatar }) => (
          <Grid key={lastName} xs={6}>
            <CardBox
              disable={deletingDoctorId === accessId}
              header={
                <PatientGrantedUsersCardHeader
                  accessId={accessId}
                  avatar={avatar}
                  firstName={firstName}
                  handleDeletingId={setDeletingDoctorId}
                  handleRefetch={() => refetchPatientDoctors()}
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
          No doctors added
        </Grid>
      )}
    </Grid>
  )
}
