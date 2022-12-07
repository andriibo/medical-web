import { Check } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'
import { NavLink } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { NotificationMessage } from '~components/NotificationMessage/notification-message'

export const ForgotPasswordSuccess = () => (
  <NotificationMessage icon={<Check color="success" fontSize="large" />} title="Password reset">
    <Button component={NavLink} replace to={PageUrls.SignIn} variant="outlined">
      Go to login
    </Button>
  </NotificationMessage>
)
