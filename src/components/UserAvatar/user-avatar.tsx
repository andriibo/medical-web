import { Avatar, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import React, { FC, useMemo } from 'react'

import { DEFAULT_AVATAR } from '~constants/constants'
import { getAcronym } from '~helpers/get-acronym'

import styles from './user-avatar.module.scss'

interface AvatarProps {
  fullName: string
  avatar: string
  className?: string
  sx?: SxProps<Theme>
}

export const UserAvatar: FC<AvatarProps> = ({ fullName, avatar, className, sx }) => {
  const avatarSrc = useMemo(() => (avatar.includes(DEFAULT_AVATAR) ? undefined : avatar), [avatar])

  const sxStyles = {
    width: '40px',
    height: 'auto',
    backgroundColor: '#bbb',
    margin: 0,
    fontSize: '1.125rem',
    aspectRatio: '1 / 1',
    ...sx,
  }

  return (
    <Avatar
      className={`UserAvatar-root ${styles.userAvatar} ${className ? className : ''}`}
      src={avatarSrc}
      sx={sxStyles}
    >
      {getAcronym(fullName)}
    </Avatar>
  )
}
