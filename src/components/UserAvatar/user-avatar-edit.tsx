import { Edit } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React, { FC, useState } from 'react'

import { AvatarPopup } from '~components/Modal/AvatarPopup/avatar-popup'
import { UserAvatar } from '~components/UserAvatar/user-avatar'

import styles from './user-avatar.module.scss'

interface AvatarProps {
  avatar: string
  fullName: string
}

export const UserAvatarEdit: FC<AvatarProps> = ({ fullName, avatar }) => {
  const [changeAvatarPopupOpen, setChangeAvatarPopupOpen] = useState(false)

  const handleChangeAvatarPopupOpen = () => {
    setChangeAvatarPopupOpen(true)
  }

  const handleChangeAvatarPopupClose = () => {
    setChangeAvatarPopupOpen(false)
  }

  return (
    <>
      <div className={styles.userAvatarHolder}>
        <UserAvatar avatar={avatar} className={styles.userAvatarEdit} fullName={fullName} />
        <IconButton className={styles.userAvatarEditButton} onClick={handleChangeAvatarPopupOpen} size="small">
          <Edit fontSize="inherit" />
        </IconButton>
      </div>
      <AvatarPopup avatar={avatar} handleClose={handleChangeAvatarPopupClose} open={changeAvatarPopupOpen} />
    </>
  )
}
