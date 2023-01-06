import { Edit } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import React, { FC, useState } from 'react'

import { AvatarPopup } from '~components/Modal/AvatarPopup/avatar-popup'
import { getAcronym } from '~helpers/get-acronym'

import styles from './user-avatar.module.scss'

interface AvatarProps {
  fullName: string
  avatarSrc: string
  editable?: boolean
  className?: string
}

export const UserAvatar: FC<AvatarProps> = ({ fullName, avatarSrc, editable, className }) => {
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
        <Avatar className={`${styles.userAvatar} ${className}`} src={avatarSrc}>
          {getAcronym(fullName)}
        </Avatar>
        {editable && (
          <IconButton className={styles.userAvatarEdit} onClick={handleChangeAvatarPopupOpen} size="small">
            <Edit fontSize="inherit" />
          </IconButton>
        )}
      </div>
      {editable && <AvatarPopup handleClose={handleChangeAvatarPopupClose} open={changeAvatarPopupOpen} />}
    </>
  )
}
