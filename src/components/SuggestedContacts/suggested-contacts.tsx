import { Check, Close, MailOutline, Phone } from '@mui/icons-material'
import { Box, Chip, IconButton, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { green, red } from '@mui/material/colors'
import Grid from '@mui/material/Unstable_Grid2'
import { skipToken } from '@reduxjs/toolkit/query'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react'

import { Relationship } from '~/enums/relationship.enum'
import { CardBox } from '~components/Card/card-box'
import { Spinner } from '~components/Spinner/spinner'
import { ISuggestedContact } from '~models/suggested-contact.model'
import { useAppDispatch } from '~stores/hooks'
import {
  useDeletePatientSuggestedContactMutation,
  useDeleteSuggestedContactMutation,
  useGetMySuggestedContactsQuery,
  useGetPatientSuggestedContactsQuery,
  usePostSuggestedContactApproveMutation,
} from '~stores/services/suggested-contact.api'
import { setEmergencyContactHasChanges } from '~stores/slices/emergency-contact.slice'

interface SuggestedContactsProps {
  patientUserId?: string
  heading?: ReactNode
  mounted?: (val: boolean) => void
}
export const SuggestedContacts: FC<SuggestedContactsProps> = ({ patientUserId, heading, mounted }) => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()
  const [suggestedContacts, setSuggestedContacts] = useState<ISuggestedContact[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [setDisableContactId, setSetDisableContactId] = useState<string | null>(null)

  const { data: mySuggestedContacts, isLoading: mySuggestedContactsIsLoading } = useGetMySuggestedContactsQuery(
    patientUserId ? skipToken : undefined,
  )

  const { data: patientSuggestedContacts, isLoading: patientSuggestedContactsIsLoading } =
    useGetPatientSuggestedContactsQuery(patientUserId ? { patientUserId } : skipToken)

  const [deleteSuggestedContact] = useDeleteSuggestedContactMutation()
  const [suggestedContactApprove] = usePostSuggestedContactApproveMutation()
  const [suggestedContactReject] = useDeletePatientSuggestedContactMutation()

  const getSortedContacts = (contacts: ISuggestedContact[]) =>
    contacts.sort((a, b) => {
      if (a.lastName < b.lastName || a.firstName < b.firstName) {
        return -1
      }

      if (a.lastName > b.lastName || a.firstName > b.firstName) {
        return 1
      }

      return 0
    })

  useEffect(() => {
    if (patientSuggestedContacts && !mySuggestedContactsIsLoading) {
      setSuggestedContacts(getSortedContacts([...patientSuggestedContacts]))

      return
    }

    if (mySuggestedContacts && !patientSuggestedContactsIsLoading) {
      setSuggestedContacts(getSortedContacts([...mySuggestedContacts]))
    }
  }, [patientSuggestedContacts, mySuggestedContactsIsLoading, mySuggestedContacts, patientSuggestedContactsIsLoading])

  useEffect(() => {
    if (mySuggestedContactsIsLoading || patientSuggestedContactsIsLoading) {
      setIsLoading(true)

      return
    }

    setIsLoading(false)
  }, [mySuggestedContactsIsLoading, patientSuggestedContactsIsLoading])

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

        await suggestedContactApprove({ contactId }).unwrap()
        dispatch(setEmergencyContactHasChanges(true))
        enqueueSnackbar('Contact accepted')
      } catch (err) {
        console.error(err)
        setSetDisableContactId(null)
        enqueueSnackbar('Contact not accepted', { variant: 'warning' })
      }
    },
    [dispatch, enqueueSnackbar, suggestedContactApprove],
  )

  const handleRejectContact = useCallback(
    async (contactId: string) => {
      try {
        setSetDisableContactId(contactId)

        await suggestedContactReject({ contactId }).unwrap()
        enqueueSnackbar('Contact rejected')
      } catch (err) {
        console.error(err)

        setSetDisableContactId(null)
        enqueueSnackbar('Contact not rejected', { variant: 'warning' })
      }
    },
    [enqueueSnackbar, suggestedContactReject],
  )

  useEffect(() => {
    if (mounted) {
      if (suggestedContacts && !suggestedContacts?.length) {
        mounted(false)

        return
      }

      mounted(true)
    }
  }, [mounted, suggestedContacts])

  if (isLoading) {
    return <Spinner />
  }

  if (!suggestedContacts?.length) {
    return null
  }

  return (
    <>
      {heading && heading}
      <Grid container spacing={3} sx={{ mb: 1 }}>
        {suggestedContacts.map((suggestedContact) => {
          const { lastName, firstName, phone, email, relationship, contactId } = suggestedContact

          return (
            <Grid key={contactId} xs={6}>
              <CardBox
                disable={setDisableContactId === contactId}
                header={
                  <>
                    <Typography variant="subtitle1">
                      {firstName} {lastName}
                    </Typography>
                    <div style={{ marginLeft: 'auto' }} />
                    <Chip label={Relationship[relationship]} size="small" />
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
                        <Phone />
                      </ListItemIcon>
                      <ListItemText>
                        <a className="simple-link" href={`tel:+${phone}`}>
                          +{phone}
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
                      {!patientUserId && (
                        <Box sx={{ my: '-0.5rem' }}>
                          <IconButton
                            color="error"
                            onClick={() => handleRejectContact(contactId)}
                            sx={{
                              ml: 1,
                              bgcolor: `${red[700]}1F`,
                              '&:hover': {
                                bgcolor: `${red[600]}4d`,
                              },
                            }}
                          >
                            <Close />
                          </IconButton>
                          <IconButton
                            color="success"
                            onClick={() => handleApproveContact(contactId)}
                            sx={{
                              ml: 1,
                              bgcolor: `${green[800]}1F`,
                              '&:hover': {
                                bgcolor: `${green[700]}4d`,
                              },
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
    </>
  )
}
