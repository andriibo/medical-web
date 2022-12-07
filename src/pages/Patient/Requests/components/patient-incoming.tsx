import { Button, List, ListItem, ListItemText } from '@mui/material'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { DataAccessDirection, DataAccessStatus } from '~/enums/data-access.enum'
import { getRequestedUserName } from '~helpers/get-requested-user-name'
import { IDataAccessModel } from '~models/data-access.model'
import { useAppDispatch } from '~stores/hooks'
import {
  usePatchPatientDataAccessApproveMutation,
  usePatchPatientDataAccessRefuseMutation,
} from '~stores/services/patient-data-access.api'
import { setDataAccessHasChanges } from '~stores/slices/data-access.slice'

interface PatientIncomingProps {

  patientDataAccess: IDataAccessModel[]
}

export const PatientIncoming: FC<PatientIncomingProps> = ({ patientDataAccess }) => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [approveRequest] = usePatchPatientDataAccessApproveMutation()
  const [refuseRequest] = usePatchPatientDataAccessRefuseMutation()
  const [patchingRequestId, setPatchingRequestId] = useState<string | null>(null)

  const incomingRequests = useMemo(
    () =>
      patientDataAccess
        .filter(
          (data) => data.status === DataAccessStatus.initiated && data.direction === DataAccessDirection.toPatient,
        )
        .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()),
    [patientDataAccess],
  )

  const handleApproveRequest = useCallback(
    async (accessId: string) => {
      try {
        setPatchingRequestId(accessId)

        await approveRequest({ accessId }).unwrap()
        dispatch(setDataAccessHasChanges(true))
        enqueueSnackbar('Request was approved')
      } catch (err) {
        console.error(err)
        setPatchingRequestId(null)
        enqueueSnackbar('Request was not approved', { variant: 'warning' })
      }
    },
    [approveRequest, dispatch, enqueueSnackbar],
  )

  const handleRefuseRequest = useCallback(
    async (accessId: string) => {
      try {
        setPatchingRequestId(accessId)

        await refuseRequest({ accessId }).unwrap()
        enqueueSnackbar('Request was refused')
      } catch (err) {
        console.error(err)
        setPatchingRequestId(null)
        enqueueSnackbar('Request was not refused', { variant: 'warning' })
      }
    },
    [enqueueSnackbar, refuseRequest],
  )

  return (
    <List className="list-divided">
      {incomingRequests?.length ? (
        incomingRequests.map(({ accessId, createdAt, requestedUser }) => (
          <ListItem className={patchingRequestId === accessId ? 'disabled' : ''} key={accessId}>
            <ListItemText secondary={`${dayjs(createdAt).format('MMMM M, YYYY')}`}>
              {getRequestedUserName(requestedUser)}
            </ListItemText>
            <Button onClick={() => handleRefuseRequest(accessId)} sx={{ ml: 2 }}>
              Reject
            </Button>
            <Button onClick={() => handleApproveRequest(accessId)} sx={{ ml: 2 }} variant="contained">
              Accept
            </Button>
          </ListItem>
        ))
      ) : (
        <ListItem className="empty-list-item">No incoming requests</ListItem>
      )}
    </List>
  )
}
