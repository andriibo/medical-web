import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Profile'],
  endpoints: (build) => ({
    getPatientProfile: build.query<any, {}>({
      query: () => ({
        url: 'patient/my-profile',
      }),
      providesTags: ['Profile'],
    }),
    getDoctorProfile: build.query<any, {}>({
      query: () => ({
        url: 'doctor/my-profile',
      }),
      providesTags: ['Profile'],
    }),
  }),
})

export const { useGetPatientProfileQuery, useGetDoctorProfileQuery } = profileApi
