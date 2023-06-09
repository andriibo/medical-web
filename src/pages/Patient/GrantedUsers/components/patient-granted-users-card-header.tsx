import { Clear } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback } from 'react'

import { UserAvatar } from '~components/UserAvatar/user-avatar'
import { useDeletePatientDataAccessMutation } from '~stores/services/patient-data-access.api'

interface PatientCardHeaderProps {
  accessId: string
  avatar: string | null
  firstName: string
  lastName: string
  role: 'Doctor' | 'Caregiver'
  handleDeletingId: (val: string | null) => void
  handleRefetch: () => void
}

export const PatientGrantedUsersCardHeader: FC<PatientCardHeaderProps> = ({
  accessId,
  avatar,
  firstName,
  lastName,
  role,
  handleDeletingId,
  handleRefetch,
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()

  const [deleteGrantedUser] = useDeletePatientDataAccessMutation()

  const handleRemoveGrantedUser = useCallback(
    async (accessId: string) => {
      try {
        await confirm({
          title: false,
          description: (
            <>
              Are you sure you would like to remove{' '}
              <strong>
                {firstName} {lastName}
              </strong>{' '}
              from your Trusted Care Network?
            </>
          ),
          confirmationText: 'Yes, Remove',
        })

        handleDeletingId(accessId)

        await deleteGrantedUser({ accessId }).unwrap()
        handleRefetch()
        enqueueSnackbar(`${firstName} ${lastName} removed`)
      } catch (err) {
        console.error(err)
        handleDeletingId(null)
        if (err) {
          enqueueSnackbar(`${firstName} ${lastName} not removed`, { variant: 'warning' })
        }
      }
    },
    [confirm, deleteGrantedUser, enqueueSnackbar, handleDeletingId, handleRefetch, role],
  )

  return (
    <>
      <UserAvatar avatar={avatar} firstName={firstName} lastName={lastName} sx={{ mr: '0.75rem' }} />
      <Typography variant="subtitle1">
        {firstName} {lastName}
      </Typography>
      <IconButton edge="end" onClick={() => handleRemoveGrantedUser(accessId)}>
        <Clear fontSize="inherit" />
      </IconButton>
    </>
  )
}
