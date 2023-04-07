import { ChevronRight } from '@mui/icons-material'
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { getRequestedUserName } from '~helpers/get-requested-user-name'

export const GrantedUserSettings = () => {
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
      <Box sx={{ mb: 2 }}>
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
      </Box>
      <Typography sx={{ mb: 0 }} variant="h6">
        Legal
      </Typography>
      <List className="list-divided">
        <ListItem disablePadding>
          <ListItemButton component={NavLink} to={PageUrls.PrivacyPolicy}>
            <ListItemText primary="Privacy Policy" />
            <ChevronRight color="disabled" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={NavLink} to={PageUrls.TermsOfService}>
            <ListItemText primary="Terms and Conditions" />
            <ChevronRight />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={NavLink} to={PageUrls.CookiesPolicy}>
            <ListItemText primary="Cookies Policy" />
            <ChevronRight />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  )
}
