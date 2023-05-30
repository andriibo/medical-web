import { Close, Refresh } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { btnIconError, btnIconSuccess } from '~/assets/styles/styles-scheme'
import { DataAccessDirection, DataAccessStatus } from '~/enums/data-access.enum'
import { getRequestedUserName } from '~helpers/get-requested-user-name'
import { IDataAccessModel } from '~models/data-access.model'
import { useDeleteDataAccessMutation, usePatchDataAccessResendMutation } from '~stores/services/patient-data-access.api'

interface DoctorPendingProps {
  dataAccess: IDataAccessModel[]
}

export const GrantedUserOutgoing: FC<DoctorPendingProps> = ({ dataAccess }) => {
  const { enqueueSnackbar } = useSnackbar()

  const [loadingRequestId, setLoadingRequestId] = useState<string | null>(null)

  const [deleteRequest] = useDeleteDataAccessMutation()
  const [resendRequest] = usePatchDataAccessResendMutation()

  const outgoingRequests = useMemo(
    () =>
      dataAccess
        .filter((data) => data.status !== DataAccessStatus.approved && data.direction === DataAccessDirection.toPatient)
        .sort((a, b) => b.lastInviteSentAt - a.lastInviteSentAt),
    [dataAccess],
  )

  const handleDeleteRequest = useCallback(
    async (accessId: string) => {
      try {
        setLoadingRequestId(accessId)

        await deleteRequest({ accessId }).unwrap()
        setLoadingRequestId(null)
        enqueueSnackbar('Invitation withdrawn')
      } catch (err) {
        console.error(err)
        setLoadingRequestId(null)
        enqueueSnackbar('Invitation not withdrawn', { variant: 'warning' })
      }
    },
    [deleteRequest, enqueueSnackbar],
  )

  const handleResendRequest = useCallback(
    async (accessId: string) => {
      try {
        setLoadingRequestId(accessId)

        await resendRequest({ accessId }).unwrap()
        setLoadingRequestId(null)
        enqueueSnackbar('Invitation resent')
      } catch (err) {
        console.error(err)
        setLoadingRequestId(null)
        enqueueSnackbar('Invitation not resent', { variant: 'warning' })
      }
    },
    [resendRequest, enqueueSnackbar],
  )

  const isRefuse = (status: string) => status === DataAccessStatus.refused

  return (
    <List className="list-divided">
      {outgoingRequests.length ? (
        outgoingRequests.map(({ accessId, lastInviteSentAt, requestedUser, status }) => (
          <ListItem className={loadingRequestId === accessId ? 'disabled' : ''} key={accessId}>
            <ListItemText
              secondary={
                <>
                  {dayjs(lastInviteSentAt * 1000).format('MMMM D, YYYY')}
                  {isRefuse(status) && (
                    <>
                      {' • '}
                      <Typography color={red[600]} display="inline" textTransform="uppercase" variant="subtitle2">
                        Declined
                      </Typography>
                    </>
                  )}
                </>
              }
            >
              {getRequestedUserName(requestedUser)}
            </ListItemText>
            <IconButton
              color="error"
              onClick={() => handleDeleteRequest(accessId)}
              sx={{
                ml: 2,
                ...btnIconError,
              }}
              title="Withdraw"
            >
              <Close />
            </IconButton>
            <IconButton
              color="success"
              onClick={() => handleResendRequest(accessId)}
              sx={{
                ml: 2,
                ...btnIconSuccess,
              }}
              title="Resend"
            >
              <Refresh />
            </IconButton>
          </ListItem>
        ))
      ) : (
        <ListItem className="empty-list-item">No outgoing requests</ListItem>
      )}
    </List>
  )
}
