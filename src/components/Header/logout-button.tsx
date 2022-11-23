import { Logout } from '@mui/icons-material'
import { ListItemIcon, MenuItem } from '@mui/material'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { useAppDispatch } from '~stores/hooks'
import { clearPersist } from '~stores/slices/auth.slice'

export const LogoutButton = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
    await dispatch(clearPersist())

    navigate(PageUrls.SignIn, { replace: true, state: undefined })
  }, [dispatch, navigate])

  return (
    <MenuItem color="inherit" onClick={handleLogout}>
      <ListItemIcon>
        <Logout fontSize="small" />
      </ListItemIcon>
      Logout
    </MenuItem>
  )
}
