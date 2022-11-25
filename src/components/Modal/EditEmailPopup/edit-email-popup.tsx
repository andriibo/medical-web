import { Check } from '@mui/icons-material'
import { Button, Dialog } from '@mui/material'
import React, { FC, MouseEvent, useCallback, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { UpdateEmailStep } from '~/enums/update-email-step.enum'
import { NewEmailForm } from '~components/Modal/EditEmailPopup/components/new-email-form'
import { VerificationCodeForm } from '~components/Modal/EditEmailPopup/components/verification-code-form'
import { NotificationMessage } from '~components/NotificationMessage/notification-message'

interface EditEmailPopupProps {
  open: boolean
  handleClose: (event: MouseEvent<HTMLElement>, reason: string) => void
}

export const EditEmailPopup: FC<EditEmailPopupProps> = ({ open, handleClose }) => {
  const [emailStep, setEmailStep] = useState<UpdateEmailStep>(UpdateEmailStep.email)

  useEffect(() => {
    if (open) {
      setEmailStep(UpdateEmailStep.email)
    }
  }, [open])

  const handleStep = useCallback((step: UpdateEmailStep) => {
    setEmailStep(step)
  }, [])

  return (
    <>
      <Dialog disableEscapeKeyDown fullWidth maxWidth="xs" onClose={handleClose} open={open} scroll="body">
        {emailStep === UpdateEmailStep.email ? (
          <NewEmailForm handleClose={handleClose} handleStep={handleStep} />
        ) : emailStep === UpdateEmailStep.code ? (
          <VerificationCodeForm handleClose={handleClose} handleStep={handleStep} />
        ) : (
          <NotificationMessage icon={<Check color="success" fontSize="large" />} title="Email updated">
            <Button component={NavLink} replace to={PageUrls.SignIn} variant="outlined">
              Go to login
            </Button>
          </NotificationMessage>
        )}
      </Dialog>
    </>
  )
}
