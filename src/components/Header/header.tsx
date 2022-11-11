import { Logout, Notifications, Settings } from '@mui/icons-material'
import { Avatar, Badge, Button, Divider, IconButton, ListItemIcon, MenuItem, Typography } from '@mui/material'
import { green } from '@mui/material/colors'
import React, { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { DropdownMenu } from '~components/DropdownMenu/dropdown-menu'
import { LogoutButton } from '~components/Header/logout-button'
import { IMainNav } from '~models/main-nav.model'

import styles from './header.module.scss'

const mainNav: IMainNav[] = [
  {
    label: 'Sign In',
    to: '/sign-in',
  },
  {
    label: 'Patient',
    to: '/patient',
  },
]

const user = {
  name: 'John Doe',
  role: 'admin',
}

export const Header = () => {
  const [dropClose, setDropClose] = useState(false)

  const isInitials = false

  const handleDrop = useCallback(
    (val: boolean) => {
      setDropClose(val)
    },
    [dropClose],
  )

  const getInitials = (name: string) => name.split(' ')[0][0] + name.split(' ')[1][0]

  return (
    <header className={styles.header}>
      <NavLink to="/sign-in">Sign In</NavLink>
      <NavLink to="/patient">Patient</NavLink>
      <nav className={styles.nav}>
        {mainNav.map(({ label, to, disabled }) => (
          <NavLink data-disabled={disabled} key={`link-${label}`} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
      <IconButton aria-label="cart">
        <Badge badgeContent={3} color="primary">
          <Notifications />
        </Badge>
      </IconButton>
      <DropdownMenu
        button={
          <Avatar sx={{ bgcolor: green[500], width: 40, height: 40, ml: 2, cursor: 'pointer' }}>
            {isInitials ? getInitials(user.name) : null}
          </Avatar>
        }
        dropClose={dropClose}
        handleDrop={handleDrop}
        menuStyles={{
          '& .MuiPaper-root': {
            width: 250,
          },
        }}
      >
        <div className={styles.profileDrop}>
          <Avatar sx={{ bgcolor: green[500], width: 56, height: 56, m: '0 auto 0.75rem' }} />
          <Typography noWrap variant="subtitle1">
            {user.name}
          </Typography>
          <Typography color="text.secondary" sx={{ textTransform: 'capitalize' }} variant="body2">
            {user.role}
          </Typography>
          <Button color="inherit" disabled variant="outlined">
            Manage your account
          </Button>
        </div>
        <Divider sx={{ mb: 1 }} />
        <MenuItem component={NavLink} disabled onClick={() => handleDrop(true)} to="settings">
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem disabled onClick={() => handleDrop(true)}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
        <LogoutButton />
      </DropdownMenu>
    </header>
  )
}
