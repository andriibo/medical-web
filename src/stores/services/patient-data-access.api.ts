import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { IDataAccessEmail, IDataAccessModel } from '~models/data-access.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const patientDataAccessApi = createApi({
  reducerPath: 'patientDataAccessApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['PatientDataAccess'],
  endpoints: (build) => ({
    postPatientDataAccessInitiateForDoctor: build.mutation<null, IDataAccessEmail>({
      query: (queryArg) => ({
        url: 'patient/data-access/initiate-for-doctor',
        method: 'POST',
        body: { ...queryArg },
      }),
      invalidatesTags: ['PatientDataAccess'],
    }),
    postPatientDataAccessInitiateForCaregiver: build.mutation<null, IDataAccessEmail>({
      query: (queryArg) => ({
        url: 'patient/data-access/initiate-for-caregiver',
        method: 'POST',
        body: { ...queryArg },
      }),
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

    postDataAccessInitiate: build.mutation<null, IDataAccessEmail>({
      query: (queryArg) => ({ url: 'data-access/initiate', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['PatientDataAccess'],
    }),
    patchDataAccessRefuse: build.mutation<null, { accessId: string }>({
      query: ({ accessId }) => ({
        url: `data-access/refuse/${accessId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['PatientDataAccess'],
    }),
    patchDataAccessApprove: build.mutation<null, { accessId: string }>({
      query: ({ accessId }) => ({
        url: `data-access/approve/${accessId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['PatientDataAccess'],
    }),
    deleteDataAccess: build.mutation<null, { accessId: string }>({
      query: ({ accessId }) => ({
        url: `data-access/${accessId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PatientDataAccess'],
    }),
    getDataAccess: build.query<IDataAccessModel[], void>({
      query: () => ({
        url: 'data-accesses',
      }),
      providesTags: ['PatientDataAccess'],
    }),
  }),
})

export const {
  usePostPatientDataAccessInitiateForDoctorMutation,
  usePostPatientDataAccessInitiateForCaregiverMutation,
  usePatchPatientDataAccessRefuseMutation,
  usePatchPatientDataAccessApproveMutation,
  useDeletePatientDataAccessMutation,
  useGetPatientDataAccessQuery,
  usePostDataAccessInitiateMutation,
  usePatchDataAccessRefuseMutation,
  usePatchDataAccessApproveMutation,
  useDeleteDataAccessMutation,
  useGetDataAccessQuery,
} = patientDataAccessApi
