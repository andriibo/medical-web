import { skipToken } from '@reduxjs/toolkit/query'
import React, { FC, useEffect, useState } from 'react'

import { Spinner } from '~components/Spinner/spinner'
import { OrganizationSuggestedContactsList } from '~components/SuggestedContacts/components/organization-suggested-contacts-list'
import { PersonSuggestedContactsList } from '~components/SuggestedContacts/components/person-suggested-contacts-list'
import { sortByFields } from '~helpers/sort-by-fields'
import { ISuggestedContacts } from '~models/suggested-contact.model'
import {
  useGetPatientSuggestedContactsQuery,
  useGetSuggestedContactsQuery,
} from '~stores/services/suggested-contact.api'

interface SuggestedContactsProps {
  patientUserId?: string
}
export const SuggestedContacts: FC<SuggestedContactsProps> = ({ patientUserId }) => {
  const [suggestedContacts, setSuggestedContacts] = useState<ISuggestedContacts>({
    persons: [],
    organizations: [],
  })
  const [isLoading, setIsLoading] = useState(false)

  const { data: mySuggestedContacts, isLoading: mySuggestedContactsIsLoading } = useGetPatientSuggestedContactsQuery(
    patientUserId ? skipToken : undefined,
  )

  const { data: patientSuggestedContacts, isLoading: patientSuggestedContactsIsLoading } = useGetSuggestedContactsQuery(
    patientUserId ? { patientUserId } : skipToken,
  )

  useEffect(() => {
    if (patientSuggestedContacts && !patientSuggestedContactsIsLoading) {
      setSuggestedContacts({
        persons: sortByFields([...patientSuggestedContacts.persons], 'firstName', 'lastName'),
        organizations: sortByFields([...patientSuggestedContacts.organizations], 'name'),
      })

      return
    }

    if (mySuggestedContacts && !mySuggestedContactsIsLoading) {
      setSuggestedContacts({
        persons: sortByFields([...mySuggestedContacts.persons], 'firstName', 'lastName'),
        organizations: sortByFields([...mySuggestedContacts.organizations], 'name'),
      })
    }
  }, [mySuggestedContactsIsLoading, mySuggestedContacts, patientSuggestedContactsIsLoading, patientSuggestedContacts])

  useEffect(() => {
    if (mySuggestedContactsIsLoading || patientSuggestedContactsIsLoading) {
      setIsLoading(true)

      return
    }

    setIsLoading(false)
  }, [mySuggestedContactsIsLoading, patientSuggestedContactsIsLoading])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <OrganizationSuggestedContactsList
        organizationSuggestedContacts={suggestedContacts.organizations}
        patientUserId={patientUserId}
      />
      <PersonSuggestedContactsList patientUserId={patientUserId} personSuggestedContacts={suggestedContacts.persons} />
    </>
  )
}
