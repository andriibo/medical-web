import { Check, Close, HomeWork, Phone } from '@mui/icons-material'
import { Box, IconButton, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useState } from 'react'

import { btnIconError, btnIconSuccess } from '~/assets/styles/styles-scheme'
import { CardBox } from '~components/Card/card-box'
import { EmptyBox } from '~components/EmptyBox/empty-box'
import { IOrganizationSuggestedContact } from '~models/suggested-contact.model'
import { useAppDispatch } from '~stores/hooks'
import {
  useDeletePatientPersonSuggestedContactMutation,
  useDeletePersonSuggestedContactMutation,
  usePostPersonSuggestedContactApproveMutation,
} from '~stores/services/suggested-contact.api'
import { setEmergencyContactHasChanges } from '~stores/slices/emergency-contact.slice'

interface PersonSuggestedContactsListProps {
  organizationSuggestedContacts: IOrganizationSuggestedContact[]
  patientUserId?: string
}

export const OrganizationSuggestedContactsList: FC<PersonSuggestedContactsListProps> = ({
  organizationSuggestedContacts,
  patientUserId,
}) => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()

  const [setDisableContactId, setSetDisableContactId] = useState<string | null>(null)

  const [deleteSuggestedContact] = useDeletePersonSuggestedContactMutation()
  const [approveSuggestedContact] = usePostPersonSuggestedContactApproveMutation()
  const [rejectSuggestedContact] = useDeletePatientPersonSuggestedContactMutation()

  const handleDeleteSuggestedContact = useCallback(
    async (contactId: string) => {
      try {
        await confirm({
          title: 'Remove suggested contact?',
          description: 'The suggested contact will be removed.',
          confirmationText: 'Remove',
        })

        setSetDisableContactId(contactId)

        await deleteSuggestedContact({ contactId }).unwrap()
        enqueueSnackbar('Contact removed')
      } catch (err) {
        console.error(err)
        setSetDisableContactId(null)
        enqueueSnackbar('Contact not removed', { variant: 'warning' })
      }
    },
    [confirm, deleteSuggestedContact, enqueueSnackbar],
  )

  const handleApproveContact = useCallback(
    async (contactId: string) => {
      try {
        setSetDisableContactId(contactId)

        await approveSuggestedContact({ contactId }).unwrap()
        dispatch(setEmergencyContactHasChanges(true))
        enqueueSnackbar('Contact accepted')
      } catch (err) {
        console.error(err)
        setSetDisableContactId(null)
        enqueueSnackbar('Contact not accepted', { variant: 'warning' })
      }
    },
    [dispatch, enqueueSnackbar, approveSuggestedContact],
  )

  const handleRejectContact = useCallback(
    async (contactId: string) => {
      try {
        setSetDisableContactId(contactId)

        await rejectSuggestedContact({ contactId }).unwrap()
        enqueueSnackbar('Contact rejected')
      } catch (err) {
        console.error(err)

        setSetDisableContactId(null)
        enqueueSnackbar('Contact not rejected', { variant: 'warning' })
      }
    },
    [enqueueSnackbar, rejectSuggestedContact],
  )

  return (
    <Box sx={{ mb: 3 }}>
      <Typography sx={{ mb: 2 }} variant="h6">
        Organization ({organizationSuggestedContacts.length})
      </Typography>
      {organizationSuggestedContacts.length ? (
        <Grid container spacing={3}>
          {organizationSuggestedContacts.map((suggestedContact) => {
            const { name, phone, type, contactId } = suggestedContact

            return (
              <Grid key={contactId} xs={6}>
                <CardBox
                  disable={setDisableContactId === contactId}
                  header={
                    <>
                      <Typography variant="subtitle1">{name}</Typography>
                      {patientUserId && (
                        <IconButton edge="end" onClick={() => handleDeleteSuggestedContact(contactId)}>
                          <Close />
                        </IconButton>
                      )}
                    </>
                  }
                  infoListItems={
                    <>
                      <ListItem disableGutters>
                        <ListItemIcon>
                          <HomeWork />
                        </ListItemIcon>
                        <ListItemText>{type}</ListItemText>
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon>
                          <Phone />
                        </ListItemIcon>
                        <ListItemText>
                          <a className="simple-link" href={`tel:${phone}`}>
                            {phone}
                          </a>
                        </ListItemText>
                        {!patientUserId && (
                          <Box sx={{ my: '-0.5rem', whiteSpace: 'nowrap' }}>
                            <IconButton
                              color="error"
                              onClick={() => handleRejectContact(contactId)}
                              sx={{
                                ml: 1,
                                ...btnIconError,
                              }}
                            >
                              <Close />
                            </IconButton>
                            <IconButton
                              color="success"
                              onClick={() => handleApproveContact(contactId)}
                              sx={{
                                ml: 1,
                                ...btnIconSuccess,
                              }}
                            >
                              <Check />
                            </IconButton>
                          </Box>
                        )}
                      </ListItem>
                    </>
                  }
                />
              </Grid>
            )
          })}
        </Grid>
      ) : (
        <EmptyBox message="No suggested contacts yet" />
      )}
    </Box>
  )
}
