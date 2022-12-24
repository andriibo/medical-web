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
  useDeleteSuggestedContactMutation,
  useGetMySuggestedContactsQuery,
  useGetPatientSuggestedContactsQuery,
} from '~stores/services/suggested-contact.api'

interface SuggestedContactsProps {
  patientUserId?: string
  heading?: ReactNode
}
export const SuggestedContacts: FC<SuggestedContactsProps> = ({ patientUserId, heading }) => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()
  const [suggestedContacts, setSuggestedContacts] = useState<ISuggestedContact[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [setDeletingContactId, setSetDeletingContactId] = useState<string | null>(null)

  const { data: mySuggestedContacts, isLoading: mySuggestedContactsIsLoading } = useGetMySuggestedContactsQuery(
    patientUserId ? skipToken : undefined,
  )

  const { data: patientSuggestedContacts, isLoading: patientSuggestedContactsIsLoading } =
    useGetPatientSuggestedContactsQuery(patientUserId ? { patientUserId } : skipToken)

  const [deleteSuggestedContact] = useDeleteSuggestedContactMutation()

  useEffect(() => {
    if (patientSuggestedContacts && !mySuggestedContactsIsLoading) {
      setSuggestedContacts([...patientSuggestedContacts])

      return
    }

    if (mySuggestedContacts && !patientSuggestedContactsIsLoading) {
      setSuggestedContacts([...mySuggestedContacts])
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

        setSetDeletingContactId(contactId)

        await deleteSuggestedContact({ contactId }).unwrap()
        enqueueSnackbar('Contact removed')
      } catch (err) {
        console.error(err)
        setSetDeletingContactId(null)
        enqueueSnackbar('Contact not removed', { variant: 'warning' })
      }
    },
    [confirm, deleteSuggestedContact, enqueueSnackbar],
  )

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
                disable={setDeletingContactId === contactId}
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
                      <ListItemText>{phone}</ListItemText>
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <MailOutline />
                      </ListItemIcon>
                      <ListItemText>{email}</ListItemText>
                      {!patientUserId && (
                        <Box sx={{ my: '-0.5rem' }}>
                          <IconButton
                            color="error"
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
