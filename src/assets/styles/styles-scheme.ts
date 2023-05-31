import { green, grey, red } from '@mui/material/colors'

export const btnIconError = {
  bgcolor: `${red[700]}1F`,
  '&:hover': {
    bgcolor: `${red[600]}4d`,
  },
}

export const btnIconSuccess = {
  bgcolor: `${green[800]}1F`,
  '&:hover': {
    bgcolor: `${green[700]}4d`,
  },
}

export const btnClosePopup = {
  position: 'absolute',
  right: 12,
  top: 8,
  color: grey[500],
}
