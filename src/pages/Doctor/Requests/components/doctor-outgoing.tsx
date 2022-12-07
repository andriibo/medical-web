import { Button, List, ListItem, ListItemText } from '@mui/material'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { DataAccessDirection, DataAccessStatus } from '~/enums/data-access.enum'
import { getRequestedUserName } from '~helpers/get-requested-user-name'
import { IDataAccessModel } from '~models/data-access.model'
import { useDeleteDataAccessMutation } from '~stores/services/patient-data-access.api'

interface DoctorPendingProps {
  dataAccess: IDataAccessModel[]
}

export const DoctorOutgoing: FC<DoctorPendingProps> = ({ dataAccess }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [deleteRequest] = useDeleteDataAccessMutation()
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null)

  const outgoingRequests = useMemo(
    () =>
      dataAccess
        .filter((data) => data.status !== DataAccessStatus.approved && data.direction === DataAccessDirection.toPatient)
        .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()),
    [dataAccess],
  )

  const handleDeleteRequest = useCallback(
    async (accessId: string) => {
      try {
        setDeletingRequestId(accessId)

        await deleteRequest({ accessId }).unwrap()
        enqueueSnackbar('Invitation withdrawn')
      } catch (err) {
        console.error(err)
        setDeletingRequestId(null)
        enqueueSnackbar('Request was not deleted', { variant: 'warning' })
      }
    },
    [deleteRequest, enqueueSnackbar],
  )

  const isRefuse = (status: string) => status === DataAccessStatus.refused

  return (
    <List className="list-divided">
      {outgoingRequests.length ? (
        outgoingRequests.map(({ accessId, createdAt, requestedUser, status }) => (
          <ListItem className={deletingRequestId === accessId ? 'disabled' : ''} key={accessId}>
            <ListItemText secondary={`${dayjs(createdAt).format('MMMM M, YYYY')}`}>
              {getRequestedUserName(requestedUser)} {isRefuse(status) && <>(Rejected)</>}
            </ListItemText>
            <Button onClick={() => handleDeleteRequest(accessId)}>{isRefuse(status) ? 'Delete' : 'Withdraw'}</Button>
          </ListItem>
        ))
      ) : (
        <ListItem className="empty-list-item">No pending requests</ListItem>
      )}
    </List>
  )
}
