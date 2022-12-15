import { FormControlLabel, FormGroup, Switch, Typography } from '@mui/material'
import React, { useState } from 'react'

export const CaregiverSettings = () => {
  const [settings, setSettings] = useState({
    inApp: true,
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
          control={<Switch checked={settings.inApp} name="inApp" onChange={handleChange} />}
          label="In-App"
        />
        <FormControlLabel
          control={<Switch checked={settings.email} name="email" onChange={handleChange} />}
          label="Email"
        />
      </FormGroup>
    </>
  )
}
