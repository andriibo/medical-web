import { AccountCircle, Notifications } from '@mui/icons-material'
import { Avatar, Badge, Button, IconButton, ListItemIcon, MenuItem } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { UserRoles } from '~/enums/user-roles.enum'
import { DropdownMenu } from '~components/DropdownMenu/dropdown-menu'
import { LogoutButton } from '~components/Header/logout-button'
import { IMainNav } from '~models/main-nav.model'
import { useUserRole } from '~stores/slices/auth.slice'

import styles from './header.module.scss'

const patientNav: IMainNav[] = [
  {
    label: 'Vitals',
    to: PageUrls.Vitals,
  },
  {
    label: 'Emergency Contacts',
    to: '/emergency-contacts',
    disabled: true,
  },
  {
    label: 'Medical Doctors',
    to: PageUrls.MedicalDoctors,
  },
  {
    label: 'Requests',
    to: PageUrls.Requests,
  },
]

const doctorNav: IMainNav[] = [
  {
    label: 'Patients',
    to: PageUrls.Patients,
  },
  {
    label: 'Requests',
    to: PageUrls.Requests,
  },
]

export const Header = () => {
  const [dropClose, setDropClose] = useState(false)
  const userRole = useUserRole()

  const handleDrop = useCallback((val: boolean) => {
    setDropClose(val)
  }, [])

  return (
    <header className={styles.header}>
      <NavLink className={styles.logo} to="/">
        LIFE ZENZERS
      </NavLink>
      <nav className={styles.nav}>
        {userRole === UserRoles.doctor
          ? doctorNav.map(({ label, to, disabled }) => (
              <NavLink data-disabled={disabled} key={`link-${label}`} to={to}>
                {label}
              </NavLink>
            ))
          : patientNav.map(({ label, to, disabled }) => (
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
        button={<Avatar className={styles.avatar} component={Button} />}
        dropClose={dropClose}
        handleDrop={handleDrop}
        menuStyles={{
          '& .MuiPaper-root': {
            width: 220,
          },
        }}
      >
        <MenuItem component={NavLink} onClick={() => handleDrop(true)} to={PageUrls.MyAccount}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          My account
        </MenuItem>
        <LogoutButton />
      </DropdownMenu>
    </header>
  )
}
