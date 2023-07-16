import { DragIndicator, HomeWork, Phone } from '@mui/icons-material'
import { Box, IconButton, ListItem, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'

import { CardBox } from '~components/Card/card-box'
import { DropdownMenu } from '~components/DropdownMenu/dropdown-menu'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { IOrganizationEmergencyContactFullModel } from '~models/emergency-contact.model'
import { useAppDispatch } from '~stores/hooks'
import {
  useDeleteOrganizationEmergencyContactMutation,
  usePatchOrganizationEmergencyContactOrderMutation,
} from '~stores/services/emergency-contact.api'
import { setOrganizationEmergencyContact } from '~stores/slices/emergency-contact.slice'

const ListItems = ({ emergencyContact }: { emergencyContact: IOrganizationEmergencyContactFullModel }) => (
  <>
    <ListItem disableGutters>
      <ListItemIcon>
        <HomeWork />
      </ListItemIcon>
      <ListItemText>{emergencyContact.type}</ListItemText>
    </ListItem>
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
  </>
)

interface OrganizationEmergencyContactListProps {
  emergencyContacts: IOrganizationEmergencyContactFullModel[]
  patientUserId?: string
}

export const OrganizationEmergencyContactList: FC<OrganizationEmergencyContactListProps> = ({
  emergencyContacts,
  patientUserId,
}) => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()

  const [emergencyContactsData, setEmergencyContactsData] =
    useState<IOrganizationEmergencyContactFullModel[]>(emergencyContacts)
  const [dropClose, setDropClose] = useState(false)
  const [setDeletingContactId, setSetDeletingContactId] = useState<string | null>(null)

  const personalContactIds = useMemo(
    () => emergencyContactsData.map(({ contactId }) => contactId) || null,
    [emergencyContactsData],
  )

  const [deleteOrganizationEmergencyContact] = useDeleteOrganizationEmergencyContactMutation()
  const [orderOrganizationEmergencyContact] = usePatchOrganizationEmergencyContactOrderMutation()

  const handleDrop = useCallback((val: boolean) => {
    setDropClose(val)
  }, [])

  const handleEditOrganizationEmergencyContact = useCallback(
    (contact: IOrganizationEmergencyContactFullModel) => {
      handleDrop(true)
      dispatch(setOrganizationEmergencyContact(contact))
    },
    [dispatch, handleDrop],
  )

  const handleDeleteOrganizationEmergencyContact = useCallback(
    async (contactId: string) => {
      try {
        handleDrop(true)
        await confirm({
          title: 'Remove emergency contact?',
          description: 'The emergency contact will be removed.',
          confirmationText: 'Remove',
        })

        setSetDeletingContactId(contactId)

        await deleteOrganizationEmergencyContact({ contactId }).unwrap()
        enqueueSnackbar('Contact deleted')
      } catch (err) {
        console.error(err)
        setSetDeletingContactId(null)
        enqueueSnackbar('Contact not deleted', { variant: 'warning' })
      }
    },
    [confirm, deleteOrganizationEmergencyContact, enqueueSnackbar, handleDrop],
  )

  const onSortPersonalContacts = useCallback(
    (newContacts: IOrganizationEmergencyContactFullModel[]) => {
      const newContactIds = newContacts.map(({ contactId }) => contactId)

      if (JSON.stringify(personalContactIds) !== JSON.stringify(newContactIds)) {
        console.log(newContacts)
        setEmergencyContactsData([...newContacts])

        orderOrganizationEmergencyContact({ contactIds: newContactIds })
      }
    },
    [personalContactIds, orderOrganizationEmergencyContact],
  )

  useEffect(() => {
    setEmergencyContactsData(emergencyContacts)
  }, [emergencyContacts])

  return (
    <Box sx={{ mb: 3 }}>
      <Typography sx={{ mb: 2 }} variant="h6">
        Organization ({emergencyContactsData.length})
      </Typography>
      {emergencyContactsData.length ? (
        <Grid container spacing={3}>
          <ReactSortable
            animation={300}
            className="contact-sortable-container"
            delay={0}
            disabled={Boolean(patientUserId)}
            handle=".sort-handle"
            list={emergencyContactsData.map((emergencyContact, index) => ({
              ...emergencyContact,
              id: index,
            }))}
            setList={onSortPersonalContacts}
          >
            {emergencyContactsData.map((emergencyContact) => {
              const { name, contactId } = emergencyContact

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
                        <Typography variant="subtitle1">{name}</Typography>
                        {!patientUserId && (
                          <DropdownMenu buttonEdge="end" dropClose={dropClose} handleDrop={handleDrop}>
                            <MenuItem onClick={() => handleEditOrganizationEmergencyContact(emergencyContact)}>
                              Edit
                            </MenuItem>
                            <MenuItem onClick={() => handleDeleteOrganizationEmergencyContact(contactId)}>
                              Delete
                            </MenuItem>
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
        <EmptyBox message="No contacts yet " />
      )}
    </Box>
  )
}
