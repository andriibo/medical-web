import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { ISuggestedContact, ISuggestedContactRequest } from '~models/suggested-contact.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const suggestedContactApi = createApi({
  reducerPath: 'suggestedContactApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Suggested'],
  endpoints: (build) => ({
    getPatientSuggestedContacts: build.query<ISuggestedContact[], { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `my-suggested-contacts/${patientUserId}`,
      }),
      providesTags: ['Suggested'],
    }),
    getMySuggestedContacts: build.query<ISuggestedContact[], void>({
      query: () => ({
        url: 'patient/suggested-contacts',
      }),
      providesTags: ['Suggested'],
    }),

    postSuggestedContact: build.mutation<null, ISuggestedContactRequest>({
      query: (queryArg) => ({ url: 'suggested-contact', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Suggested'],
    }),
    postSuggestedContactApprove: build.mutation<null, { contactId: string }>({
      query: ({ contactId }) => ({
        url: `patient/suggested-contact/approve/${contactId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Suggested'],
    }),

    deletePatientSuggestedContact: build.mutation<null, { contactId: string }>({
      query: ({ contactId }) => ({ url: `patient/suggested-contact/${contactId}`, method: 'DELETE' }),
      invalidatesTags: ['Suggested'],
    }),
    deleteSuggestedContact: build.mutation<null, { contactId: string }>({
      query: ({ contactId }) => ({ url: `suggested-contact/${contactId}`, method: 'DELETE' }),
      invalidatesTags: ['Suggested'],
    }),
  }),
})

export const {
  useGetMySuggestedContactsQuery,
  useGetPatientSuggestedContactsQuery,
  usePostSuggestedContactApproveMutation,
  usePostSuggestedContactMutation,
  useDeletePatientSuggestedContactMutation,
  useDeleteSuggestedContactMutation,
} = suggestedContactApi
