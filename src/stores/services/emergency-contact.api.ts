import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { IEmergencyContact, IEmergencyContactModel } from '~models/emergency-contact.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const emergencyContactApi = createApi({
  reducerPath: 'emergencyContactApi',
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
    postMyEmergencyContact: build.mutation<null, IEmergencyContactModel>({
      query: (queryArg) => ({ url: 'patient/my-emergency-contact', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['EmergencyContact'],
    }),
    patchPatientEmergencyContact: build.mutation<null, { contactId: string; contact: IEmergencyContactModel }>({
      query: ({ contactId, contact }) => ({
        url: `patient/my-emergency-contact/${contactId}`,
        method: 'PATCH',
        body: { ...contact },
      }),
      invalidatesTags: ['EmergencyContact'],
    }),
    deletePatientEmergencyContact: build.mutation<null, { contactId: string }>({
      query: ({ contactId }) => ({ url: `patient/my-emergency-contact/${contactId}`, method: 'DELETE' }),
      invalidatesTags: ['EmergencyContact'],
    }),
  }),
})

export const {
  useGetPatientEmergencyContactsQuery,
  useGetMyEmergencyContactsQuery,
  useLazyGetMyEmergencyContactsQuery,
  usePostMyEmergencyContactMutation,
  usePatchPatientEmergencyContactMutation,
  useDeletePatientEmergencyContactMutation,
} = emergencyContactApi
