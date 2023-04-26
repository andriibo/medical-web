import { Typography } from '@mui/material'
import React, { useState } from 'react'

import { LegalPages } from '~/enums/legal-pages.enum'
import { LegalPopup } from '~components/Modal/LegalPopup/legal-popup'

export const SignUpLegal = () => {
  const [legalPopup, setLegalPopup] = useState<LegalPages | null>(null)

  const handleLegalPopupClose = () => {
    setLegalPopup(null)
  }

  return (
    <>
      <Typography sx={{ mb: '1.5rem' }} variant="body2">
        By selecting <strong>Sign Up</strong>, I agree to Zenzers Medical’s{' '}
        <span className="link" onClick={() => setLegalPopup(LegalPages.TermsAndConditions)}>
          Terms and Conditions
        </span>
        ,{' '}
        <span className="link" onClick={() => setLegalPopup(LegalPages.PrivacyPolicy)}>
          Privacy Policy
        </span>{' '}
        and{' '}
        <span className="link" onClick={() => setLegalPopup(LegalPages.CookiesPolicy)}>
          Cookies Policy
        </span>
        .
      </Typography>
      <LegalPopup handleClose={handleLegalPopupClose} open={Boolean(legalPopup)} page={legalPopup} />
    </>
  )
}
