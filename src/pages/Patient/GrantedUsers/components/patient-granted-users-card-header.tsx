import { Clear } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback } from 'react'

import { UserAvatar } from '~components/UserAvatar/user-avatar'
import { useDeletePatientDataAccessMutation } from '~stores/services/patient-data-access.api'

interface PatientCardHeaderProps {
  accessId: string
  avatar: string
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
          title: `Remove ${role.toLowerCase()}?`,
          description: `The ${role.toLowerCase()} will lost access to your account information.`,
          confirmationText: 'Remove',
        })

        handleDeletingId(accessId)

        await deleteGrantedUser({ accessId }).unwrap()
        handleRefetch()
        enqueueSnackbar(`${role} removed`)
      } catch (err) {
        console.error(err)
        handleDeletingId(null)
        if (err) {
          enqueueSnackbar(`${role} not removed`, { variant: 'warning' })
        }
      }
    },
    [confirm, deleteGrantedUser, enqueueSnackbar, handleDeletingId, handleRefetch, role],
  )

  return (
    <>
      <UserAvatar avatar={avatar} fullName={`${firstName} ${lastName}`} sx={{ mr: '0.75rem' }} />
      <Typography variant="subtitle1">
        {firstName} {lastName}
      </Typography>
      <div style={{ marginLeft: 'auto' }} />
      <IconButton edge="end" onClick={() => handleRemoveGrantedUser(accessId)}>
        <Clear fontSize="inherit" />
      </IconButton>
    </>
  )
}
