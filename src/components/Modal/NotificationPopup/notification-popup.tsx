import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { FC, ReactNode } from 'react'

interface LegalPopupProps {
  title?: string
  open: boolean
  handleClose: () => void
  children: ReactNode
}

export const NotificationPopup: FC<LegalPopupProps> = ({ title, children, open, handleClose, ...other }) => (
  <Dialog maxWidth="xs" open={open} {...other}>
    {title && <DialogTitle>{title}</DialogTitle>}
    <DialogContent>{children}</DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Ok</Button>
    </DialogActions>
  </Dialog>
)
