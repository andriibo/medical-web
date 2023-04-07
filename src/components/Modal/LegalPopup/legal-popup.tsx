import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import React, { FC } from 'react'

import { LegalPages } from '~/enums/legal-pages'
import { CookiesPolicy } from '~pages/StaticPages/cookies-policy'
import { PrivacyPolicy } from '~pages/StaticPages/privacy-policy'
import { TermsOfService } from '~pages/StaticPages/terms-of-service'

interface LegalPopupProps {
  page: LegalPages | null
  open: boolean
  handleClose: () => void
}

export const LegalPopup: FC<LegalPopupProps> = ({ page, open, handleClose, ...other }) => {
  if (!page) {
    return null
  }

  return (
    <Dialog maxWidth="lg" open={open} {...other}>
      <DialogContent dividers>
        {page === LegalPages.PrivacyPolicy ? (
          <PrivacyPolicy />
        ) : page === LegalPages.TermsAndConditions ? (
          <TermsOfService />
        ) : page === LegalPages.CookiesPolicy ? (
          <CookiesPolicy />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Ok</Button>
      </DialogActions>
    </Dialog>
  )
}
