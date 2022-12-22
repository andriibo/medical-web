import { MailOutline, Phone } from '@mui/icons-material'
import { Chip, ListItem, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { skipToken } from '@reduxjs/toolkit/query'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useEffect, useState } from 'react'

import { Relationship } from '~/enums/relationship.enum'
import { CardBox } from '~components/Card/card-box'
import { DropdownMenu } from '~components/DropdownMenu/dropdown-menu'
import { Spinner } from '~components/Spinner/spinner'
import { IEmergencyContact } from '~models/emergency-contact.model'
import {
  useDeletePatientEmergencyContactMutation,
  useGetMyEmergencyContactsQuery,
  useGetPatientEmergencyContactsQuery,
} from '~stores/services/emergency-contact.api'

interface EmergencyContactsProps {
  patientUserId?: string
}
export const EmergencyContacts: FC<EmergencyContactsProps> = ({ patientUserId }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [emergencyContacts, setEmergencyContacts] = useState<IEmergencyContact[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [dropClose, setDropClose] = useState(false)
  const [setDeletingContactId, setSetDeletingContactId] = useState<string | null>(null)

  const { data: myEmergencyContacts, isLoading: myEmergencyContactsIsLoading } = useGetMyEmergencyContactsQuery(
    patientUserId ? skipToken : undefined,
  )

  const { data: patientEmergencyContacts, isLoading: patientEmergencyContactsIsLoading } =
    useGetPatientEmergencyContactsQuery(patientUserId ? { patientUserId } : skipToken)

  const [deleteEmergencyContact] = useDeletePatientEmergencyContactMutation()

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

  const handleDrop = useCallback((val: boolean) => {
    setDropClose(val)
  }, [])

  const handleDeleteEmergencyContact = useCallback(
    async (contactId: string) => {
      try {
        setSetDeletingContactId(contactId)
        handleDrop(true)

        await deleteEmergencyContact({ contactId }).unwrap()
        enqueueSnackbar('Contact deleted')
      } catch (err) {
        console.error(err)
        setSetDeletingContactId(null)
        enqueueSnackbar('Contact not deleted', { variant: 'warning' })
      }
    },
    [deleteEmergencyContact, enqueueSnackbar, handleDrop],
  )

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <Grid container spacing={3} sx={{ mb: 1 }}>
          {emergencyContacts?.length ? (
            emergencyContacts.map(({ lastName, firstName, phone, email, relationship, contactId }, index) => (
              <Grid key={firstName + index} xs={6}>
                <CardBox
                  disable={setDeletingContactId === contactId}
                  header={
                    <>
                      <Typography variant="subtitle1">
                        {firstName} {lastName}
                      </Typography>
                      <div style={{ marginLeft: 'auto' }} />
                      <Chip label={Relationship[relationship]} size="small" />
                      {!patientUserId && (
                        <DropdownMenu buttonEdge="end" dropClose={dropClose} handleDrop={handleDrop}>
                          <MenuItem
                          // disabled={action === actions.preview}
                          // key={action}
                          // onClick={(event) => handleMenuActions(event, action)}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => handleDeleteEmergencyContact(contactId)}>Delete</MenuItem>
                        </DropdownMenu>
                      )}
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
