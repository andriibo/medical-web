import { Dialog } from '@mui/material'
import React, { useEffect } from 'react'

import { UpdateEmailStep } from '~/enums/update-email-step.enum'
import { NewEmailForm } from '~components/Modal/EditEmailPopup/components/new-email-form'
import { VerificationCodeForm } from '~components/Modal/EditEmailPopup/components/verification-code-form'
import { useAppDispatch } from '~stores/hooks'
import { setEditEmailStep, useEditEmailPopupOpen, useEditEmailStep } from '~stores/slices/edit-email.slice'

export const EditEmailPopup = () => {
  const dispatch = useAppDispatch()
  const emailStep = useEditEmailStep()
  const editEmailPopupOpen = useEditEmailPopupOpen()

  useEffect(() => {
    if (editEmailPopupOpen) {
      dispatch(setEditEmailStep(UpdateEmailStep.email))
    }
  }, [dispatch, editEmailPopupOpen])

  return (
    <>
      <Dialog disableEscapeKeyDown fullWidth maxWidth="xs" open={editEmailPopupOpen} scroll="body">
        {emailStep === UpdateEmailStep.email ? (
          <NewEmailForm />
        ) : emailStep === UpdateEmailStep.code ? (
          <VerificationCodeForm />
        ) : null}
      </Dialog>
    </>
  )
}
