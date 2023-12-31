import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'
import React, { FC, MouseEvent, useCallback, useEffect, useState } from 'react'

interface DropdownMenuProps {
  button?: React.ReactNode
  buttonEdge?: 'start' | 'end'
  children: React.ReactNode
  dropClose?: boolean
  handleDrop?: (val: boolean) => void
  menuStyles?: SxProps<Theme>
}

const openerStyles = {
  display: 'inline-flex',
  verticalAlign: 'middle',
  cursor: 'pointer',
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
  button,
  dropClose,
  handleDrop,
  children,
  menuStyles,
  buttonEdge,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = useCallback(
    (event?: MouseEvent<HTMLElement>) => {
      if (event) {
        event.stopPropagation()
      }

      setAnchorEl(null)

      if (handleDrop) {
        handleDrop(false)
      }
    },
    [handleDrop],
  )

  useEffect(() => {
    if (dropClose) {
      handleClose()
    }
  }, [dropClose, handleClose])

  const sx = {
    '& .MuiPaper-root': {
      minWidth: 150,
    },
    ...menuStyles,
  }

  return (
    <>
      <div onClick={handleClick} style={openerStyles}>
        {button ? (
          button
        ) : (
          <IconButton edge={buttonEdge}>
            <MoreVert />
          </IconButton>
        )}
      </div>
      <Menu anchorEl={anchorEl} onClose={(event: MouseEvent<HTMLElement>) => handleClose(event)} open={open} sx={sx}>
        {children}
      </Menu>
    </>
  )
}
