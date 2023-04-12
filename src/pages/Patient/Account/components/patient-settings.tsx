import { FormControlLabel, FormGroup, Switch, Typography } from '@mui/material'
import React, { useState } from 'react'

import { AccountLegal } from '~components/AccountLegal/account-legal'

export const PatientSettings = () => {
  const [settings, setSettings] = useState({
    inApp: false,
    email: false,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    })
  }

  return (
    <>
      <Typography sx={{ mb: 2 }} variant="h6">
        Notifications
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={settings.inApp} disabled name="inApp" onChange={handleChange} />}
          label="In-App"
        />
        <FormControlLabel
          control={<Switch checked={settings.email} disabled name="email" onChange={handleChange} />}
          label="Email"
        />
      </FormGroup>
      <AccountLegal />
    </>
  )
}
