import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const patientStatusApi = createApi({
  reducerPath: 'patientStatusApi',
  baseQuery: staggeredBaseQueryWithBailOut('patient-status'),
  tagTypes: ['PatientStatus'],
  endpoints: (build) => ({
    getPatientStatus: build.query<null, { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `${patientUserId}`,
      }),
      providesTags: ['PatientStatus'],
    }),
    putPatientStatusNormal: build.mutation<null, { patientUserId: string }>({
      query: ({ patientUserId }) => ({ url: `normal/${patientUserId}`, method: 'PUT' }),
      invalidatesTags: ['PatientStatus'],
    }),
    putPatientStatusBorderline: build.mutation<null, { patientUserId: string }>({
      query: ({ patientUserId }) => ({ url: `borderline/${patientUserId}`, method: 'PUT' }),
      invalidatesTags: ['PatientStatus'],
    }),
    putPatientStatusAbnormal: build.mutation<null, { patientUserId: string }>({
      query: ({ patientUserId }) => ({ url: `abnormal/${patientUserId}`, method: 'PUT' }),
      invalidatesTags: ['PatientStatus'],
    }),
  }),
})

export const {
  useGetPatientStatusQuery,
  usePutPatientStatusNormalMutation,
  usePutPatientStatusBorderlineMutation,
  usePutPatientStatusAbnormalMutation,
} = patientStatusApi
