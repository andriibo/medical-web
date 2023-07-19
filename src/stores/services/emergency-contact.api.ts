import { createApi } from '@reduxjs/toolkit/dist/query/react'

import {
  IEmergencyContacts,
  IOrganizationCommonContactModel,
  IPersonCommonContactModel,
} from '~models/emergency-contact.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const emergencyContactApi = createApi({
  reducerPath: 'emergencyContactApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['EmergencyContact', 'EmergencyContactOrder'],
  endpoints: (build) => ({
    getPatientEmergencyContacts: build.query<IEmergencyContacts, { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `emergency-contacts/${patientUserId}`,
      }),
      providesTags: ['EmergencyContact'],
    }),
    getEmergencyContacts: build.query<IEmergencyContacts, void>({
      query: () => ({
        url: 'patient/emergency-contacts',
      }),
      providesTags: ['EmergencyContact'],
    }),

    // Person
    postPersonEmergencyContact: build.mutation<null, IPersonCommonContactModel>({
      query: (queryArg) => ({ url: 'patient/person-emergency-contact', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['EmergencyContact'],
    }),
    patchPersonEmergencyContact: build.mutation<null, { contactId: string; contact: IPersonCommonContactModel }>({
      query: ({ contactId, contact }) => ({
        url: `patient/person-emergency-contact/${contactId}`,
        method: 'PATCH',
        body: { ...contact },
      }),
      invalidatesTags: ['EmergencyContact'],
    }),
    deletePersonEmergencyContact: build.mutation<null, { contactId: string }>({
      query: ({ contactId }) => ({ url: `patient/person-emergency-contact/${contactId}`, method: 'DELETE' }),
      invalidatesTags: ['EmergencyContact'],
    }),
    patchPersonEmergencyContactOrder: build.mutation<null, { contactIds: string[] }>({
      query: ({ contactIds }) => ({
        url: 'patient/person-emergency-contacts/order',
        method: 'PATCH',
        body: { contactIds },
      }),
      invalidatesTags: ['EmergencyContactOrder'],
    }),

    // Organization
    postOrganizationEmergencyContact: build.mutation<null, IOrganizationCommonContactModel>({
      query: (queryArg) => ({ url: 'patient/organization-emergency-contact', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['EmergencyContact'],
    }),
    patchOrganizationEmergencyContact: build.mutation<
      null,
      { contactId: string; contact: IOrganizationCommonContactModel }
    >({
      query: ({ contactId, contact }) => ({
        url: `patient/organization-emergency-contact/${contactId}`,
        method: 'PATCH',
        body: { ...contact },
      }),
      invalidatesTags: ['EmergencyContact'],
    }),
    deleteOrganizationEmergencyContact: build.mutation<null, { contactId: string }>({
      query: ({ contactId }) => ({ url: `patient/organization-emergency-contact/${contactId}`, method: 'DELETE' }),
      invalidatesTags: ['EmergencyContact'],
    }),
    patchOrganizationEmergencyContactOrder: build.mutation<null, { contactIds: string[] }>({
      query: ({ contactIds }) => ({
        url: 'patient/organization-emergency-contacts/order',
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

  usePatchPersonEmergencyContactMutation,
  usePostPersonEmergencyContactMutation,
  useDeletePersonEmergencyContactMutation,
  usePatchPersonEmergencyContactOrderMutation,

  usePostOrganizationEmergencyContactMutation,
  usePatchOrganizationEmergencyContactMutation,
  useDeleteOrganizationEmergencyContactMutation,
  usePatchOrganizationEmergencyContactOrderMutation,
} = emergencyContactApi
