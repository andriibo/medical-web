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
    getPatientDoctors: build.query<IPatientDoctors[], void>({
      query: () => ({ url: 'patient/my-doctors' }),
      providesTags: ['Profile'],
    }),
    getCaregiverProfile: build.query<ICaregiverProfile, void>({
      query: () => ({
        url: 'caregiver/my-profile',
      }),
      providesTags: ['Profile'],
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
    patchCaregiverProfile: build.mutation<null, IUpdateCaregiverProfile>({
      query: (queryArg) => ({ url: 'caregiver/my-profile', method: 'PATCH', body: { ...queryArg } }),
      invalidatesTags: ['Profile'],
    }),
    getDoctorPatientProfile: build.query<IPatientProfile, { patientUserId: string }>({
      query: ({ patientUserId }) => ({ url: `doctor/patient-profile/${patientUserId}` }),
      providesTags: ['Profile'],
    }),
    getProfilePatients: build.query<IDoctorPatients[], void>({
      query: () => ({ url: 'profile/my-patients' }),
      providesTags: ['Profile'],
    }),
  }),
})

export const {
  useGetPatientProfileQuery,
  usePatchPatientProfileMutation,
  useGetPatientDoctorsQuery,
  useGetCaregiverProfileQuery,
  useGetDoctorProfileQuery,
  usePatchDoctorProfileMutation,
  usePatchCaregiverProfileMutation,
  useGetDoctorPatientProfileQuery,
  useGetProfilePatientsQuery,
} = profileApi
