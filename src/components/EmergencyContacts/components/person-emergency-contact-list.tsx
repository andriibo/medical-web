import { DragIndicator, MailOutline, Phone } from '@mui/icons-material'
import { Chip, IconButton, ListItem, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'

import { Relationship } from '~/enums/relationship.enum'
import { CardBox } from '~components/Card/card-box'
import { DropdownMenu } from '~components/DropdownMenu/dropdown-menu'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { IPersonEmergencyContactFullModel } from '~models/emergency-contact.model'
import { useAppDispatch } from '~stores/hooks'
import {
  useDeletePersonEmergencyContactMutation,
  usePatchPersonEmergencyContactOrderMutation,
} from '~stores/services/emergency-contact.api'
import { setPersonEmergencyContact } from '~stores/slices/emergency-contact.slice'

const ListItems = ({ emergencyContact }: { emergencyContact: IPersonEmergencyContactFullModel }) => (
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

interface PersonEmergencyContactListProps {
  personEmergencyContacts: IPersonEmergencyContactFullModel[]
  patientUserId?: string
  handleInviteNewUser?: (email: string) => void
}

export const PersonEmergencyContactList: FC<PersonEmergencyContactListProps> = ({
  personEmergencyContacts,
  patientUserId,
  handleInviteNewUser,
}) => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()

  const [emergencyContacts, setEmergencyContacts] =
    useState<IPersonEmergencyContactFullModel[]>(personEmergencyContacts)
  const [dropClose, setDropClose] = useState(false)
  const [setDeletingContactId, setSetDeletingContactId] = useState<string | null>(null)

  const personalContactIds = useMemo(
    () => emergencyContacts.map(({ contactId }) => contactId) || null,
    [emergencyContacts],
  )

  const [deleteEmergencyContact] = useDeletePersonEmergencyContactMutation()
  const [orderEmergencyContact] = usePatchPersonEmergencyContactOrderMutation()

  const handleDrop = useCallback((val: boolean) => {
    setDropClose(val)
  }, [])

  const handleEditEmergencyContact = useCallback(
    (contact: IPersonEmergencyContactFullModel) => {
      handleDrop(true)
      dispatch(setPersonEmergencyContact(contact))
    },
    [dispatch, handleDrop],
  )

  const handleDeleteEmergencyContact = useCallback(
    async (contactId: string) => {
      try {
        handleDrop(true)
        await confirm({
          title: 'Delete emergency contact?',
          description: 'The emergency contact will be deleted.',
          confirmationText: 'Delete',
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

  const handleInvite = useCallback(
    (email: string) => {
      if (handleInviteNewUser) {
        handleDrop(true)
        handleInviteNewUser(email)
      }
    },
    [handleDrop, handleInviteNewUser],
  )

  const handleDeleteForbidden = async () => {
    handleDrop(true)

    await confirm({
      title: 'Failed to delete',
      description: 'You must have at least one emergency contact.',
      hideCancelButton: true,
    })
  }

  const onSortPersonalContacts = useCallback(
    (newContacts: IPersonEmergencyContactFullModel[]) => {
      const newContactIds = newContacts.map(({ contactId }) => contactId)

      if (JSON.stringify(personalContactIds) !== JSON.stringify(newContactIds)) {
        console.log(newContacts)
        setEmergencyContacts([...newContacts])

        orderEmergencyContact({ contactIds: newContactIds })
      }
    },
    [personalContactIds, orderEmergencyContact],
  )

  useEffect(() => {
    setEmergencyContacts(personEmergencyContacts)
  }, [personEmergencyContacts])

  return (
    <>
      <Typography sx={{ mb: 2 }} variant="h6">
        People ({emergencyContacts.length})
      </Typography>
      {emergencyContacts.length ? (
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
            setList={onSortPersonalContacts}
          >
            {emergencyContacts.map((emergencyContact) => {
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
                        {/* <div className="card-header-holder"> */}
                        <Typography title={`${firstName} ${lastName}`} variant="subtitle1">
                          {firstName} {lastName}
                        </Typography>
                        <Chip label={Relationship[relationship]} size="small" />
                        {/* </div> */}
                        {!patientUserId && (
                          <DropdownMenu buttonEdge="end" dropClose={dropClose} handleDrop={handleDrop}>
                            {handleInviteNewUser && (
                              <MenuItem onClick={() => handleInvite(emergencyContact.email)}>
                                Invite to follow my vitals
                              </MenuItem>
                            )}
                            <MenuItem onClick={() => handleEditEmergencyContact(emergencyContact)}>Edit</MenuItem>
                            {emergencyContacts.length === 1 ? (
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
      ) : (
        <EmptyBox message="No emergency contacts" />
      )}
    </>
  )
}
