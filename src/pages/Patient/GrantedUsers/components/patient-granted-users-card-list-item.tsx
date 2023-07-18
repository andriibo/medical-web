import { BadgeOutlined, LocationCity, MailOutline, Phone } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import React, { FC } from 'react'

interface PatientGrantedUsersCardListItemProps {
  email: string
  institution: string
  phone: string
  specialty?: string
}

export const PatientGrantedUsersCardListItem: FC<PatientGrantedUsersCardListItemProps> = ({
  email,
  institution,
  phone,
  specialty,
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
    {specialty && (
      <ListItem disableGutters>
        <ListItemIcon>
          <BadgeOutlined />
        </ListItemIcon>
        <ListItemText>{specialty}</ListItemText>
      </ListItem>
    )}
    <ListItem disableGutters>
      <ListItemIcon>
        <LocationCity />
      </ListItemIcon>
      <ListItemText>{institution || '-'}</ListItemText>
    </ListItem>
  </>
)
