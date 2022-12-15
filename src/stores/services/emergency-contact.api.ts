import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { IEmergencyContact } from '~models/emergency-contact.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const emergencyContactApi = createApi({
  reducerPath: 'emergencyContactsApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['EmergencyContact'],
  endpoints: (build) => ({
    getPatientEmergencyContacts: build.query<IEmergencyContact[], { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `patient-emergency-contacts/${patientUserId}`,
      }),
      providesTags: ['EmergencyContact'],
    }),
    getMyEmergencyContacts: build.query<IEmergencyContact[], void>({
      query: () => ({
        url: 'patient/my-emergency-contacts',
      }),
      providesTags: ['EmergencyContact'],
    }),
  }),
})

export const { useGetPatientEmergencyContactsQuery, useGetMyEmergencyContactsQuery } = emergencyContactApi
