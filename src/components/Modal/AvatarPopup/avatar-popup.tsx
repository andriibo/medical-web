import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useMemo, useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { useDropzone } from 'react-dropzone'

import { usePostAvatarMutation } from '~stores/services/profile.api'

import styles from './avatar-popup.module.scss'

const avatarInitialSettings = {
  border: 20,
  borderRadius: 100,
  color: [0, 0, 0, 0.6],
  size: 200,
  image: '',
  rotate: 0,
  scale: 1.6,
  scalePercent: 20,
  scaleMax: 6,
  scaleMin: 0.5,
  scaleStep: 0.01,
  maxSize: 1048576,
}

interface AvatarPopupProps {
  open: boolean
  handleClose: () => void
}

export const AvatarPopup: FC<AvatarPopupProps> = ({ open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar()
  const avatarEditor = useRef<AvatarEditor | null>(null)
  const [avatarSettings, setAvatarSettings] = useState(avatarInitialSettings)
  const [files, setFiles] = useState<any[]>([])

  const [updateAvatar] = usePostAvatarMutation()

  const handleDrop = (dropped: any) => {
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

  const closeAncClear = useCallback(() => {
    handleClose()
    setTimeout(() => {
      removeAvatar()
    }, 300)
  }, [handleClose, removeAvatar])

  const handleChangeAvatar = useCallback(async () => {
    if (avatarEditor.current && files.length) {
      const avatarData = avatarEditor.current.getImageScaledToCanvas().toDataURL()

      try {
        const formData = new FormData()
        const base64Response = await fetch(avatarData)
        const blob = await base64Response.blob()

        formData.append('file', blob)

        await updateAvatar(formData).unwrap()

        closeAncClear()
        enqueueSnackbar('Avatar changed')
      } catch (err) {
        console.error(err)
      }
    }
  }, [closeAncClear, enqueueSnackbar, files, updateAvatar])

  const { getRootProps, isDragAccept, isDragReject, getInputProps, fileRejections } = useDropzone({
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
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open} scroll="body">
      <DialogTitle>Choose Image</DialogTitle>
      <DialogContent>
        <div className={styles.cropContainer}>
          <div className={styles.hasLoader}>
            {!files.length ? (
              <div {...getRootProps({ className: dropClassName })}>
                <input {...getInputProps()} />
                <div>
                  <Typography variant="body1">
                    Drag and drop image file here, <br /> or click to select file
                  </Typography>
                  {fileRejections.length ? (
                    <Typography color="red" mt={1} variant="body1">
                      {fileRejections[0].errors.map((e) => (
                        <React.Fragment key={e.code}>
                          {e.code === 'file-too-large' ? (
                            'The file is too large'
                          ) : (
                            <>
                              {e.message.replace('/*', '')} <br />
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </Typography>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className={styles.cropContainer}>
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
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ padding: '0 1.5rem 1rem' }}>
        {files.length > 0 && (
          <Button color="error" onClick={removeAvatar} sx={{ mr: 'auto' }}>
            Clear Logo
          </Button>
        )}
        <Button color="inherit" onClick={closeAncClear}>
          Cancel
        </Button>
        {files.length > 0 && (
          <Button autoFocus onClick={() => handleChangeAvatar()} variant="outlined">
            Agree
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
