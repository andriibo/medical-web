import { LocationCity, MailOutline, Phone } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import React, { FC } from 'react'

interface PatientGrantedUsersCardListItemProps {
  email: string
  institution: string
  phone: string
}

export const PatientGrantedUsersCardListItem: FC<PatientGrantedUsersCardListItemProps> = ({
  email,
  institution,
  phone,
}) => (
  <>
    <ListItem disableGutters>
      <ListItemIcon>
        <Phone />
      </ListItemIcon>
      <ListItemText>
        <a className="simple-link" href={`tel:${phone}`}>
          {phone}
        </a>
      </ListItemText>
    </ListItem>
    <ListItem disableGutters>
      <ListItemIcon>
        <MailOutline />
      </ListItemIcon>
      <ListItemText>
        <a className="simple-link" href={`mailto:${email}`}>
          {email}
        </a>
      </ListItemText>
    </ListItem>
    <ListItem disableGutters>
      <ListItemIcon>
        <LocationCity />
      </ListItemIcon>
      <ListItemText>{institution || '-'}</ListItemText>
    </ListItem>
  </>
)
