import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { SnackbarKey, useSnackbar } from 'notistack'
import React from 'react'

export const SnackbarCloseButton = ({ snackbarId }: { snackbarId: SnackbarKey }) => {
  const { closeSnackbar } = useSnackbar()

  return (
    <IconButton aria-label="close" color="inherit" onClick={() => closeSnackbar(snackbarId)} sx={{ p: 0.5 }}>
      <Close />
    </IconButton>
  )
}
