import { skipToken } from '@reduxjs/toolkit/query'
import React, { FC, useEffect, useState } from 'react'

import { OrganizationEmergencyContactList } from '~components/EmergencyContacts/components/organization-emergency-contact-list'
import { PersonEmergencyContactList } from '~components/EmergencyContacts/components/person-emergency-contact-list'
import { Spinner } from '~components/Spinner/spinner'
import { IEmergencyContacts } from '~models/emergency-contact.model'
import { useAppDispatch } from '~stores/hooks'
import {
  useGetEmergencyContactsQuery,
  useGetPatientEmergencyContactsQuery,
} from '~stores/services/emergency-contact.api'
import { setEmergencyContactHasChanges, useEmergencyContactHasChanges } from '~stores/slices/emergency-contact.slice'

interface EmergencyContactsProps {
  patientUserId?: string
  handleInviteNewUser?: (email: string) => void
}

export const EmergencyContacts: FC<EmergencyContactsProps> = ({ patientUserId, handleInviteNewUser }) => {
  const dispatch = useAppDispatch()
  const emergencyContactHasChanges = useEmergencyContactHasChanges()

  const [emergencyContacts, setEmergencyContacts] = useState<IEmergencyContacts>({
    persons: [],
    organizations: [],
  })
  const [isLoading, setIsLoading] = useState(false)

  const {
    data: myEmergencyContacts,
    isLoading: myEmergencyContactsIsLoading,
    refetch: refetchMyEmergencyContacts,
  } = useGetEmergencyContactsQuery(patientUserId ? skipToken : undefined)

  const { data: patientEmergencyContacts, isLoading: patientEmergencyContactsIsLoading } =
    useGetPatientEmergencyContactsQuery(patientUserId ? { patientUserId } : skipToken)

  useEffect(() => {
    if (myEmergencyContacts && !myEmergencyContactsIsLoading) {
      setEmergencyContacts({ ...myEmergencyContacts })

      return
    }

    if (patientEmergencyContacts && !patientEmergencyContactsIsLoading) {
      setEmergencyContacts({ ...patientEmergencyContacts })
    }
  }, [myEmergencyContacts, myEmergencyContactsIsLoading, patientEmergencyContacts, patientEmergencyContactsIsLoading])

  useEffect(() => {
    if (myEmergencyContactsIsLoading || patientEmergencyContactsIsLoading) {
      setIsLoading(true)

      return
    }

    setIsLoading(false)
  }, [myEmergencyContactsIsLoading, patientEmergencyContactsIsLoading])

  useEffect(() => {
    if (emergencyContactHasChanges) {
      refetchMyEmergencyContacts()
      dispatch(setEmergencyContactHasChanges(false))
    }
  }, [emergencyContactHasChanges, dispatch, refetchMyEmergencyContacts])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <OrganizationEmergencyContactList
        emergencyContacts={emergencyContacts.organizations}
        patientUserId={patientUserId}
      />
      <PersonEmergencyContactList
        handleInviteNewUser={handleInviteNewUser}
        patientUserId={patientUserId}
        personEmergencyContacts={emergencyContacts.persons}
      />
    </>
  )
}
