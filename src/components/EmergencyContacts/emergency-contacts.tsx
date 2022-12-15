import { Clear, LocationCity, MailOutline, Phone } from '@mui/icons-material'
import { Chip, IconButton, ListItem, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { skipToken } from '@reduxjs/toolkit/query'
import React, { FC, useCallback, useEffect, useState } from 'react'

import { CardBox } from '~components/Card/card-box'
import { DropdownMenu } from '~components/DropdownMenu/dropdown-menu'
import { Spinner } from '~components/Spinner/spinner'
import { IEmergencyContact } from '~models/emergency-contact.model'
import {
  useGetMyEmergencyContactsQuery,
  useGetPatientEmergencyContactsQuery,
} from '~stores/services/emergency-contact.api'

interface EmergencyContactsProps {
  patientUserId?: string
}
export const EmergencyContacts: FC<EmergencyContactsProps> = ({ patientUserId }) => {
  console.log('EmergencyContacts')
  const [emergencyContacts, setEmergencyContacts] = useState<IEmergencyContact[]>()
  const [isLoading, setIsLoading] = useState(false)

  const { data: myEmergencyContacts, isLoading: myEmergencyContactsIsLoading } = useGetMyEmergencyContactsQuery(
    patientUserId ? skipToken : undefined,
  )

  const { data: patientEmergencyContacts, isLoading: patientEmergencyContactsIsLoading } =
    useGetPatientEmergencyContactsQuery(patientUserId ? { patientUserId } : skipToken)

  useEffect(() => {
    if (myEmergencyContacts && !myEmergencyContactsIsLoading) {
      setEmergencyContacts([...myEmergencyContacts])

      return
    }

    if (patientEmergencyContacts && !patientEmergencyContactsIsLoading) {
      setEmergencyContacts([...patientEmergencyContacts])
    }
  }, [myEmergencyContacts, myEmergencyContactsIsLoading, patientEmergencyContacts, patientEmergencyContactsIsLoading])

  useEffect(() => {
    if (myEmergencyContactsIsLoading || patientEmergencyContactsIsLoading) {
      setIsLoading(true)

      return
    }

    setIsLoading(false)
  }, [myEmergencyContactsIsLoading, patientEmergencyContactsIsLoading])
  const [dropClose, setDropClose] = useState(false)

  const handleDrop = useCallback((val: boolean) => {
    setDropClose(val)
  }, [])

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <Grid container spacing={3} sx={{ mb: 1 }}>
          {emergencyContacts?.length ? (
            emergencyContacts.map(({ lastName, firstName, phone, email, relationship }) => (
              <Grid key={firstName} xs={6}>
                <CardBox
                  // disable={deletingDoctorId === accessId}
                  header={
                    <>
                      <Typography variant="subtitle1">
                        {firstName} {lastName}
                      </Typography>
                      <div style={{ marginLeft: 'auto' }} />
                      <Chip label={relationship} size="small" />
                      <DropdownMenu buttonEdge="end" dropClose={dropClose} handleDrop={handleDrop}>
                        <MenuItem
                        // disabled={action === actions.preview}
                        // key={action}
                        // onClick={(event) => handleMenuActions(event, action)}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem>Delete</MenuItem>
                      </DropdownMenu>
                    </>
                  }
                  infoListItems={
                    <>
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
                    </>
                  }
                />
              </Grid>
            ))
          ) : (
            <Grid textAlign="center" xs>
              No emergency contacts added
            </Grid>
          )}
        </Grid>
      )}
    </div>
  )
}
