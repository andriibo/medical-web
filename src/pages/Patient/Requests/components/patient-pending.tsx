import { Button, Divider, List, ListItem, ListItemText } from '@mui/material'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { DataAccessDirection, DataAccessStatus } from '~/enums/data-access.enum'
import { IDataAccessModel, IDataAccessUser } from '~models/data-access.model'
import { useDeletePatientDataAccessMutation } from '~stores/services/patient-data-access.api'

interface PatientPendingProps {
  patientDataAccess: IDataAccessModel[]
}

export const PatientPending: FC<PatientPendingProps> = ({ patientDataAccess }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [deleteRequest] = useDeletePatientDataAccessMutation()
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null)

  const pendingRequests = useMemo(
    () =>
      patientDataAccess
        .filter(
          (data) => data.status !== DataAccessStatus.approved && data.direction === DataAccessDirection.fromPatient,
        )
        .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()),
    [patientDataAccess],
  )

  const getUserName = (user: IDataAccessUser) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }

    return user.email
  }

  const handleDeleteRequest = useCallback(async (accessId: string) => {
    try {
      setDeletingRequestId(accessId)

      await deleteRequest({ accessId }).unwrap()
      enqueueSnackbar('Request was deleted')
    } catch (err) {
      console.error(err)
      setDeletingRequestId(null)
      enqueueSnackbar('Request was not deleted', { variant: 'warning' })
    }
  }, [])

  const isRefuse = (status: string) => status === DataAccessStatus.refused

  return (
    <List>
      {pendingRequests.length ? (
        pendingRequests.map(({ accessId, createdAt, requestedUser, status }) => (
          <>
            <ListItem className={deletingRequestId === accessId ? 'disabled' : ''} key={accessId}>
              <ListItemText secondary={`${dayjs(createdAt).format('MMMM M, YYYY')}`}>
                {getUserName(requestedUser)} {isRefuse(status) && <>(Rejected)</>}
              </ListItemText>
              <Button onClick={() => handleDeleteRequest(accessId)}>{isRefuse(status) ? 'Delete' : 'Withdraw'}</Button>
            </ListItem>
            <Divider />
          </>
        ))
      ) : (
        <ListItem sx={{ justifyContent: 'center' }}>No pending requests</ListItem>
      )}
    </List>
  )
}
