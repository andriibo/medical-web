import { Logout } from '@mui/icons-material'
import { CircularProgress, ListItemIcon, MenuItem } from '@mui/material'
import React, { useState } from 'react'

import { callLogOut } from '~stores/store'

export const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    await callLogOut()

    setIsLoading(false)
  }

  return (
    <MenuItem color="inherit" disabled={isLoading} onClick={handleLogout}>
      <ListItemIcon>
        {isLoading ? <CircularProgress color="inherit" size={20} /> : <Logout fontSize="small" />}
      </ListItemIcon>
      Logout
    </MenuItem>
  )
}
