import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { IMyVitalsRequest, IPatientVitalsRequest, IVitalsAbsolute, IVitalsData } from '~models/vital.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const vitalsApi = createApi({
  reducerPath: 'vitalsApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Vitals'],
  endpoints: (build) => ({
    postPatientVitals: build.mutation<null, IVitalsData>({
      query: (queryArg) => ({ url: '', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Vitals'],
    }),
    getPatientVitals: build.query<IVitalsData, IMyVitalsRequest>({
      query: ({ startDate, endDate }) => ({
        url: 'patient/my-vitals',
        params: {
          startDate,
          endDate,
        },
      }),
      providesTags: ['Vitals'],
    }),
    getPatientVitalsByDoctor: build.query<IVitalsData, IPatientVitalsRequest>({
      query: ({ patientUserId, startDate, endDate }) => ({
        url: `patient-vitals/${patientUserId}`,
        params: {
          startDate,
          endDate,
        },
      }),
      providesTags: ['Vitals'],
    }),
    getVitalsAbsolute: build.query<IVitalsAbsolute, void>({
      query: () => ({
        url: 'vitals/absolute',
      }),
      providesTags: ['Vitals'],
    }),
  }),
})

export const {
  usePostPatientVitalsMutation,
  useGetPatientVitalsQuery,
  useLazyGetPatientVitalsQuery,
  useLazyGetPatientVitalsByDoctorQuery,
  useGetPatientVitalsByDoctorQuery,
  useGetVitalsAbsoluteQuery,
} = vitalsApi
