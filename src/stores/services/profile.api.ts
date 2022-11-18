import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { IDoctorProfile, IPatientProfile, IUpdateDoctorProfile, IUpdatePatientProfile } from '~models/profie.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Profile'],
  endpoints: (build) => ({
    getPatientProfile: build.query<IPatientProfile, void>({
      query: () => ({
        url: 'patient/my-profile',
      }),
      providesTags: ['Profile'],
    }),
    patchPatientProfile: build.mutation<null, IUpdatePatientProfile>({
      query: (queryArg) => ({ url: 'patient/my-profile', method: 'PATCH', body: { ...queryArg } }),
      invalidatesTags: ['Profile'],
    }),
    getDoctorProfile: build.query<IDoctorProfile, void>({
      query: () => ({
        url: 'doctor/my-profile',
      }),
      providesTags: ['Profile'],
    }),
    patchDoctorProfile: build.mutation<null, IUpdateDoctorProfile>({
      query: (queryArg) => ({ url: 'doctor/my-profile', method: 'PATCH', body: { ...queryArg } }),
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const {
  useGetPatientProfileQuery,
  usePatchPatientProfileMutation,
  useGetDoctorProfileQuery,
  usePatchDoctorProfileMutation,
} = profileApi
