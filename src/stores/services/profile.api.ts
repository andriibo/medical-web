import { createApi } from '@reduxjs/toolkit/dist/query/react'

import {
  ICaregiverProfile,
  IDoctorPatients,
  IDoctorProfile,
  IPatientDoctors,
  IPatientProfile,
  IUpdateCaregiverProfile,
  IUpdateDoctorProfile,
  IUpdatePatientProfile,
} from '~models/profie.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Profile'],
  endpoints: (build) => ({
    getMyPatientProfile: build.query<IPatientProfile, void>({
      query: () => ({
        url: 'patient/my-profile',
      }),
      providesTags: ['Profile'],
    }),
    patchMyPatientProfile: build.mutation<null, IUpdatePatientProfile>({
      query: (queryArg) => ({ url: 'patient/my-profile', method: 'PATCH', body: { ...queryArg } }),
      invalidatesTags: ['Profile'],
    }),
    getMyDoctors: build.query<IPatientDoctors[], void>({
      query: () => ({ url: 'patient/my-doctors' }),
      providesTags: ['Profile'],
    }),
    getMyCaregiverProfile: build.query<ICaregiverProfile, void>({
      query: () => ({
        url: 'caregiver/my-profile',
      }),
      providesTags: ['Profile'],
    }),
    getMyDoctorProfile: build.query<IDoctorProfile, void>({
      query: () => ({
        url: 'doctor/my-profile',
      }),
      providesTags: ['Profile'],
    }),
    patchMyDoctorProfile: build.mutation<null, IUpdateDoctorProfile>({
      query: (queryArg) => ({ url: 'doctor/my-profile', method: 'PATCH', body: { ...queryArg } }),
      invalidatesTags: ['Profile'],
    }),
    patchMyCaregiverProfile: build.mutation<null, IUpdateCaregiverProfile>({
      query: (queryArg) => ({ url: 'caregiver/my-profile', method: 'PATCH', body: { ...queryArg } }),
      invalidatesTags: ['Profile'],
    }),
    getMyPatients: build.query<IDoctorPatients[], void>({
      query: () => ({ url: 'profile/my-patients' }),
      providesTags: ['Profile'],
    }),
    getPatientProfile: build.query<IPatientProfile, { patientUserId: string }>({
      query: ({ patientUserId }) => ({ url: `patient-profile/${patientUserId}` }),
      providesTags: ['Profile'],
    }),
  }),
})

export const {
  useGetMyPatientProfileQuery,
  usePatchMyPatientProfileMutation,
  useGetMyDoctorsQuery,
  useGetMyCaregiverProfileQuery,
  useGetMyDoctorProfileQuery,
  usePatchMyDoctorProfileMutation,
  usePatchMyCaregiverProfileMutation,
  useGetPatientProfileQuery,
  useGetMyPatientsQuery,
} = profileApi
