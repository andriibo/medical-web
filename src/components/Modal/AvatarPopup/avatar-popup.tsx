import { HighlightOff } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useMemo, useRef, useState } from 'react'
import AvatarEditor, { AvatarEditorProps } from 'react-avatar-editor'
import { FileError, useDropzone } from 'react-dropzone'

import { DEFAULT_AVATAR } from '~constants/constants'
import { useDeleteAvatarMutation, usePostAvatarMutation } from '~stores/services/profile.api'

import styles from './avatar-popup.module.scss'

interface IAvatarInitialSettings extends AvatarEditorProps {
  size: number
  scalePercent: number
  scaleMax: number
  scaleMin: number
  scaleStep: number
  maxSize: number
}

const avatarInitialSettings: IAvatarInitialSettings = {
  border: 20,
  borderRadius: 100,
  color: [0, 0, 0, 0.6],
  image: '',
  rotate: 0,
  scale: 1.6,
  size: 200,
  scalePercent: 20,
  scaleMax: 6,
  scaleMin: 0.5,
  scaleStep: 0.01,
  maxSize: 1048576,
}

interface AvatarPopupProps {
  avatar: string | null
  open: boolean
  handleClose: () => void
}

export const AvatarPopup: FC<AvatarPopupProps> = ({ avatar, open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar()
  const avatarEditor = useRef<AvatarEditor | null>(null)
  const [avatarSettings, setAvatarSettings] = useState(avatarInitialSettings)
  const [files, setFiles] = useState<File[]>([])

  const [updateAvatar, { isLoading: updateAvatarIsLoading }] = usePostAvatarMutation()
  const [deleteAvatar, { isLoading: deleteAvatarIsLoading }] = useDeleteAvatarMutation()

  const handleDrop = (dropped: File[]) => {
    setAvatarSettings({ ...avatarSettings, image: dropped[0] })
  }

  const removeAvatar = useCallback(() => {
    setFiles([])
    setAvatarSettings({
      ...avatarSettings,
      image: '',
      scale: avatarInitialSettings.scale,
      scalePercent: avatarInitialSettings.scalePercent,
    })
  }, [avatarSettings])

  const closeAndClear = useCallback(() => {
    handleClose()
    setTimeout(() => {
      removeAvatar()
    }, 300)
  }, [handleClose, removeAvatar])

  const handleDeleteAvatar = async () => {
    await deleteAvatar()

    closeAndClear()

    enqueueSnackbar('Avatar removed')
  }

  const handleChangeAvatar = useCallback(async () => {
    if (avatarEditor.current && files.length) {
      const avatarData = avatarEditor.current.getImageScaledToCanvas().toDataURL()

      try {
        const formData = new FormData()
        const base64Response = await fetch(avatarData)
        const blob = await base64Response.blob()

        formData.append('file', blob)

        await updateAvatar(formData).unwrap()

        closeAndClear()
        enqueueSnackbar('Avatar changed')
      } catch (err) {
        console.error(err)
      }
    }
  }, [closeAndClear, enqueueSnackbar, files, updateAvatar])

  const getDropzoneErrors = (errors: FileError[]): string => {
    if (errors.some((error) => error.code === 'file-invalid-type')) {
      return 'We do not accept this type of file. Recommended: JPEG, JPG, GIF, WEBP or PNG'
    }

    if (errors.some((error) => error.code === 'file-too-large')) {
      return 'The file is too large (max size is 1 MB)'
    }

    let response = ''

    for (let i = 0; i < errors.length; i += 1) {
      response += errors[i].message.replace('/*', '')
    }

    return response
  }

  const { getRootProps, getInputProps, isDragAccept, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    maxSize: avatarInitialSettings.maxSize,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      )
      handleDrop(acceptedFiles)
    },
  })

  const handleScales = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scale = parseFloat(e.target.value)
    const scalePercent = ((scale - avatarSettings.scaleMin) / (avatarSettings.scaleMax - avatarSettings.scaleMin)) * 100

    setAvatarSettings({ ...avatarSettings, scale, scalePercent })
  }

  const dropClassName = useMemo(() => {
    let className = styles.dropZone

    className += isDragAccept ? ` ${styles.onDrop}` : ''
    className += isDragReject || fileRejections.length ? ` ${styles.onReject}` : ''

    return className
  }, [isDragAccept, isDragReject, fileRejections])

  return (
    <Dialog fullWidth maxWidth="xs" onClose={closeAndClear} open={open} scroll="body">
      <DialogTitle>Choose Image</DialogTitle>
      <DialogContent>
        {!files.length ? (
          <div {...getRootProps({ className: dropClassName })}>
            <input {...getInputProps()} />
            <div>
              <Typography variant="body1">
                Drag and drop image file here, <br /> or click to select file
              </Typography>
              {Boolean(fileRejections.length) && (
                <Typography color="red" mt={1} variant="body1">
                  {getDropzoneErrors(fileRejections[0].errors)}
                </Typography>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.cropContainer}>
            {files.length > 0 && (
              <IconButton className={styles.userAvatarEdit} onClick={removeAvatar}>
                <HighlightOff fontSize="inherit" />
              </IconButton>
            )}
            <AvatarEditor
              border={avatarSettings.border}
              borderRadius={avatarSettings.borderRadius}
              color={avatarSettings.color}
              height={avatarSettings.size}
              image={avatarSettings.image}
              ref={avatarEditor}
              rotate={avatarSettings.rotate}
              scale={avatarSettings.scale}
              width={avatarSettings.size}
            />
            <input
              max={avatarSettings.scaleMax}
              min={avatarSettings.scaleMin}
              name="scale"
              onChange={(e) => handleScales(e)}
              step={avatarSettings.scaleStep}
              style={{ backgroundSize: `${avatarSettings.scalePercent}% 100%` }}
              type="range"
              value={avatarSettings.scale}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '0 1.5rem 1rem' }}>
        {avatar && (
          <LoadingButton
            color="error"
            disabled={updateAvatarIsLoading}
            loading={deleteAvatarIsLoading}
            onClick={() => handleDeleteAvatar()}
            sx={{ mr: 'auto' }}
            type="button"
          >
            Remove avatar
          </LoadingButton>
        )}
        <Button onClick={closeAndClear}>Cancel</Button>
        {files.length > 0 && (
          <LoadingButton
            disabled={deleteAvatarIsLoading}
            loading={updateAvatarIsLoading}
            onClick={() => handleChangeAvatar()}
            type="submit"
            variant="contained"
          >
            Update
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  )
}
