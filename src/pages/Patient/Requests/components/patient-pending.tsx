import { Close } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { btnIconError } from '~/assets/styles/styles-scheme'
import { DataAccessDirection, DataAccessStatus } from '~/enums/data-access.enum'
import { getRequestedUserName } from '~helpers/get-requested-user-name'
import { IDataAccessModel } from '~models/data-access.model'
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
        .sort((a, b) => b.lastInviteSentAt - a.lastInviteSentAt),
    [patientDataAccess],
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
        enqueueSnackbar('Invitation not withdrawn', { variant: 'warning' })
      }
    },
    [deleteRequest, enqueueSnackbar],
  )

  const isRefuse = (status: string) => status === DataAccessStatus.refused

  return (
    <List className="list-divided">
      {pendingRequests.length ? (
        pendingRequests.map(({ accessId, lastInviteSentAt, requestedUser, status }) => (
          <ListItem className={deletingRequestId === accessId ? 'disabled' : ''} key={accessId}>
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
          </ListItem>
        ))
      ) : (
        <ListItem className="empty-list-item">No pending requests</ListItem>
      )}
    </List>
  )
}
