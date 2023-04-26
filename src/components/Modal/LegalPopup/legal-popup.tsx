import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import React, { FC } from 'react'

import { LegalPages } from '~/enums/legal-pages.enum'
import { CookiesPolicy } from '~pages/StaticPages/cookies-policy'
import { PrivacyPolicy } from '~pages/StaticPages/privacy-policy'
import { TermsAndConditions } from '~pages/StaticPages/terms-and-conditions'

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
          <TermsAndConditions />
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
