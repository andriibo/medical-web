import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { IDataAccessEmail, IDataAccessModel } from '~models/data-access.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const patientDataAccessApi = createApi({
  reducerPath: 'patientDataAccessApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['PatientDataAccess'],
  endpoints: (build) => ({
    postPatientDataAccessInitiate: build.mutation<null, IDataAccessEmail>({
      query: (queryArg) => ({ url: 'patient/data-access/initiate', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['PatientDataAccess'],
    }),
    patchPatientDataAccessRefuse: build.mutation<null, { accessId: string }>({
      query: ({ accessId }) => ({
        url: `patient/data-access/refuse/${accessId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['PatientDataAccess'],
    }),
    patchPatientDataAccessApprove: build.mutation<null, { accessId: string }>({
      query: ({ accessId }) => ({
        url: `patient/data-access/approve/${accessId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['PatientDataAccess'],
    }),
    deletePatientDataAccess: build.mutation<null, { accessId: string }>({
      query: ({ accessId }) => ({
        url: `patient/data-access/${accessId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PatientDataAccess'],
    }),
    getPatientDataAccess: build.query<IDataAccessModel[], void>({
      query: () => ({
        url: 'patient/data-accesses',
      }),
      providesTags: ['PatientDataAccess'],
    }),
  }),
})

export const {
  usePostPatientDataAccessInitiateMutation,
  usePatchPatientDataAccessRefuseMutation,
  usePatchPatientDataAccessApproveMutation,
  useDeletePatientDataAccessMutation,
  useGetPatientDataAccessQuery,
} = patientDataAccessApi
