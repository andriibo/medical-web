import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { IVitals } from '~models/vital.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const vitalsApi = createApi({
  reducerPath: 'vitalsApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Vitals'],
  endpoints: (build) => ({
    postPatientVitals: build.mutation<null, IVitals>({
      query: (queryArg) => ({ url: '', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Vitals'],
    }),
    getMyVitals: build.query<IVitals, void>({
      query: () => ({
        url: 'patient/my-vitals',
      }),
      providesTags: ['Vitals'],
    }),
    getPatientVitals: build.query<IVitals, { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `patient-vitals/${patientUserId}`,
      }),
      providesTags: ['Vitals'],
    }),
  }),
})

export const { usePostPatientVitalsMutation, useGetMyVitalsQuery, useGetPatientVitalsQuery } = vitalsApi
