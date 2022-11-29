import { Button, Divider, List, ListItem, ListItemText } from '@mui/material'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { DataAccessDirection, DataAccessStatus } from '~/enums/data-access.enum'
import { getRequestedUserName } from '~helpers/get-requested-user-name'
import { IDataAccessModel } from '~models/data-access.model'
import { useAppDispatch } from '~stores/hooks'
import {
  useDeletePatientDataAccessMutation,
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
  const [deleteRequest] = useDeletePatientDataAccessMutation()
  const [approveRequest] = usePatchPatientDataAccessApproveMutation()
  const [refuseRequest] = usePatchPatientDataAccessRefuseMutation()
  const [patchingRequestId, setPatchingRequestId] = useState<string | null>(null)

  const pendingRequests = useMemo(
    () =>
      patientDataAccess
        .filter(
          (data) => data.status === DataAccessStatus.initiated && data.direction === DataAccessDirection.toPatient,
        )
        .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()),
    [patientDataAccess],
  )

  const handleDeleteRequest = useCallback(async (accessId: string) => {
    try {
      setPatchingRequestId(accessId)

      await deleteRequest({ accessId }).unwrap()
      enqueueSnackbar('Request was deleted')
    } catch (err) {
      console.error(err)
      setPatchingRequestId(null)
      enqueueSnackbar('Request was not deleted', { variant: 'warning' })
    }
  }, [])

  const handleApproveRequest = useCallback(async (accessId: string) => {
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
  }, [])

  const handleRefuseRequest = useCallback(async (accessId: string) => {
    try {
      setPatchingRequestId(accessId)

      await refuseRequest({ accessId }).unwrap()
      enqueueSnackbar('Request was refused')
    } catch (err) {
      console.error(err)
      setPatchingRequestId(null)
      enqueueSnackbar('Request was not refused', { variant: 'warning' })
    }
  }, [])

  const isRefuse = (status: string) => status === DataAccessStatus.refused

  return (
    <List>
      {pendingRequests?.length ? (
        pendingRequests.map(({ accessId, createdAt, requestedUser, status }) => (
          <>
            <ListItem className={patchingRequestId === accessId ? 'disabled' : ''} key={accessId}>
              <ListItemText secondary={`${dayjs(createdAt).format('MMMM M, YYYY')}`}>
                {getRequestedUserName(requestedUser)} {isRefuse(status) && '(Rejected)'}
              </ListItemText>
              {isRefuse(status) ? (
                <Button onClick={() => handleDeleteRequest(accessId)} sx={{ ml: 2 }}>
                  Delete
                </Button>
              ) : (
                <>
                  <Button onClick={() => handleRefuseRequest(accessId)} sx={{ ml: 2 }}>
                    Reject
                  </Button>
                  <Button onClick={() => handleApproveRequest(accessId)} sx={{ ml: 2 }} variant="contained">
                    Accept
                  </Button>
                </>
              )}
            </ListItem>
            <Divider />
          </>
        ))
      ) : (
        <ListItem sx={{ justifyContent: 'center' }}>No incoming requests</ListItem>
      )}
    </List>
  )
}
