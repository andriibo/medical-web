import { createApi } from '@reduxjs/toolkit/dist/query/react'

import {
  IOrganizationSuggestedContactRequest,
  IPersonSuggestedContactRequest,
  ISuggestedContacts,
} from '~models/suggested-contact.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const suggestedContactApi = createApi({
  reducerPath: 'suggestedContactApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Suggested'],
  endpoints: (build) => ({
    getPatientSuggestedContacts: build.query<ISuggestedContacts, void>({
      query: () => ({
        url: 'patient/suggested-contacts',
      }),
      providesTags: ['Suggested'],
    }),
    getSuggestedContacts: build.query<ISuggestedContacts, { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `suggested-contacts/${patientUserId}`,
      }),
      providesTags: ['Suggested'],
    }),

    // person
    postPersonSuggestedContact: build.mutation<null, IPersonSuggestedContactRequest>({
      query: (queryArg) => ({ url: 'person-suggested-contact', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Suggested'],
    }),
    postPersonSuggestedContactApprove: build.mutation<null, { contactId: string }>({
      query: ({ contactId }) => ({
        url: `patient/person-suggested-contact/approve/${contactId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Suggested'],
    }),
    deletePatientPersonSuggestedContact: build.mutation<null, { contactId: string }>({
      query: ({ contactId }) => ({ url: `patient/person-suggested-contact/${contactId}`, method: 'DELETE' }),
      invalidatesTags: ['Suggested'],
    }),
    deletePersonSuggestedContact: build.mutation<null, { contactId: string }>({
      query: ({ contactId }) => ({ url: `person-suggested-contact/${contactId}`, method: 'DELETE' }),
      invalidatesTags: ['Suggested'],
    }),

    // organization
    postOrganizationSuggestedContact: build.mutation<null, IOrganizationSuggestedContactRequest>({
      query: (queryArg) => ({ url: 'organization-suggested-contact', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Suggested'],
    }),
    postOrganizationSuggestedContactApprove: build.mutation<null, { contactId: string }>({
      query: ({ contactId }) => ({
        url: `patient/organization-suggested-contact/approve/${contactId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Suggested'],
    }),
    deletePatientOrganizationSuggestedContact: build.mutation<null, { contactId: string }>({
      query: ({ contactId }) => ({ url: `patient/organization-suggested-contact/${contactId}`, method: 'DELETE' }),
      invalidatesTags: ['Suggested'],
    }),
    deleteOrganizationSuggestedContact: build.mutation<null, { contactId: string }>({
      query: ({ contactId }) => ({ url: `organization-suggested-contact/${contactId}`, method: 'DELETE' }),
      invalidatesTags: ['Suggested'],
    }),
  }),
})

export const {
  useGetPatientSuggestedContactsQuery,
  useGetSuggestedContactsQuery,

  usePostPersonSuggestedContactMutation,
  usePostPersonSuggestedContactApproveMutation,
  useDeletePatientPersonSuggestedContactMutation,
  useDeletePersonSuggestedContactMutation,

  usePostOrganizationSuggestedContactMutation,
  usePostOrganizationSuggestedContactApproveMutation,
  useDeletePatientOrganizationSuggestedContactMutation,
  useDeleteOrganizationSuggestedContactMutation,
} = suggestedContactApi
