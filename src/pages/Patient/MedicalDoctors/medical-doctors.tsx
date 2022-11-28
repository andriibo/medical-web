import { Clear, Edit, Remove } from '@mui/icons-material'
import { Card, CardContent, IconButton, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React from 'react'

import { CardBox } from '~components/CardBox/card-box'
import styles from '~pages/Patient/Account/patient-account.module.scss'
import { useGetPatientDoctorsQuery } from '~stores/services/profile.api'

export const MedicalDoctors = () => {
  const { data: patientDoctors } = useGetPatientDoctorsQuery()

  console.log(111)

  return (
    <div className="white-box">
      <Typography>Medical Doctors</Typography>
      <Grid container spacing={3} sx={{ mb: 1 }}>
        {patientDoctors?.map(({ lastName, firstName, phone }) => (
          <Grid key={lastName} xs={4}>
            <CardBox
              header={
                <Grid container spacing={3}>
                  <Grid xs>
                    <Typography variant="subtitle1">{lastName}</Typography>
                  </Grid>
                  <Grid>
                    <IconButton className={styles.infoListButton} size="small">
                      <Clear fontSize="inherit" />
                    </IconButton>
                  </Grid>
                </Grid>
              }
            >
              sdfsfsdf
            </CardBox>
          </Grid>
        ))}
        <Grid xs={4}>
          <CardBox
            header={
              <Grid container spacing={3}>
                <Grid xs>
                  <Typography variant="subtitle1">John Doe</Typography>
                </Grid>
                <Grid>
                  <IconButton className={styles.infoListButton} size="small">
                    <Clear fontSize="inherit" />
                  </IconButton>
                </Grid>
              </Grid>
            }
          >
            sdfsfsdf
          </CardBox>
        </Grid>
        <Grid xs={4}>
          <Card>
            <CardContent>sdfs dsdf </CardContent>
          </Card>
        </Grid>
        <Grid xs={4}>
          <Card>
            <CardContent>sdfs dsdf </CardContent>
          </Card>
        </Grid>
        <Grid xs={4}>
          <Card>
            <CardContent>sdfs dsdf </CardContent>
          </Card>
        </Grid>
        <Grid xs={4}>
          <Card>
            <CardContent>sdfs dsdf </CardContent>
          </Card>
        </Grid>
        <Grid mdOffset="auto">dfsdfdsfsf</Grid>
      </Grid>
    </div>
  )
}
