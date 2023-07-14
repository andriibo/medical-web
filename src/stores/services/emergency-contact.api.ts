import { createApi } from '@reduxjs/toolkit/dist/query/react'

import {
  IEmergencyContact,
  IEmergencyContactOrganizationModel,
  IEmergencyContactPersonModel,
} from '~models/emergency-contact.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const emergencyContactApi = createApi({
  reducerPath: 'emergencyContactApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['EmergencyContact', 'EmergencyContactOrder'],
  endpoints: (build) => ({
    getPatientEmergencyContacts: build.query<IEmergencyContact, { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `emergency-contacts/${patientUserId}`,
      }),
      providesTags: ['EmergencyContact'],
    }),
    getEmergencyContacts: build.query<IEmergencyContact, void>({
      query: () => ({
        url: 'patient/emergency-contacts',
      }),
      providesTags: ['EmergencyContact'],
    }),
    postPersonEmergencyContact: build.mutation<null, IEmergencyContactPersonModel>({
      query: (queryArg) => ({ url: 'patient/person-emergency-contact', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['EmergencyContact'],
    }),
    postOrganizationEmergencyContact: build.mutation<null, IEmergencyContactOrganizationModel>({
      query: (queryArg) => ({ url: 'patient/organization-emergency-contact', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['EmergencyContact'],
    }),
    patchPatientEmergencyContact: build.mutation<null, { contactId: string; contact: IEmergencyContactPersonModel }>({
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
    patchMyEmergencyContactOrder: build.mutation<null, { contactIds: string[] }>({
      query: ({ contactIds }) => ({
        url: 'patient/my-emergency-contacts/order',
        method: 'PATCH',
        body: { contactIds },
      }),
      invalidatesTags: ['EmergencyContactOrder'],
    }),
  }),
})

export const {
  useGetPatientEmergencyContactsQuery,
  useGetEmergencyContactsQuery,
  useLazyGetEmergencyContactsQuery,
  usePostPersonEmergencyContactMutation,
  usePostOrganizationEmergencyContactMutation,
  usePatchPatientEmergencyContactMutation,
  useDeletePatientEmergencyContactMutation,
  usePatchMyEmergencyContactOrderMutation,
} = emergencyContactApi
