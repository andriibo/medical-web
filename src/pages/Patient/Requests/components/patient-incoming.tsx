import { Check, Close } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemText } from '@mui/material'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { btnIconError, btnIconSuccess } from '~/assets/styles/styles-scheme'
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
        .sort((a, b) => b.lastInviteSentAt - a.lastInviteSentAt),
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
        enqueueSnackbar('Request declined')
      } catch (err) {
        console.error(err)
        setPatchingRequestId(null)
        enqueueSnackbar('Request not declined', { variant: 'warning' })
      }
    },
    [enqueueSnackbar, refuseRequest],
  )

  return (
    <List className="list-divided">
      {incomingRequests?.length ? (
        incomingRequests.map(({ accessId, lastInviteSentAt, requestedUser }) => (
          <ListItem className={patchingRequestId === accessId ? 'disabled' : ''} key={accessId}>
            <ListItemText secondary={`${dayjs(lastInviteSentAt * 1000).format('MMMM D, YYYY')}`}>
              {getRequestedUserName(requestedUser)}
            </ListItemText>
            <IconButton
              color="error"
              onClick={() => handleRefuseRequest(accessId)}
              sx={{
                ml: 2,
                ...btnIconError,
              }}
              title="Decline"
            >
              <Close />
            </IconButton>
            <IconButton
              color="success"
              onClick={() => handleApproveRequest(accessId)}
              sx={{
                ml: 2,
                ...btnIconSuccess,
              }}
              title="Approve"
            >
              <Check />
            </IconButton>
          </ListItem>
        ))
      ) : (
        <ListItem className="empty-list-item">No incoming requests</ListItem>
      )}
    </List>
  )
}
