import {
  Check,
  Clear,
  Close,
  Edit,
  LocationCity,
  Mail,
  MailOutline,
  PersonAdd,
  Phone,
  Remove,
} from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useState } from 'react'

import { CardBox } from '~components/Card/card-box'
import { PatientInvitePopup } from '~components/Modal/PatientInvitePopup/patient-invite-popup'
import { Spinner } from '~components/Spinner/spinner'
import styles from '~pages/Patient/Account/patient-account.module.scss'
import { useGetPatientDoctorsQuery } from '~stores/services/profile.api'

export const MedicalDoctors = () => {
  const [invitePopupOpen, setInvitePopupOpen] = useState(false)

  const { data: patientDoctors, isLoading: patientDoctorsIsLoading } = useGetPatientDoctorsQuery()

  console.log(111)

  const handleInvitePopupOpen = () => {
    setInvitePopupOpen(true)
  }

  const handleInvitePopupClose = () => {
    setInvitePopupOpen(false)
  }

  return (
    <>
      <div className="white-box">
        <Grid container spacing={3} sx={{ mb: 1 }}>
          <Grid xs>
            <Typography variant="h5">Medical Doctors</Typography>
          </Grid>
          <Grid>
            <Button onClick={handleInvitePopupOpen} startIcon={<PersonAdd />} variant="outlined">
              Invite
            </Button>
          </Grid>
        </Grid>
        {patientDoctorsIsLoading ? (
          <Spinner />
        ) : (
          <Grid container spacing={3} sx={{ mb: 1 }}>
            {patientDoctors?.map(({ lastName, firstName, phone, email, institution }) => (
              <Grid key={lastName} xs={4}>
                <CardBox
                  header={
                    <>
                      <Typography variant="subtitle1">
                        {firstName} {lastName}
                      </Typography>
                      <div style={{ marginLeft: 'auto' }} />
                      <IconButton className={styles.infoListButton} size="small">
                        <Clear fontSize="inherit" />
                      </IconButton>
                    </>
                  }
                >
                  <List
                    disablePadding
                    sx={{
                      wordWrap: 'break-word',
                      '& .MuiListItemIcon-root': { minWidth: '2.125rem', color: '#323232' },
                      '& .MuiListItemText-root': { m: 0 },
                      '& .MuiTypography-root': { fontSize: '0.875rem', m: 0 },
                    }}
                  >
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText>{phone}</ListItemText>
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <MailOutline />
                      </ListItemIcon>
                      <ListItemText>{email}</ListItemText>
                    </ListItem>
                    <ListItem
                      disableGutters
                      secondaryAction={
                        <>
                          <IconButton>
                            <Close />
                          </IconButton>
                          <IconButton>
                            <Check />
                          </IconButton>
                        </>
                      }
                    >
                      <ListItemIcon>
                        <LocationCity />
                      </ListItemIcon>
                      <ListItemText>{institution}</ListItemText>
                    </ListItem>
                  </List>
                </CardBox>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
      <PatientInvitePopup handleClose={handleInvitePopupClose} open={invitePopupOpen} />
    </>
  )
}
