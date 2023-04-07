import { AccountCircle, Notifications } from '@mui/icons-material'
import { Badge, Button, IconButton, ListItemIcon, MenuItem } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { useUserRoles } from '~/hooks/use-user-roles'
import { DropdownMenu } from '~components/DropdownMenu/dropdown-menu'
import { LogoutButton } from '~components/Header/logout-button'
import { UserAvatar } from '~components/UserAvatar/user-avatar'
import { IMainNav } from '~models/main-nav.model'
import { useUser } from '~stores/slices/auth.slice'

import styles from './header.module.scss'

const patientNav: IMainNav[] = [
  {
    label: 'Vitals',
    to: PageUrls.Vitals,
  },
  {
    label: 'Emergency Contacts',
    to: PageUrls.EmergencyContacts,
  },
  {
    label: 'MD & Caregivers',
    to: PageUrls.GrantedUsers,
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
  const user = useUser()
  const { isUserRoleGrantable } = useUserRoles()
  const [dropClose, setDropClose] = useState(false)

  const handleDrop = useCallback((val: boolean) => {
    setDropClose(val)
  }, [])

  return (
    <header className={styles.header}>
      <NavLink className={styles.logo} to="/">
        LIFE ZENZERS
      </NavLink>
      <nav className={styles.nav}>
        {isUserRoleGrantable
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
      <IconButton aria-label="cart" sx={{ mr: '1rem' }}>
        <Badge badgeContent={3} color="primary">
          <Notifications />
        </Badge>
      </IconButton>
      <DropdownMenu
        button={
          <UserAvatar avatar={user.avatar} component={Button} firstName={user.firstName} lastName={user.lastName} />
        }
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
