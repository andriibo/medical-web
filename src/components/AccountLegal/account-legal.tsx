import { ChevronRight } from '@mui/icons-material'
import { List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import React, { useState } from 'react'

import { LegalPages } from '~/enums/legal-pages'
import { LegalPopup } from '~components/Modal/LegalPopup/legal-popup'
import { getObjectKeys } from '~helpers/get-object-keys'

export const AccountLegal = () => {
  const [legalPopup, setLegalPopup] = useState<LegalPages | null>(null)

  const handleLegalPopupClose = () => {
    setLegalPopup(null)
  }

  return (
    <>
      <Typography sx={{ mb: 0, mt: 2 }} variant="h6">
        Legal
      </Typography>
      <List className="list-divided">
        {getObjectKeys(LegalPages).map((page) => (
          <ListItem disablePadding key={page}>
            <ListItemButton onClick={() => setLegalPopup(LegalPages[page])}>
              <ListItemText primary={LegalPages[page]} />
              <ChevronRight sx={{ opacity: 0.5 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <LegalPopup handleClose={handleLegalPopupClose} open={Boolean(legalPopup)} page={legalPopup} />
    </>
  )
}
