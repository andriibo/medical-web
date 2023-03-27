import { Avatar, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import React, { ElementType, FC, useMemo } from 'react'

import { getAcronym } from '~helpers/get-acronym'

import styles from './user-avatar.module.scss'

interface AvatarProps {
  firstName: string
  lastName: string
  avatar: string | null
  component?: ElementType
  className?: string
  sx?: SxProps<Theme>
}

export const UserAvatar: FC<AvatarProps> = ({ firstName, lastName, avatar, component = 'div', className, sx }) => {
  const avatarSrc = useMemo(() => avatar || undefined, [avatar])

  const sxStyles = {
    width: '40px',
    height: 'auto',
    backgroundColor: '#bbb',
    margin: 0,
    padding: 0,
    minWidth: 0,
    fontSize: '1.125rem',
    aspectRatio: '1 / 1',
    transition: 'opacity 0.3s ease',
    ...sx,
  }

  return (
    <Avatar
      className={`UserAvatar-root ${styles.userAvatar} ${className ? className : ''}`}
      component={component}
      src={avatarSrc}
      sx={sxStyles}
    >
      {getAcronym(firstName, lastName)}
    </Avatar>
  )
}
