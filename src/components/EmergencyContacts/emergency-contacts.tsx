import { DragIndicator, MailOutline, Phone } from '@mui/icons-material'
import { Chip, IconButton, ListItem, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { skipToken } from '@reduxjs/toolkit/query'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'

import { Relationship } from '~/enums/relationship.enum'
import { CardBox } from '~components/Card/card-box'
import { DropdownMenu } from '~components/DropdownMenu/dropdown-menu'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { Spinner } from '~components/Spinner/spinner'
import { IEmergencyContact } from '~models/emergency-contact.model'
import { useAppDispatch } from '~stores/hooks'
import {
  useDeletePatientEmergencyContactMutation,
  useGetMyEmergencyContactsQuery,
  useGetPatientEmergencyContactsQuery,
  usePatchMyEmergencyContactOrderMutation,
} from '~stores/services/emergency-contact.api'
import {
  setEmergencyContact,
  setEmergencyContactHasChanges,
  useEmergencyContactHasChanges,
} from '~stores/slices/emergency-contact.slice'

interface EmergencyContactsProps {
  patientUserId?: string
}

const ListItems = ({ emergencyContact }: { emergencyContact: IEmergencyContact }) => (
  <>
    <ListItem disableGutters>
      <ListItemIcon>
        <Phone />
      </ListItemIcon>
      <ListItemText>
        <a className="simple-link" href={`tel:${emergencyContact.phone}`}>
          {emergencyContact.phone}
        </a>
      </ListItemText>
    </ListItem>
    <ListItem disableGutters>
      <ListItemIcon>
        <MailOutline />
      </ListItemIcon>
      <ListItemText>
        <a className="simple-link" href={`mailto:${emergencyContact.email}`}>
          {emergencyContact.email}
        </a>
      </ListItemText>
    </ListItem>
  </>
)

export const EmergencyContacts: FC<EmergencyContactsProps> = ({ patientUserId }) => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()
  const emergencyContactHasChanges = useEmergencyContactHasChanges()

  const [emergencyContacts, setEmergencyContacts] = useState<IEmergencyContact[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [dropClose, setDropClose] = useState(false)
  const [setDeletingContactId, setSetDeletingContactId] = useState<string | null>(null)

  const contactIds = useMemo(() => emergencyContacts?.map(({ contactId }) => contactId) || null, [emergencyContacts])

  const {
    data: myEmergencyContacts,
    isLoading: myEmergencyContactsIsLoading,
    refetch: refetchMyEmergencyContacts,
  } = useGetMyEmergencyContactsQuery(patientUserId ? skipToken : undefined)

  const { data: patientEmergencyContacts, isLoading: patientEmergencyContactsIsLoading } =
    useGetPatientEmergencyContactsQuery(patientUserId ? { patientUserId } : skipToken)

  const [deleteEmergencyContact] = useDeletePatientEmergencyContactMutation()
  const [orderEmergencyContact] = usePatchMyEmergencyContactOrderMutation()

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

  const handleEditEmergencyContact = useCallback(
    (contact: IEmergencyContact) => {
      handleDrop(true)
      dispatch(setEmergencyContact(contact))
    },
    [dispatch, handleDrop],
  )

  const handleDeleteEmergencyContact = useCallback(
    async (contactId: string) => {
      try {
        handleDrop(true)
        await confirm({
          title: 'Remove emergency contact?',
          description: 'The emergency contact will be removed.',
          confirmationText: 'Remove',
        })

        setSetDeletingContactId(contactId)

        await deleteEmergencyContact({ contactId }).unwrap()
        enqueueSnackbar('Contact deleted')
      } catch (err) {
        console.error(err)
        setSetDeletingContactId(null)
        enqueueSnackbar('Contact not deleted', { variant: 'warning' })
      }
    },
    [confirm, deleteEmergencyContact, enqueueSnackbar, handleDrop],
  )

  const handleDeleteForbidden = async () => {
    handleDrop(true)

    await confirm({
      title: 'Failed to delete',
      description: 'You must have at least one emergency contact.',
      hideCancelButton: true,
    })
  }

  useEffect(() => {
    if (emergencyContactHasChanges) {
      refetchMyEmergencyContacts()
      dispatch(setEmergencyContactHasChanges(false))
    }
  }, [emergencyContactHasChanges, dispatch, refetchMyEmergencyContacts])

  const onSortContacts = useCallback(
    (newContacts: IEmergencyContact[]) => {
      const newContactIds = newContacts.map(({ contactId }) => contactId)

      if (JSON.stringify(contactIds) !== JSON.stringify(newContactIds)) {
        console.log(newContacts)
        setEmergencyContacts([...newContacts])

        orderEmergencyContact({ contactIds: newContactIds })
      }
    },
    [contactIds, orderEmergencyContact],
  )

  if (isLoading) {
    return <Spinner />
  }

  if (!emergencyContacts) {
    return <EmptyBox message="No emergency contacts" />
  }

  return (
    <Grid container spacing={3}>
      <ReactSortable
        animation={300}
        className="contact-sortable-container"
        delay={0}
        disabled={Boolean(patientUserId)}
        handle=".sort-handle"
        list={emergencyContacts.map((emergencyContact, index) => ({
          ...emergencyContact,
          id: index,
        }))}
        setList={onSortContacts}
      >
        {emergencyContacts?.map((emergencyContact) => {
          const { lastName, firstName, relationship, contactId } = emergencyContact

          return (
            <Grid key={contactId} xs={6}>
              <CardBox
                disable={setDeletingContactId === contactId}
                header={
                  <>
                    {!patientUserId && (
                      <IconButton className="sort-handle" color="inherit" size="small" title="sort">
                        <DragIndicator />
                      </IconButton>
                    )}
                    <Typography variant="subtitle1">
                      {firstName} {lastName}
                    </Typography>
                    <Chip label={Relationship[relationship]} size="small" />
                    {!patientUserId && (
                      <DropdownMenu buttonEdge="end" dropClose={dropClose} handleDrop={handleDrop}>
                        <MenuItem onClick={() => handleEditEmergencyContact(emergencyContact)}>Edit</MenuItem>
                        {emergencyContacts?.length === 1 ? (
                          <MenuItem onClick={() => handleDeleteForbidden()}>Delete</MenuItem>
                        ) : (
                          <MenuItem onClick={() => handleDeleteEmergencyContact(contactId)}>Delete</MenuItem>
                        )}
                      </DropdownMenu>
                    )}
                  </>
                }
                infoListItems={<ListItems emergencyContact={emergencyContact} />}
              />
            </Grid>
          )
        })}
      </ReactSortable>
    </Grid>
  )
}
