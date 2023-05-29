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
  usePatchDataAccessApproveMutation,
  usePatchDataAccessRefuseMutation,
} from '~stores/services/patient-data-access.api'
import { setDataAccessHasChanges } from '~stores/slices/data-access.slice'

interface DoctorIncomingProps {
  dataAccess: IDataAccessModel[]
}

export const GrantedUserWaitingRoom: FC<DoctorIncomingProps> = ({ dataAccess }) => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [approveRequest] = usePatchDataAccessApproveMutation()
  const [refuseRequest] = usePatchDataAccessRefuseMutation()
  const [patchingRequestId, setPatchingRequestId] = useState<string | null>(null)

  const waitingRequests = useMemo(
    () =>
      dataAccess
        .filter(
          (data) => data.status === DataAccessStatus.initiated && data.direction === DataAccessDirection.fromPatient,
        )
        .sort((a, b) => b.lastInviteSentAt - a.lastInviteSentAt),
    [dataAccess],
  )

  const handleApproveRequest = useCallback(
    async (accessId: string) => {
      try {
        setPatchingRequestId(accessId)

        await approveRequest({ accessId }).unwrap()
        dispatch(setDataAccessHasChanges(true))
        enqueueSnackbar('Request approved')
      } catch (err) {
        console.error(err)
        setPatchingRequestId(null)
        enqueueSnackbar('Request not approved', { variant: 'warning' })
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
      {waitingRequests?.length ? (
        waitingRequests.map(({ accessId, lastInviteSentAt, requestedUser }) => (
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
